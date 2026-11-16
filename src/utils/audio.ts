import { AmbientTheme } from '../types/game';

export const AMBIENT_THEME_LABELS: Record<AmbientTheme, string> = {
  forest_night: 'Winter Pines',
  swamp_night: 'Swamp Night',
  town_study: 'Busy Town & Study',
  train_frontier: 'Distant Train',
  niagara_falls: 'Niagara Gorge',
  sanctuary_dawn: 'Chapel Dawn',
};

interface ActiveAmbientLayer {
  gain: GainNode;
  stop: () => void;
}

class NarrativeAudioEngine {
  private ctx: AudioContext | null = null;
  private muted = false;
  private masterAmbientGain: GainNode | null = null;
  private currentTheme: AmbientTheme | null = null;
  private activeLayer: ActiveAmbientLayer | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    if (!this.masterAmbientGain && this.ctx) {
      this.masterAmbientGain = this.ctx.createGain();
      this.masterAmbientGain.gain.setValueAtTime(this.muted ? 0 : 0.75, this.ctx.currentTime);
      this.masterAmbientGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer && this.noiseBuffer.sampleRate === ctx.sampleRate) {
      return this.noiseBuffer;
    }
    const length = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      // Soft pink/brownian shaping for natural wind & water
      lastOut = (lastOut + 0.04 * white) / 1.04;
      data[i] = lastOut * 2.8;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.ctx && this.masterAmbientGain) {
      const now = this.ctx.currentTime;
      this.masterAmbientGain.gain.cancelScheduledValues(now);
      this.masterAmbientGain.gain.setTargetAtTime(muted ? 0 : 0.75, now, 0.15);
    }
    if (!muted && this.currentTheme) {
      this.setAmbientTheme(this.currentTheme, true);
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public unlockAndPlay(theme: AmbientTheme): void {
    this.currentTheme = theme;
    if (this.muted) return;
    this.setAmbientTheme(theme, true);
  }

  public setAmbientTheme(theme: AmbientTheme | null, forceRestart = false): void {
    if (!theme) {
      this.stopAmbient();
      this.currentTheme = null;
      return;
    }

    if (!forceRestart && this.currentTheme === theme && this.activeLayer) {
      return;
    }

    this.currentTheme = theme;
    if (this.muted) return;

    const ctx = this.ensureContext();
    if (!ctx || !this.masterAmbientGain) return;

    // Fade out previous ambient bed smoothly
    if (this.activeLayer) {
      const oldLayer = this.activeLayer;
      const now = ctx.currentTime;
      oldLayer.gain.gain.cancelScheduledValues(now);
      oldLayer.gain.gain.setTargetAtTime(0.0001, now, 0.35);
      window.setTimeout(() => {
        oldLayer.stop();
      }, 1400);
      this.activeLayer = null;
    }

    this.activeLayer = this.createAmbientLayer(ctx, this.masterAmbientGain, theme);
  }

  public stopAmbient(): void {
    if (!this.activeLayer || !this.ctx) return;
    const oldLayer = this.activeLayer;
    const now = this.ctx.currentTime;
    oldLayer.gain.gain.cancelScheduledValues(now);
    oldLayer.gain.gain.setTargetAtTime(0.0001, now, 0.25);
    window.setTimeout(() => oldLayer.stop(), 1000);
    this.activeLayer = null;
  }

  private createAmbientLayer(
    ctx: AudioContext,
    destination: AudioNode,
    theme: AmbientTheme
  ): ActiveAmbientLayer {
    const now = ctx.currentTime;
    const layerGain = ctx.createGain();
    layerGain.gain.setValueAtTime(0.0001, now);
    layerGain.gain.setTargetAtTime(1, now, 0.55);
    layerGain.connect(destination);

    const stopCallbacks: Array<() => void> = [];
    const intervals: number[] = [];

    const createNoiseLoop = (filterType: BiquadFilterType, freq: number, q: number, volume: number) => {
      const src = ctx.createBufferSource();
      src.buffer = this.getNoiseBuffer(ctx);
      src.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.setValueAtTime(freq, now);
      filter.Q.setValueAtTime(q, now);

      const g = ctx.createGain();
      g.gain.setValueAtTime(volume, now);

      src.connect(filter);
      filter.connect(g);
      g.connect(layerGain);
      src.start(now);

      stopCallbacks.push(() => {
        try {
          src.stop();
          src.disconnect();
        } catch {
          // ignore
        }
      });

      return { filter, gain: g };
    };

    if (theme === 'forest_night') {
      const wind = createNoiseLoop('bandpass', 320, 0.9, 0.08);
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.11, now);
      lfoGain.gain.setValueAtTime(110, now);
      lfo.connect(lfoGain);
      lfoGain.connect(wind.filter.frequency);
      lfo.start(now);
      stopCallbacks.push(() => {
        try {
          lfo.stop();
        } catch {
          // ignore
        }
      });

      // Soft nocturnal drone
      const drone = ctx.createOscillator();
      const droneGain = ctx.createGain();
      drone.type = 'sine';
      drone.frequency.setValueAtTime(98, now);
      droneGain.gain.setValueAtTime(0.018, now);
      drone.connect(droneGain);
      droneGain.connect(layerGain);
      drone.start(now);
      stopCallbacks.push(() => {
        try {
          drone.stop();
        } catch {
          // ignore
        }
      });
    } else if (theme === 'swamp_night') {
      // Tidal reed water & marsh air
      const water = createNoiseLoop('bandpass', 480, 1.4, 0.09);
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.22, now);
      lfoGain.gain.setValueAtTime(190, now);
      lfo.connect(lfoGain);
      lfoGain.connect(water.filter.frequency);
      lfo.start(now);
      stopCallbacks.push(() => {
        try {
          lfo.stop();
        } catch {
          // ignore
        }
      });

      // Subtle marsh cricket/frog nocturnal pulse every ~2.8s
      const marshTimer = window.setInterval(() => {
        if (this.muted || ctx.state !== 'running') return;
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(215 + Math.random() * 25, t);
        osc.frequency.exponentialRampToValueAtTime(175, t + 0.14);
        g.gain.setValueAtTime(0.0005, t);
        g.gain.linearRampToValueAtTime(0.015, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
        osc.connect(g);
        g.connect(layerGain);
        osc.start(t);
        osc.stop(t + 0.18);
      }, 2800);
      intervals.push(marshTimer);
    } else if (theme === 'town_study') {
      // Muffled street bustle + warm hearth & lamp ambiance
      createNoiseLoop('lowpass', 220, 0.7, 0.09);

      // Gentle hearth crackle / wooden study creak
      const townTimer = window.setInterval(() => {
        if (this.muted || ctx.state !== 'running') return;
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const g = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140 + Math.random() * 180, t);
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(650 + Math.random() * 500, t);

        g.gain.setValueAtTime(0.0005, t);
        g.gain.linearRampToValueAtTime(0.012, t + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

        osc.connect(filter);
        filter.connect(g);
        g.connect(layerGain);
        osc.start(t);
        osc.stop(t + 0.14);
      }, 1700);
      intervals.push(townTimer);
    } else if (theme === 'train_frontier') {
      // Winter wind bed + distant rail chug & mournful steam whistle
      createNoiseLoop('lowpass', 260, 0.8, 0.08);

      const triggerWhistle = () => {
        if (this.muted || ctx.state !== 'running') return;
        const t = ctx.currentTime;
        const freqs = [311.13, 392.0, 466.16]; // Distant Eb minor-ish steam whistle triad
        freqs.forEach((f) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const g = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f * 0.985, t);
          osc.frequency.linearRampToValueAtTime(f, t + 0.18);
          osc.frequency.linearRampToValueAtTime(f * 0.975, t + 1.45);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(900, t);

          g.gain.setValueAtTime(0.0001, t);
          g.gain.linearRampToValueAtTime(0.016, t + 0.25);
          g.gain.setValueAtTime(0.015, t + 0.9);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 1.55);

          osc.connect(filter);
          filter.connect(g);
          g.connect(layerGain);
          osc.start(t);
          osc.stop(t + 1.6);
        });
      };

      // Play initial faint distant whistle shortly after entering rail chapters, then repeat sparsely
      const firstWhistle = window.setTimeout(triggerWhistle, 1200);
      stopCallbacks.push(() => window.clearTimeout(firstWhistle));

      const whistleInterval = window.setInterval(triggerWhistle, 9500);
      intervals.push(whistleInterval);
    } else if (theme === 'niagara_falls') {
      // Deep Niagara cataract roar + high gorge mist wind
      createNoiseLoop('lowpass', 210, 0.6, 0.14);
      const mist = createNoiseLoop('bandpass', 720, 0.7, 0.045);
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.14, now);
      lfoGain.gain.setValueAtTime(220, now);
      lfo.connect(lfoGain);
      lfoGain.connect(mist.filter.frequency);
      lfo.start(now);
      stopCallbacks.push(() => {
        try {
          lfo.stop();
        } catch {
          // ignore
        }
      });
    } else if (theme === 'sanctuary_dawn') {
      // Calm winter morning wind + warm open harmonic pad
      createNoiseLoop('lowpass', 240, 0.7, 0.05);
      const freqs = [146.83, 220.0]; // D3 + A3
      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        g.gain.setValueAtTime(0.016, now);
        osc.connect(g);
        g.connect(layerGain);
        osc.start(now);
        stopCallbacks.push(() => {
          try {
            osc.stop();
          } catch {
            // ignore
          }
        });
      });
    }

    return {
      gain: layerGain,
      stop: () => {
        intervals.forEach((id) => window.clearInterval(id));
        stopCallbacks.forEach((fn) => fn());
        try {
          layerGain.disconnect();
        } catch {
          // ignore
        }
      },
    };
  }

  public playSelect(): void {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(196, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playSanctuaryChime(): void {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [293.66, 440.0];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.001, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.045, now + idx * 0.06 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.06 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.48);
    });
  }

  public playDangerPulse(): void {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(98, now);
    osc.frequency.linearRampToValueAtTime(76, now + 0.25);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(240, now);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  public playFreedomChord(): void {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [261.63, 329.63, 392.0, 523.25];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.045, now + idx * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.08 + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.95);
    });
  }
}

export const audioEngine = new NarrativeAudioEngine();
