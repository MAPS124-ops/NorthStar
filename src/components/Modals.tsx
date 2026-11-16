import React, { useState } from 'react';
import { Award, BookOpen, Lock, RotateCcw, ShieldCheck, Undo2, X } from 'lucide-react';
import { ACHIEVEMENTS } from '../data/achievements';
import { NPC_PROFILES } from '../data/npcs';
import { SCENE_IMAGES, STORY_NODES } from '../data/storyNodes';
import {
  ChronicleEntry,
  NpcId,
  PlayerInventory,
  ResourceMeters,
  StoryNode,
  UnlockedAchievement,
} from '../types/game';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onReturnTitle: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onReturnTitle,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-title"
    >
      <div className="w-full max-w-md rounded-lg bg-[#121821] border border-[#E2D5B9]/20 p-6 space-y-5 shadow-2xl animate-panel-enter">
        <div className="flex items-center justify-between">
          <h2 id="pause-title" className="font-display text-2xl font-semibold text-[#F6EBD4]">
            Journey Paused
          </h2>
          <button
            type="button"
            onClick={onResume}
            aria-label="Resume game"
            className="p-1.5 text-[#A99C82] hover:text-[#F6EBD4] rounded cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B38]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[#C4B79C] leading-relaxed">
          Your route progress, survival meters, and Field Ledger remain saved automatically.
        </p>

        <div className="rounded-md bg-[#0D1117] border border-[#E2D5B9]/10 p-3.5 text-xs text-[#C4B79C] space-y-1.5 font-mono-tabular">
          <div className="flex justify-between">
            <span>Select Decision</span>
            <span className="text-[#EDE3CE]">Keys 1 – 3</span>
          </div>
          <div className="flex justify-between">
            <span>Seek Figure Counsel</span>
            <span className="text-[#EDE3CE]">Key C</span>
          </div>
          <div className="flex justify-between">
            <span>Historical Context</span>
            <span className="text-[#EDE3CE]">Key H</span>
          </div>
          <div className="flex justify-between">
            <span>Mute / Unmute Audio</span>
            <span className="text-[#EDE3CE]">Key M</span>
          </div>
          <div className="flex justify-between">
            <span>Pause / Resume</span>
            <span className="text-[#EDE3CE]">Key Esc</span>
          </div>
        </div>

        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={onResume}
            className="w-full py-2.5 px-4 text-sm font-semibold bg-[#D99B38] hover:bg-[#E4AA4C] text-[#0D1117] rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6EBD4]"
          >
            Resume Journey
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="w-full py-2.5 px-4 text-sm font-medium bg-[#181F29] hover:bg-[#222B38] text-[#EDE3CE] border border-[#E2D5B9]/15 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B38]"
          >
            Restart Journey
          </button>
          <button
            type="button"
            onClick={onReturnTitle}
            className="w-full py-2 px-4 text-xs font-medium text-[#A99C82] hover:text-[#EDE3CE] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B38] rounded"
          >
            Return to Title Screen
          </button>
        </div>
      </div>
    </div>
  );
};

interface FieldLedgerModalProps {
  chronicle: ChronicleEntry[];
  metNpcs: NpcId[];
  trustedAllies: NpcId[];
  unlockedAchievements: UnlockedAchievement[];
  initialTab?: 'chronicle' | 'figures' | 'achievements';
  onClose: () => void;
}

export const FieldLedgerModal: React.FC<FieldLedgerModalProps> = ({
  chronicle,
  metNpcs,
  trustedAllies,
  unlockedAchievements,
  initialTab = 'chronicle',
  onClose,
}) => {
  const [tab, setTab] = useState<'chronicle' | 'figures' | 'achievements'>(initialTab);
  const allNpcIds: NpcId[] = [
    'harriet_tubman',
    'thomas_garrett',
    'william_still',
    'jermain_loguen',
    'frederick_douglass',
  ];

  const unlockedMap = new Map(unlockedAchievements.map((u) => [u.id, u.unlockedAt]));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ledger-title"
    >
      <div className="w-full max-w-2xl max-h-[86vh] flex flex-col rounded-lg bg-[#121821] border border-[#E2D5B9]/20 shadow-2xl animate-panel-enter overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2D5B9]/12">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#D99B38]" aria-hidden="true" />
            <h2 id="ledger-title" className="font-display text-xl font-semibold text-[#F6EBD4]">
              Field Ledger &amp; Milestones
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close ledger"
            className="p-1.5 text-[#A99C82] hover:text-[#F6EBD4] rounded cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B38]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Segmented Control Tabs */}
        <div className="px-6 pt-3 pb-2 border-b border-[#E2D5B9]/10 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setTab('chronicle')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              tab === 'chronicle'
                ? 'bg-[#D99B38] text-[#0D1117] font-semibold'
                : 'bg-[#181F29] text-[#C4B79C] hover:text-[#F6EBD4]'
            }`}
          >
            Journey Chronicle ({chronicle.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('figures')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              tab === 'figures'
                ? 'bg-[#D99B38] text-[#0D1117] font-semibold'
                : 'bg-[#181F29] text-[#C4B79C] hover:text-[#F6EBD4]'
            }`}
          >
            Historical Figures ({metNpcs.length}/{allNpcIds.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('achievements')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              tab === 'achievements'
                ? 'bg-[#D99B38] text-[#0D1117] font-semibold'
                : 'bg-[#181F29] text-[#C4B79C] hover:text-[#F6EBD4]'
            }`}
          >
            Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto ledger-scroll space-y-5 flex-1">
          {tab === 'chronicle' && (
            chronicle.length === 0 ? (
              <p className="text-sm text-[#A99C82]">
                No decisions recorded yet. Your choices, risk tallies, and historical outcomes will appear here as you travel north.
              </p>
            ) : (
              <div className="space-y-4">
                {chronicle.map((entry, idx) => (
                  <div
                    key={`${entry.nodeId}-${idx}`}
                    className="border-b border-[#E2D5B9]/10 pb-4 last:border-b-0 last:pb-0 space-y-1.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular">
                      <span className="text-[#D99B38]">
                        {entry.locationLabel} · {entry.dateLabel}
                      </span>
                      <span className="text-[#A99C82]">
                        {entry.riskTier} RISK ({entry.riskDelta >= 0 ? `+${entry.riskDelta}` : entry.riskDelta})
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-[#F6EBD4]">
                      {entry.title} — {entry.choiceLabel}
                    </div>
                    <p className="text-xs text-[#C4B79C] leading-relaxed">
                      {entry.outcomeSummary}
                    </p>
                  </div>
                ))}
              </div>
            )
          )}

          {tab === 'figures' && (
            <div className="space-y-4">
              {allNpcIds.map((npcId) => {
                const profile = NPC_PROFILES[npcId];
                const met = metNpcs.includes(npcId);
                const allied = trustedAllies.includes(npcId);

                return (
                  <div
                    key={npcId}
                    className="rounded-md bg-[#0E131B] border border-[#E2D5B9]/12 p-4 space-y-2"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <span className="font-display text-base font-semibold text-[#F6EBD4]">
                          {profile.name}
                        </span>
                        <span className="text-xs font-mono-tabular text-[#A99C82] ml-2">
                          {profile.lifespan}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-mono-tabular font-medium ${
                          allied
                            ? 'text-[#73B58E]'
                            : met
                              ? 'text-[#D99B38]'
                              : 'text-[#7D899B]'
                        }`}
                      >
                        {allied ? 'TRUSTED ALLY' : met ? 'ENCOUNTERED' : 'AHEAD ON CORRIDOR'}
                      </span>
                    </div>
                    <div className="text-xs text-[#D99B38]">{profile.role}</div>
                    <p className="text-xs text-[#D5C9B1] leading-relaxed">
                      {profile.biography}
                    </p>
                    <blockquote className="text-xs italic text-[#A99C82] pt-1">
                      {profile.historicalQuote}
                    </blockquote>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'achievements' && (
            <div className="space-y-3">
              <p className="text-xs text-[#A99C82]">
                Milestones persist across journeys on this browser to recognize historical outcomes and moral choices.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ACHIEVEMENTS.map((ach) => {
                  const unlockedAt = unlockedMap.get(ach.id);
                  const isUnlocked = Boolean(unlockedAt);

                  return (
                    <div
                      key={ach.id}
                      className={`rounded-md border p-4 space-y-2 transition-colors ${
                        isUnlocked
                          ? 'bg-[#151D27] border-[#D99B38]/40'
                          : 'bg-[#0E131B]/75 border-[#E2D5B9]/10 opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${
                              isUnlocked
                                ? 'bg-[#D99B38]/15 border-[#D99B38]/60 text-[#D99B38]'
                                : 'bg-[#0D1117] border-[#E2D5B9]/15 text-[#64748B]'
                            }`}
                            aria-hidden="true"
                          >
                            {isUnlocked ? (
                              <Award className="w-4 h-4" />
                            ) : (
                              <Lock className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-[#F6EBD4] leading-snug">
                              {ach.title}
                            </div>
                            <div className="text-[11px] font-mono-tabular text-[#A99C82]">
                              {ach.category}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-[#D5C9B1] leading-relaxed">
                        {isUnlocked ? ach.description : ach.criteriaHint}
                      </p>

                      <div className="text-[11px] font-mono-tabular pt-0.5">
                        {isUnlocked ? (
                          <span className="text-[#73B58E]">
                            UNLOCKED · {new Date(unlockedAt as string).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-[#7D899B]">LOCKED</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface EndingScreenProps {
  endingNode: StoryNode;
  meters: ResourceMeters;
  inventory: PlayerInventory;
  chronicle: ChronicleEntry[];
  unlockedAchievements: UnlockedAchievement[];
  canRevisitLast: boolean;
  onRevisitLast: () => void;
  onOpenAchievements: () => void;
  onPlayAgain: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({
  endingNode,
  meters,
  inventory,
  chronicle,
  unlockedAchievements,
  canRevisitLast,
  onRevisitLast,
  onOpenAchievements,
  onPlayAgain,
}) => {
  const [showChronicle, setShowChronicle] = useState(false);
  const paragraphs = endingNode.narrative(inventory, meters);
  const sceneSrc = SCENE_IMAGES[endingNode.imageKey];

  const isVictory =
    endingNode.endingType === 'FREEDOM_SOLIDARITY' ||
    endingNode.endingType === 'FREEDOM_SOLITARY' ||
    endingNode.endingType === 'VIGILANCE_RESCUE';

  const statusHeading =
    endingNode.endingType === 'FREEDOM_SOLIDARITY'
      ? 'Outcome · Freedom Reached in Solidarity'
      : endingNode.endingType === 'FREEDOM_SOLITARY'
        ? 'Outcome · Freedom Won Across the Gorge'
        : endingNode.endingType === 'VIGILANCE_RESCUE'
          ? 'Outcome · Delivered by Vigilance Rescue'
          : 'Outcome · Intercepted Under the 1850 Act';

  return (
    <main className="min-h-screen w-full bg-[#0D1117] text-[#EDE3CE] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl rounded-lg bg-[#121821] border border-[#E2D5B9]/18 overflow-hidden shadow-2xl animate-panel-enter">
        {/* Hero Ending Artwork */}
        <div className="relative h-52 sm:h-64 w-full overflow-hidden bg-[#0D1117]">
          <img
            src={sceneSrc}
            alt={endingNode.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center opacity-85"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(18,24,33,0.15) 0%, rgba(18,24,33,0.72) 68%, rgba(18,24,33,1) 100%)',
            }}
          />
          <div className="absolute bottom-5 left-6 right-6 space-y-1.5">
            <div
              className={`text-xs font-mono-tabular font-semibold ${
                isVictory ? 'text-[#73B58E]' : 'text-[#D66A5A]'
              }`}
            >
              {statusHeading} · {endingNode.locationLabel}
            </div>
            <h1
              className="font-display text-3xl sm:text-4xl font-semibold text-[#F6EBD4]"
              style={{ textWrap: 'balance' }}
            >
              {endingNode.title}
            </h1>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Epilogue Prose */}
          <div className="space-y-4 max-w-[68ch] text-base leading-[1.7] text-[#E4DAC4]">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Risk vs. Reward & Moral Ledger Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 border-y border-[#E2D5B9]/12 py-4 font-mono-tabular text-xs">
            <div>
              <div className="text-[#A99C82]">Final Resolve</div>
              <div className="text-lg font-semibold text-[#F6EBD4] mt-0.5">{meters.resolve}</div>
            </div>
            <div>
              <div className="text-[#A99C82]">Final Stealth</div>
              <div className="text-lg font-semibold text-[#F6EBD4] mt-0.5">{meters.stealth}</div>
            </div>
            <div>
              <div className="text-[#A99C82]">Network Standing</div>
              <div className="text-lg font-semibold text-[#F6EBD4] mt-0.5">{meters.network}</div>
            </div>
            <div>
              <div className="text-[#A99C82]">Cumulative Risk</div>
              <div
                className={`text-lg font-semibold mt-0.5 ${
                  meters.cumulativeRisk >= 60 ? 'text-[#D66A5A]' : 'text-[#D99B38]'
                }`}
              >
                {meters.cumulativeRisk}
              </div>
            </div>
            <div>
              <div className="text-[#A99C82]">Achievements</div>
              <div className="text-lg font-semibold text-[#73B58E] mt-0.5">
                {unlockedAchievements.length}/{ACHIEVEMENTS.length}
              </div>
            </div>
          </div>

          {/* Allies, Routes & Moral Milestones */}
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-md bg-[#0E131B] border border-[#E2D5B9]/10 p-4 space-y-2">
              <div className="font-semibold text-[#F6EBD4] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#73B58E]" aria-hidden="true" />
                <span>Allies &amp; Safer Routes Earned</span>
              </div>
              <div className="text-[#C4B79C]">
                <span className="text-[#A99C82]">Trusted Allies: </span>
                {inventory.trustedAllies.length > 0
                  ? inventory.trustedAllies.map((id) => NPC_PROFILES[id].name).join(', ')
                  : 'None formalized'}
              </div>
              <div className="text-[#C4B79C]">
                <span className="text-[#A99C82]">Safer Routes: </span>
                {inventory.saferRoutesUnlocked.length > 0
                  ? inventory.saferRoutesUnlocked.join(', ')
                  : 'Independent footpaths'}
              </div>
              <div className="text-[#C4B79C]">
                <span className="text-[#A99C82]">William Still’s Ledger: </span>
                {inventory.trueNameRecorded ? 'True Lineage Preserved' : 'Traveled Under Alias'}
              </div>
            </div>

            <div className="rounded-md bg-[#0E131B] border border-[#E2D5B9]/10 p-4 space-y-1.5">
              <div className="font-semibold text-[#D99B38]">
                Historical Note: {endingNode.historicalNote.heading}
              </div>
              <p className="text-[#D5C9B1] leading-relaxed">
                {endingNode.historicalNote.body}
              </p>
              <div className="text-[#A99C82] italic">
                {endingNode.historicalNote.sourceAttribution}
              </div>
            </div>
          </div>

          {/* Optional Expandable Chronicle */}
          {showChronicle && chronicle.length > 0 && (
            <div className="rounded-md bg-[#0E131B] border border-[#E2D5B9]/12 p-4 max-h-60 overflow-y-auto ledger-scroll space-y-3">
              {chronicle.map((c, idx) => (
                <div key={idx} className="text-xs border-b border-[#E2D5B9]/8 pb-2.5 last:border-b-0 last:pb-0">
                  <div className="font-mono-tabular text-[#D99B38]">
                    {c.locationLabel} · {c.riskTier} RISK ({c.riskDelta >= 0 ? `+${c.riskDelta}` : c.riskDelta})
                  </div>
                  <div className="font-semibold text-[#F6EBD4]">{c.choiceLabel}</div>
                  <div className="text-[#C4B79C]">{c.outcomeSummary}</div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onPlayAgain}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[#D99B38] hover:bg-[#E4AA4C] text-[#0D1117] rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6EBD4] whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Play Again</span>
              </button>

              {canRevisitLast && (
                <button
                  type="button"
                  onClick={onRevisitLast}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-[#181F29] hover:bg-[#222B38] text-[#EDE3CE] border border-[#E2D5B9]/15 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B38] whitespace-nowrap shrink-0"
                >
                  <Undo2 className="w-4 h-4 text-[#D99B38]" aria-hidden="true" />
                  <span>Revisit Last Crossroads</span>
                </button>
              )}

              <button
                type="button"
                onClick={onOpenAchievements}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-[#181F29] hover:bg-[#222B38] text-[#EDE3CE] border border-[#E2D5B9]/15 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B38] whitespace-nowrap shrink-0"
              >
                <Award className="w-4 h-4 text-[#D99B38]" aria-hidden="true" />
                <span>View Achievements</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowChronicle((prev) => !prev)}
              className="px-3.5 py-2 text-xs font-medium text-[#C4B79C] hover:text-[#F6EBD4] underline underline-offset-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B38] rounded"
            >
              {showChronicle ? 'Hide Full Chronicle' : `Review Full Chronicle (${chronicle.length})`}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export const __verifyNodesExport = STORY_NODES;
