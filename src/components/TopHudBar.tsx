import React from 'react';
import {
  AlertTriangle,
  BookOpen,
  Compass,
  EyeOff,
  HeartHandshake,
  Pause,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AmbientTheme, ResourceMeters } from '../types/game';
import { AMBIENT_THEME_LABELS } from '../utils/audio';

interface TopHudBarProps {
  chapterNumber: number;
  locationLabel: string;
  dateLabel: string;
  ambientTheme: AmbientTheme;
  meters: ResourceMeters;
  muted: boolean;
  onToggleMute: () => void;
  onOpenArchive: () => void;
  onPause: () => void;
}

function getResolveStatus(val: number): { label: string; colorClass: string } {
  if (val >= 65) return { label: 'STEADY', colorClass: 'text-[#73B58E]' };
  if (val >= 35) return { label: 'STRAINED', colorClass: 'text-[#D99B38]' };
  return { label: 'CRITICAL', colorClass: 'text-[#D66A5A]' };
}

function getStealthStatus(val: number): { label: string; colorClass: string } {
  if (val >= 65) return { label: 'HIDDEN', colorClass: 'text-[#73B58E]' };
  if (val >= 35) return { label: 'WATCHED', colorClass: 'text-[#D99B38]' };
  return { label: 'EXPOSED', colorClass: 'text-[#D66A5A]' };
}

function getNetworkStatus(val: number): { label: string; colorClass: string } {
  if (val >= 65) return { label: 'TRUSTED', colorClass: 'text-[#73B58E]' };
  if (val >= 40) return { label: 'GUARDED', colorClass: 'text-[#D99B38]' };
  return { label: 'ISOLATED', colorClass: 'text-[#D66A5A]' };
}

function getRiskStatus(val: number): { label: string; colorClass: string } {
  if (val >= 75) return { label: 'MANHUNT', colorClass: 'text-[#D66A5A]' };
  if (val >= 50) return { label: 'PURSUIT CLOSE', colorClass: 'text-[#D66A5A]' };
  if (val >= 25) return { label: 'ELEVATED', colorClass: 'text-[#D99B38]' };
  return { label: 'LOW', colorClass: 'text-[#73B58E]' };
}

export const TopHudBar: React.FC<TopHudBarProps> = ({
  chapterNumber,
  locationLabel,
  dateLabel,
  ambientTheme,
  meters,
  muted,
  onToggleMute,
  onOpenArchive,
  onPause,
}) => {
  const resolveState = getResolveStatus(meters.resolve);
  const stealthState = getStealthStatus(meters.stealth);
  const networkState = getNetworkStatus(meters.network);
  const riskState = getRiskStatus(meters.cumulativeRisk);

  return (
    <header className="w-full border-b border-[#E2D5B9]/12 bg-[#11161E]/95 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
      {/* Location & Date Readout */}
      <div className="flex items-center gap-3 min-w-0">
        <Compass className="w-4 h-4 text-[#D99B38] shrink-0" aria-hidden="true" />
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:text-sm min-w-0">
          <span className="font-semibold text-[#F6EBD4] truncate">
            {locationLabel}
          </span>
          <span className="text-[#A99C82]/60" aria-hidden="true">·</span>
          <span className="text-[#A99C82] font-mono-tabular text-xs whitespace-nowrap">
            Ch. {chapterNumber}/10 · {dateLabel}
          </span>
        </div>
      </div>

      {/* Survival, Moral & Cumulative Risk Meters (Tabular Nums + Explicit Text Status) */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-5">
        <div className="flex items-center gap-1.5 text-xs font-mono-tabular" title="Physical stamina and party morale">
          <HeartHandshake className="w-3.5 h-3.5 text-[#C4B79C] shrink-0" aria-hidden="true" />
          <span className="text-[#A99C82]">Resolve</span>
          <span className="font-semibold text-[#F6EBD4]">{meters.resolve}</span>
          <span className={`font-medium ${resolveState.colorClass}`}>{resolveState.label}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono-tabular" title="Secrecy from patrollers and federal marshals">
          <EyeOff className="w-3.5 h-3.5 text-[#C4B79C] shrink-0" aria-hidden="true" />
          <span className="text-[#A99C82]">Stealth</span>
          <span className="font-semibold text-[#F6EBD4]">{meters.stealth}</span>
          <span className={`font-medium ${stealthState.colorClass}`}>{stealthState.label}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono-tabular" title="Standing with Vigilance Committees and stationmasters">
          <Compass className="w-3.5 h-3.5 text-[#C4B79C] shrink-0" aria-hidden="true" />
          <span className="text-[#A99C82]">Network</span>
          <span className="font-semibold text-[#F6EBD4]">{meters.network}</span>
          <span className={`font-medium ${networkState.colorClass}`}>{networkState.label}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono-tabular" title="Cumulative pursuit exposure from risky choices">
          <AlertTriangle className="w-3.5 h-3.5 text-[#C4B79C] shrink-0" aria-hidden="true" />
          <span className="text-[#A99C82]">Risk</span>
          <span className="font-semibold text-[#F6EBD4]">{meters.cumulativeRisk}</span>
          <span className={`font-medium ${riskState.colorClass}`}>{riskState.label}</span>
        </div>
      </div>

      {/* Functional Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenArchive}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#EDE3CE] hover:text-[#F6EBD4] bg-[#181F29] hover:bg-[#222B38] border border-[#E2D5B9]/15 rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B38] whitespace-nowrap shrink-0 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#D99B38]" aria-hidden="true" />
          <span>Field Ledger</span>
        </button>

        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? 'Unmute ambient audio' : `Mute ambient audio (${AMBIENT_THEME_LABELS[ambientTheme]})`}
          title={muted ? 'Unmute audio (M)' : `Ambient: ${AMBIENT_THEME_LABELS[ambientTheme]} · Press M to mute`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#EDE3CE] hover:text-[#F6EBD4] bg-[#181F29] hover:bg-[#222B38] border border-[#E2D5B9]/15 rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B38] whitespace-nowrap shrink-0 cursor-pointer"
        >
          {muted ? (
            <>
              <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Muted</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#D99B38]" aria-hidden="true" />
              <span>{AMBIENT_THEME_LABELS[ambientTheme]}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onPause}
          aria-label="Pause game"
          title="Pause (Esc)"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#EDE3CE] hover:text-[#F6EBD4] bg-[#181F29] hover:bg-[#222B38] border border-[#E2D5B9]/15 rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B38] whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Pause className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Pause</span>
        </button>
      </div>
    </header>
  );
};
