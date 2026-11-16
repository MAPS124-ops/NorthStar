import React, { useEffect } from 'react';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { SCENE_IMAGES, STORY_NODES } from '../data/storyNodes';
import { SavedGameData } from '../utils/storage';

interface TitleScreenProps {
  savedGame: SavedGameData | null;
  onContinue: () => void;
  onStartNew: () => void;
  muted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  savedGame,
  onContinue,
  onStartNew,
  muted,
  onToggleMute,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (savedGame) {
          onContinue();
        } else {
          onStartNew();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [savedGame, onContinue, onStartNew]);

  const savedNode = savedGame ? STORY_NODES[savedGame.currentNodeId] : null;

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#0D1117] text-[#EDE3CE] flex flex-col justify-between">
      {/* Atmospheric Illustrated Key-Art Backdrop */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <img
          src={SCENE_IMAGES.lantern}
          alt="Winter forest river clearing under the North Star with a glowing brass lantern"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center opacity-85"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(95deg, rgba(13,17,23,0.94) 0%, rgba(13,17,23,0.78) 44%, rgba(13,17,23,0.28) 78%, rgba(13,17,23,0.42) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(13,17,23,0.55) 0%, transparent 25%, transparent 72%, rgba(13,17,23,0.92) 100%)',
          }}
        />
      </div>

      {/* Minimal Top Utility Row */}
      <div className="relative z-10 flex items-center justify-between px-6 sm:px-12 pt-6">
        <div className="text-xs tracking-wide text-[#C4B79C] font-mono-tabular">
          November 1854 · Maryland to Canada West
        </div>
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? 'Unmute audio' : 'Mute audio'}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#EDE3CE]/80 hover:text-[#EDE3CE] bg-[#161C25]/80 border border-[#E2D5B9]/15 rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B38] whitespace-nowrap shrink-0 cursor-pointer"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#D99B38]" />}
          <span>{muted ? 'Audio Muted' : 'Audio On'}</span>
        </button>
      </div>

      {/* Hero Title Lockup over Calm Negative Space */}
      <section className="relative z-10 flex-1 flex items-center px-6 sm:px-12 py-10">
        <div className="max-w-xl space-y-7 animate-panel-enter">
          {/* Bespoke Inline SVG North Star & Compass Rose Emblem */}
          <div className="flex items-center gap-4">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="shrink-0"
            >
              <circle cx="24" cy="24" r="21" stroke="#D99B38" strokeOpacity="0.45" strokeWidth="1" />
              <circle cx="24" cy="24" r="14" stroke="#E2D5B9" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="2 3" />
              <path
                d="M24 3L26.9 21.1L45 24L26.9 26.9L24 45L21.1 26.9L3 24L21.1 21.1L24 3Z"
                fill="#D99B38"
                fillOpacity="0.92"
              />
              <circle cx="24" cy="24" r="2.2" fill="#0D1117" />
            </svg>
            <div className="text-xs font-medium tracking-wider text-[#D99B38]">
              Interactive Historical Narrative
            </div>
          </div>

          <div className="space-y-4">
            <h1
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#F6EBD4] leading-[1.08]"
              style={{ textWrap: 'balance' }}
            >
              Following the North Star
            </h1>
            <p className="text-base sm:text-lg text-[#D5C9B1] leading-relaxed max-w-lg">
              Four years after the Fugitive Slave Act of 1850, no northern state offers safe harbor.
              Chart a winter passage from Dorchester County, Maryland to St. Catharines, Canada West—weighing
              secrecy, survival, and moral solidarity at every station.
            </p>
          </div>

          {savedGame && savedNode ? (
            <div className="pt-2 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onContinue}
                  className="px-7 py-3.5 text-base font-semibold bg-[#D99B38] hover:bg-[#E4AA4C] active:translate-y-px text-[#0D1117] rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6EBD4] whitespace-nowrap shrink-0 cursor-pointer shadow-lg shadow-black/40"
                >
                  {savedGame.isEnding ? 'Review Saved Ending' : 'Continue Saved Journey'}
                </button>
                <button
                  type="button"
                  onClick={onStartNew}
                  className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium bg-[#161C25]/90 hover:bg-[#1E2733] text-[#EDE3CE] border border-[#E2D5B9]/20 rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B38] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-[#D99B38]" aria-hidden="true" />
                  <span>Start New Journey</span>
                </button>
              </div>
              <div className="text-xs font-mono-tabular text-[#C4B79C]">
                Saved Progress ·{' '}
                {savedGame.isEnding
                  ? `${savedNode.title} (${savedNode.locationLabel})`
                  : `Chapter ${savedNode.chapterNumber} of 10 · ${savedNode.locationLabel}`}
              </div>
            </div>
          ) : (
            <div className="pt-2 flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={onStartNew}
                className="px-7 py-3.5 text-base font-semibold bg-[#D99B38] hover:bg-[#E4AA4C] active:translate-y-px text-[#0D1117] rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6EBD4] whitespace-nowrap shrink-0 cursor-pointer shadow-lg shadow-black/40"
              >
                Begin Journey
              </button>
              <span className="text-sm text-[#A99C82]">
                10 historical stations · 4 endings · Progress auto-saved
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Single Flat Control-Hint Line */}
      <footer className="relative z-10 px-6 sm:px-12 pb-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#A99C82] font-mono-tabular">
        <div>Enter / Space Start · 1–3 Choose · C Seek Counsel · H Historical Context · Esc Pause</div>
        <div>Featuring Harriet Tubman, Thomas Garrett, William Still, Jermain Loguen &amp; Frederick Douglass</div>
      </footer>
    </main>
  );
};
