import React from 'react';
import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  MessageSquareQuote,
  ShieldCheck,
} from 'lucide-react';
import { NPC_PROFILES } from '../data/npcs';
import { SCENE_IMAGES } from '../data/storyNodes';
import {
  ChoiceEffects,
  PlayerInventory,
  ResourceMeters,
  RiskTier,
  StoryChoice,
  StoryNode,
} from '../types/game';

interface NarrativePanelProps {
  node: StoryNode;
  inventory: PlayerInventory;
  meters: ResourceMeters;
  lastOutcome: ChoiceEffects | null;
  hasCounseledCurrentNode: boolean;
  showHistoryDrawer: boolean;
  onToggleHistoryDrawer: () => void;
  onSeekCounsel: () => void;
  onSelectChoice: (choice: StoryChoice) => void;
}

function getRiskLabelAndStyle(tier: RiskTier): { label: string; className: string } {
  switch (tier) {
    case 'LOW':
      return { label: 'Low Risk', className: 'text-[#73B58E]' };
    case 'CALCULATED':
      return { label: 'Calculated Risk', className: 'text-[#D99B38]' };
    case 'HIGH':
      return { label: 'High Risk', className: 'text-[#D66A5A]' };
  }
}

export const NarrativePanel: React.FC<NarrativePanelProps> = ({
  node,
  inventory,
  meters,
  lastOutcome,
  hasCounseledCurrentNode,
  showHistoryDrawer,
  onToggleHistoryDrawer,
  onSeekCounsel,
  onSelectChoice,
}) => {
  const paragraphs = node.narrative(inventory, meters);
  const sceneSrc = SCENE_IMAGES[node.imageKey];
  const npcProfile = node.npcEncounter ? NPC_PROFILES[node.npcEncounter.npcId] : null;

  const isChoiceAvailable = (choice: StoryChoice): boolean => {
    const c = choice.condition;
    if (!c) return true;
    if (c.requiresItem && !inventory[c.requiresItem]) return false;
    if (c.minRations !== undefined && inventory.rations < c.minRations) return false;
    if (c.minCoins !== undefined && inventory.silverCoins < c.minCoins) return false;
    if (c.minNetwork !== undefined && meters.network < c.minNetwork) return false;
    if (c.minStealth !== undefined && meters.stealth < c.minStealth) return false;
    if (c.minResolve !== undefined && meters.resolve < c.minResolve) return false;
    if (c.maxRisk !== undefined && meters.cumulativeRisk > c.maxRisk) return false;
    if (c.requiresClara && !inventory.travelingWithClara) return false;
    return true;
  };

  return (
    <section
      key={node.id}
      className="flex flex-col bg-[#121821] border border-[#E2D5B9]/12 rounded-lg overflow-hidden animate-panel-enter"
    >
      {/* Scene Vignette Header Artwork */}
      <div className="relative h-40 sm:h-48 w-full overflow-hidden bg-[#0D1117]">
        <img
          src={sceneSrc}
          alt={node.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center opacity-80"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(18,24,33,0.12) 0%, rgba(18,24,33,0.62) 65%, rgba(18,24,33,1) 100%)',
          }}
        />
        <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs font-mono-tabular text-[#D99B38] mb-1">
              Chapter {node.chapterNumber} · {node.dateLabel} · {node.locationLabel}
            </div>
            <h1
              className="font-display text-2xl sm:text-3xl font-semibold text-[#F6EBD4] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              {node.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Narrative Body & Decision Area */}
      <div className="p-5 sm:p-7 space-y-5 flex-1 flex flex-col">
        {/* Previous Choice Outcome Banner */}
        {lastOutcome && (
          <div
            className={`rounded-md border px-4 py-3 text-sm flex items-start gap-3 ${
              lastOutcome.tone === 'sanctuary'
                ? 'bg-[#13221C]/70 border-[#73B58E]/30 text-[#D7EDE0]'
                : lastOutcome.tone === 'danger'
                  ? 'bg-[#261617]/75 border-[#D66A5A]/35 text-[#F2D5D0]'
                  : 'bg-[#221D15]/75 border-[#D99B38]/30 text-[#EDE3CE]'
            }`}
          >
            {lastOutcome.tone === 'danger' ? (
              <AlertTriangle className="w-4 h-4 text-[#D66A5A] shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <ShieldCheck
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  lastOutcome.tone === 'sanctuary' ? 'text-[#73B58E]' : 'text-[#D99B38]'
                }`}
                aria-hidden="true"
              />
            )}
            <div className="space-y-0.5">
              <div className="text-xs font-mono-tabular font-semibold">
                {lastOutcome.tone === 'sanctuary'
                  ? 'Outcome · Safe Passage'
                  : lastOutcome.tone === 'danger'
                    ? 'Outcome · High Alert'
                    : 'Outcome · Measured Risk'}
              </div>
              <p className="leading-relaxed text-[#E2D5B9]">{lastOutcome.outcomeSummary}</p>
            </div>
          </div>
        )}

        {/* Literary Historical Prose */}
        <div className="space-y-3.5 max-w-[65ch] text-[15.5px] sm:text-base leading-[1.68] text-[#E4DAC4]">
          {paragraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* Historical Figure Interactive NPC Encounter */}
        {node.npcEncounter && npcProfile && (
          <div className="rounded-md bg-[#161D28] border border-[#D99B38]/25 p-4 space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Bespoke Archival Monogram Seal */}
                <div
                  className="w-10 h-10 rounded-full bg-[#0D1117] border border-[#D99B38]/50 flex items-center justify-center font-display text-sm font-semibold text-[#D99B38] shrink-0"
                  aria-hidden="true"
                >
                  {npcProfile.name
                    .replace('Rev. ', '')
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#F6EBD4]">
                    {npcProfile.name}
                    <span className="text-xs font-mono-tabular text-[#A99C82] font-normal ml-2">
                      ({npcProfile.lifespan})
                    </span>
                  </div>
                  <div className="text-xs text-[#C4B79C]">{npcProfile.role}</div>
                </div>
              </div>

              {!hasCounseledCurrentNode && (
                <button
                  type="button"
                  onClick={onSeekCounsel}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#D99B38]/15 hover:bg-[#D99B38]/25 text-[#F6EBD4] border border-[#D99B38]/45 rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B38] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <MessageSquareQuote className="w-3.5 h-3.5 text-[#D99B38]" aria-hidden="true" />
                  <span>Seek Counsel (C)</span>
                </button>
              )}
            </div>

            <p className="text-xs sm:text-[13px] text-[#D5C9B1] leading-relaxed">
              {node.npcEncounter.greeting}
            </p>

            {hasCounseledCurrentNode && (
              <div className="border-t border-[#E2D5B9]/12 pt-3 space-y-2 animate-panel-enter">
                <div className="text-xs font-medium text-[#D99B38]">
                  You ask: {node.npcEncounter.counselQuestion}
                </div>
                <blockquote className="text-xs sm:text-[13.5px] italic text-[#F6EBD4] leading-relaxed">
                  {node.npcEncounter.counselResponse}
                </blockquote>
                <div className="text-xs font-mono-tabular text-[#73B58E]">
                  {node.npcEncounter.counselInsight}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Risk vs. Reward Decision Section */}
        <div className="pt-2 space-y-3 border-t border-[#E2D5B9]/10">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-base sm:text-lg font-semibold text-[#F6EBD4]">
              {node.dilemmaPrompt}
            </h2>
            <span className="hidden sm:inline text-xs font-mono-tabular text-[#A99C82]">
              Press 1–{node.choices.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {node.choices.map((choice, index) => {
              const available = isChoiceAvailable(choice);
              const riskMeta = getRiskLabelAndStyle(choice.riskTier);
              return (
                <button
                  key={choice.id}
                  type="button"
                  disabled={!available}
                  onClick={() => available && onSelectChoice(choice)}
                  className={`w-full text-left rounded-md border px-4 py-3.5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B38] min-h-[54px] ${
                    available
                      ? 'bg-[#181F29] hover:bg-[#1F2835] hover:border-[#D99B38]/60 border-[#E2D5B9]/15 cursor-pointer group'
                      : 'bg-[#141920]/60 border-[#E2D5B9]/8 opacity-55 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`font-mono-tabular text-xs font-semibold px-2 py-0.5 rounded border shrink-0 mt-0.5 ${
                        available
                          ? 'bg-[#0D1117] border-[#D99B38]/40 text-[#D99B38] group-hover:bg-[#D99B38] group-hover:text-[#0D1117]'
                          : 'bg-[#0D1117] border-[#E2D5B9]/15 text-[#7D899B]'
                      } transition-colors duration-150`}
                    >
                      {index + 1}
                    </span>
                    <div className="space-y-1 flex-1">
                      <div className="text-sm sm:text-[15px] font-semibold text-[#F6EBD4] group-hover:text-white leading-snug">
                        {choice.label}
                      </div>
                      <p className="text-xs sm:text-[13px] text-[#C4B79C] leading-relaxed">
                        {choice.detail}
                      </p>
                      {/* Clean Unboxed Risk vs. Reward Line */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-mono-tabular pt-0.5">
                        <span className={`font-semibold ${riskMeta.className}`}>
                          {riskMeta.label} ({choice.riskPointsLabel})
                        </span>
                        <span className="text-[#A99C82]/50" aria-hidden="true">·</span>
                        <span className="text-[#D5C9B1]">
                          {available ? choice.rewardSummary : choice.unavailableReason}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Collapsible Historical Context Drawer (H) */}
        <div className="mt-auto pt-3 border-t border-[#E2D5B9]/10">
          <button
            type="button"
            onClick={onToggleHistoryDrawer}
            aria-expanded={showHistoryDrawer}
            className="w-full flex items-center justify-between gap-3 py-2 text-left text-xs font-medium text-[#C4B79C] hover:text-[#F6EBD4] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B38] rounded"
          >
            <span className="inline-flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-[#D99B38]" aria-hidden="true" />
              <span>Historical Context: {node.historicalNote.heading}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono-tabular text-[#A99C82] shrink-0">
              <span>Key H</span>
              {showHistoryDrawer ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </span>
          </button>

          {showHistoryDrawer && (
            <div className="mt-2 rounded-md bg-[#0E131B] border border-[#E2D5B9]/12 p-4 space-y-2 text-xs leading-relaxed text-[#D5C9B1] animate-panel-enter">
              <div className="font-mono-tabular text-[#D99B38]">
                {node.historicalNote.yearContext}
              </div>
              <p>{node.historicalNote.body}</p>
              <div className="text-[#A99C82] italic pt-1">
                Source: {node.historicalNote.sourceAttribution}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
