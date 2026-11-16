import { useCallback, useEffect, useState } from 'react';
import { Award, X } from 'lucide-react';
import { FieldLedgerModal, EndingScreen, PauseModal } from './components/Modals';
import { NarrativePanel } from './components/NarrativePanel';
import { RouteMap } from './components/RouteMap';
import { TitleScreen } from './components/TitleScreen';
import { TopHudBar } from './components/TopHudBar';
import { ACHIEVEMENTS } from './data/achievements';
import {
  INITIAL_INVENTORY,
  INITIAL_METERS,
  STORY_NODES,
} from './data/storyNodes';
import {
  AchievementDefinition,
  ChoiceEffects,
  ChronicleEntry,
  GameScreenState,
  GameSnapshot,
  NpcId,
  PlayerInventory,
  ResourceMeters,
  StationId,
  StoryChoice,
  StoryNode,
  UnlockedAchievement,
} from './types/game';
import { audioEngine } from './utils/audio';
import {
  clearSavedGame,
  loadMutedPreference,
  loadSavedGame,
  loadUnlockedAchievements,
  SavedGameData,
  saveGameProgress,
  saveMutedPreference,
  saveUnlockedAchievements,
} from './utils/storage';

function clampMeter(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export default function App() {
  const [savedGame, setSavedGame] = useState<SavedGameData | null>(() => loadSavedGame());
  const [unlockedAchievements, setUnlockedAchievements] = useState<UnlockedAchievement[]>(() =>
    loadUnlockedAchievements()
  );
  const [achievementToast, setAchievementToast] = useState<AchievementDefinition | null>(null);

  const [screen, setScreen] = useState<GameScreenState>('TITLE_MENU');
  const [currentNodeId, setCurrentNodeId] = useState<string>('dorchester_departure');
  const [meters, setMeters] = useState<ResourceMeters>(INITIAL_METERS);
  const [inventory, setInventory] = useState<PlayerInventory>(INITIAL_INVENTORY);
  const [visitedStations, setVisitedStations] = useState<StationId[]>(['dorchester']);
  const [chronicle, setChronicle] = useState<ChronicleEntry[]>([]);
  const [metNpcs, setMetNpcs] = useState<NpcId[]>([]);
  const [counseledNodes, setCounseledNodes] = useState<string[]>([]);
  const [lastOutcome, setLastOutcome] = useState<ChoiceEffects | null>(null);
  const [historyStack, setHistoryStack] = useState<GameSnapshot[]>([]);

  const [showHistoryDrawer, setShowHistoryDrawer] = useState<boolean>(false);
  const [ledgerTab, setLedgerTab] = useState<'chronicle' | 'figures' | 'achievements' | null>(null);
  const [muted, setMuted] = useState<boolean>(() => {
    const initialMuted = loadMutedPreference();
    audioEngine.setMuted(initialMuted);
    return initialMuted;
  });

  const currentNode = STORY_NODES[currentNodeId] || STORY_NODES.dorchester_departure;

  const evaluateAchievements = useCallback(
    (targetNode: StoryNode, targetMeters: ResourceMeters, targetInventory: PlayerInventory) => {
      setUnlockedAchievements((prev) => {
        const existingIds = new Set(prev.map((a) => a.id));
        const newlyUnlocked: AchievementDefinition[] = [];
        const now = new Date().toISOString();

        for (const def of ACHIEVEMENTS) {
          if (
            !existingIds.has(def.id) &&
            def.checkUnlocked({
              currentNode: targetNode,
              meters: targetMeters,
              inventory: targetInventory,
            })
          ) {
            newlyUnlocked.push(def);
          }
        }

        if (newlyUnlocked.length === 0) return prev;

        const updated = [
          ...prev,
          ...newlyUnlocked.map((def) => ({ id: def.id, unlockedAt: now })),
        ];
        saveUnlockedAchievements(updated);
        setAchievementToast(newlyUnlocked[0]);
        return updated;
      });
    },
    []
  );

  // Auto-dismiss milestone toast after 4.5 seconds
  useEffect(() => {
    if (!achievementToast) return;
    const timer = window.setTimeout(() => {
      setAchievementToast(null);
    }, 4500);
    return () => window.clearTimeout(timer);
  }, [achievementToast]);

  // Dynamically switch background ambient soundscape based on node theme
  useEffect(() => {
    if (screen === 'TITLE_MENU') {
      audioEngine.setAmbientTheme(null);
      return;
    }
    audioEngine.setAmbientTheme(currentNode.ambientTheme);
  }, [screen, currentNode.ambientTheme]);

  // Stop ambient soundscape cleanly on unmount
  useEffect(() => {
    return () => {
      audioEngine.stopAmbient();
    };
  }, []);

  // Automatically persist progress whenever playing or viewing an ending
  useEffect(() => {
    if (screen === 'TITLE_MENU') return;

    const payload = {
      isEnding: Boolean(currentNode.isEnding),
      currentNodeId,
      meters,
      inventory,
      visitedStations,
      chronicle,
      metNpcs,
      counseledNodes,
      lastOutcome,
      historyStack,
    };

    saveGameProgress(payload);
    setSavedGame({
      ...payload,
      version: 1,
      savedAt: new Date().toISOString(),
    });
  }, [
    screen,
    currentNode.isEnding,
    currentNodeId,
    meters,
    inventory,
    visitedStations,
    chronicle,
    metNpcs,
    counseledNodes,
    lastOutcome,
    historyStack,
  ]);

  const startFreshJourney = useCallback(() => {
    clearSavedGame();
    setSavedGame(null);
    setCurrentNodeId('dorchester_departure');
    setMeters(INITIAL_METERS);
    setInventory(INITIAL_INVENTORY);
    setVisitedStations(['dorchester']);
    setChronicle([]);
    setMetNpcs([]);
    setCounseledNodes([]);
    setLastOutcome(null);
    setHistoryStack([]);
    setShowHistoryDrawer(false);
    setLedgerTab(null);
    setAchievementToast(null);
    audioEngine.unlockAndPlay(STORY_NODES.dorchester_departure.ambientTheme);
    audioEngine.playSanctuaryChime();
    setScreen('PLAYING');
  }, []);

  const continueSavedJourney = useCallback(() => {
    const data = loadSavedGame() ?? savedGame;
    if (!data) {
      startFreshJourney();
      return;
    }
    const targetNode = STORY_NODES[data.currentNodeId] || STORY_NODES.dorchester_departure;
    setCurrentNodeId(targetNode.id);
    setMeters(data.meters);
    setInventory(data.inventory);
    setVisitedStations(data.visitedStations);
    setChronicle(data.chronicle);
    setMetNpcs(data.metNpcs);
    setCounseledNodes(data.counseledNodes);
    setLastOutcome(data.lastOutcome);
    setHistoryStack(data.historyStack || []);
    setShowHistoryDrawer(false);
    setLedgerTab(null);
    audioEngine.unlockAndPlay(targetNode.ambientTheme);
    audioEngine.playSelect();
    setScreen(targetNode.isEnding ? 'GAME_OVER' : 'PLAYING');
  }, [savedGame, startFreshJourney]);

  const handleReturnToTitle = useCallback(() => {
    setLedgerTab(null);
    setShowHistoryDrawer(false);
    audioEngine.setAmbientTheme(null);
    setScreen('TITLE_MENU');
  }, []);

  const handleToggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      audioEngine.setMuted(next);
      saveMutedPreference(next);
      if (!next && screen !== 'TITLE_MENU') {
        audioEngine.unlockAndPlay(currentNode.ambientTheme);
      }
      return next;
    });
  }, [screen, currentNode.ambientTheme]);

  const handleSeekCounsel = useCallback(() => {
    if (!currentNode.npcEncounter || counseledNodes.includes(currentNode.id)) return;

    audioEngine.playSanctuaryChime();
    const { npcId, counselBonus } = currentNode.npcEncounter;

    setCounseledNodes((prev) => [...prev, currentNode.id]);
    setMetNpcs((prev) => (prev.includes(npcId) ? prev : [...prev, npcId]));

    if (counselBonus) {
      setMeters((prev) => ({
        resolve: clampMeter(prev.resolve + (counselBonus.resolveDelta ?? 0)),
        stealth: clampMeter(prev.stealth + (counselBonus.stealthDelta ?? 0)),
        network: clampMeter(prev.network + (counselBonus.networkDelta ?? 0)),
        cumulativeRisk: clampMeter(prev.cumulativeRisk + (counselBonus.riskDelta ?? 0)),
      }));
    }
  }, [currentNode, counseledNodes]);

  const handleSelectChoice = useCallback(
    (choice: StoryChoice) => {
      const snapshot: GameSnapshot = {
        currentNodeId,
        meters,
        inventory,
        visitedStations,
        chronicle,
        metNpcs,
        counseledNodes,
      };

      const { nextNodeId: rawNextId, effects } = choice.resolveChoice(meters, inventory);

      const nextMeters: ResourceMeters = {
        resolve: clampMeter(meters.resolve + (effects.resolveDelta ?? 0)),
        stealth: clampMeter(meters.stealth + (effects.stealthDelta ?? 0)),
        network: clampMeter(meters.network + (effects.networkDelta ?? 0)),
        cumulativeRisk: clampMeter(meters.cumulativeRisk + (effects.riskDelta ?? 0)),
      };

      const nextAllies =
        effects.addAlly && !inventory.trustedAllies.includes(effects.addAlly)
          ? [...inventory.trustedAllies, effects.addAlly]
          : inventory.trustedAllies;

      const nextRoutes =
        effects.unlockRoute && !inventory.saferRoutesUnlocked.includes(effects.unlockRoute)
          ? [...inventory.saferRoutesUnlocked, effects.unlockRoute]
          : inventory.saferRoutesUnlocked;

      const nextInventory: PlayerInventory = {
        ...inventory,
        ...(effects.setFlags ?? {}),
        rations: Math.max(0, inventory.rations + (effects.rationsDelta ?? 0)),
        silverCoins: Math.max(0, inventory.silverCoins + (effects.coinsDelta ?? 0)),
        trustedAllies: nextAllies,
        saferRoutesUnlocked: nextRoutes,
      };

      let finalNextNodeId = rawNextId;
      const candidateNode = STORY_NODES[rawNextId];

      if (!candidateNode?.isEnding) {
        if (nextMeters.resolve <= 0 || nextMeters.cumulativeRisk >= 100 || nextMeters.stealth <= 0) {
          finalNextNodeId =
            nextMeters.network >= 60 ? 'ending_vigilance_rescue' : 'ending_intercepted';
        }
      }

      const nextNode = STORY_NODES[finalNextNodeId] || STORY_NODES.ending_intercepted;

      let updatedMetNpcs = metNpcs;
      if (currentNode.npcEncounter && !updatedMetNpcs.includes(currentNode.npcEncounter.npcId)) {
        updatedMetNpcs = [...updatedMetNpcs, currentNode.npcEncounter.npcId];
      }
      if (nextNode.npcEncounter && !updatedMetNpcs.includes(nextNode.npcEncounter.npcId)) {
        updatedMetNpcs = [...updatedMetNpcs, nextNode.npcEncounter.npcId];
      }

      const newChronicleEntry: ChronicleEntry = {
        nodeId: currentNode.id,
        stationId: currentNode.stationId,
        locationLabel: currentNode.locationLabel,
        dateLabel: currentNode.dateLabel,
        title: currentNode.title,
        choiceLabel: choice.label,
        riskTier: choice.riskTier,
        riskDelta: effects.riskDelta ?? 0,
        outcomeSummary: effects.outcomeSummary,
        tone: effects.tone,
        historicalHeading: currentNode.historicalNote.heading,
      };

      setHistoryStack((prev) => [...prev, snapshot]);
      setMeters(nextMeters);
      setInventory(nextInventory);
      setChronicle((prev) => [...prev, newChronicleEntry]);
      setMetNpcs(updatedMetNpcs);
      setLastOutcome(effects);
      setShowHistoryDrawer(false);
      setCurrentNodeId(finalNextNodeId);
      setVisitedStations((prev) =>
        prev.includes(nextNode.stationId) ? prev : [...prev, nextNode.stationId]
      );

      evaluateAchievements(nextNode, nextMeters, nextInventory);

      if (nextNode.isEnding) {
        if (nextNode.endingType === 'INTERCEPTED') {
          audioEngine.playDangerPulse();
        } else {
          audioEngine.playFreedomChord();
        }
        setScreen('GAME_OVER');
      } else {
        if (effects.tone === 'danger') {
          audioEngine.playDangerPulse();
        } else if (effects.tone === 'sanctuary') {
          audioEngine.playSanctuaryChime();
        } else {
          audioEngine.playSelect();
        }
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [
      currentNode,
      currentNodeId,
      meters,
      inventory,
      visitedStations,
      chronicle,
      metNpcs,
      counseledNodes,
      evaluateAchievements,
    ]
  );

  const handleRevisitLast = useCallback(() => {
    const last = historyStack[historyStack.length - 1];
    if (!last) return;
    audioEngine.playSelect();
    setCurrentNodeId(last.currentNodeId);
    setMeters(last.meters);
    setInventory(last.inventory);
    setVisitedStations(last.visitedStations);
    setChronicle(last.chronicle);
    setMetNpcs(last.metNpcs);
    setCounseledNodes(last.counseledNodes);
    setHistoryStack((prev) => prev.slice(0, -1));
    setLastOutcome(null);
    setScreen('PLAYING');
  }, [historyStack]);

  // Global Keyboard Shortcuts during Active Play & Pause
  useEffect(() => {
    if (screen !== 'PLAYING' && screen !== 'PAUSED') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        if (ledgerTab) {
          setLedgerTab(null);
        } else {
          setScreen((prev) => (prev === 'PLAYING' ? 'PAUSED' : 'PLAYING'));
        }
        return;
      }

      if (screen !== 'PLAYING' || ledgerTab) return;

      const lower = e.key.toLowerCase();
      if (lower === 'h') {
        e.preventDefault();
        setShowHistoryDrawer((prev) => !prev);
      } else if (lower === 'c') {
        e.preventDefault();
        handleSeekCounsel();
      } else if (lower === 'm') {
        e.preventDefault();
        handleToggleMute();
      } else if (['1', '2', '3'].includes(e.key)) {
        const idx = Number(e.key) - 1;
        const choice = currentNode.choices[idx];
        if (!choice) return;
        const c = choice.condition;
        const ok =
          !c ||
          ((!c.requiresItem || inventory[c.requiresItem]) &&
            (c.minRations === undefined || inventory.rations >= c.minRations) &&
            (c.minCoins === undefined || inventory.silverCoins >= c.minCoins) &&
            (c.minNetwork === undefined || meters.network >= c.minNetwork) &&
            (c.minStealth === undefined || meters.stealth >= c.minStealth) &&
            (c.minResolve === undefined || meters.resolve >= c.minResolve) &&
            (c.maxRisk === undefined || meters.cumulativeRisk <= c.maxRisk));
        if (ok) {
          e.preventDefault();
          handleSelectChoice(choice);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    screen,
    ledgerTab,
    currentNode,
    inventory,
    meters,
    handleSelectChoice,
    handleSeekCounsel,
    handleToggleMute,
  ]);

  const toastBanner = achievementToast && (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-40 max-w-sm rounded-md bg-[#151D27] border border-[#D99B38]/60 px-4 py-3 shadow-2xl flex items-start gap-3 animate-panel-enter"
    >
      <Award className="w-5 h-5 text-[#D99B38] shrink-0 mt-0.5" aria-hidden="true" />
      <div className="space-y-0.5 flex-1">
        <div className="text-[11px] font-mono-tabular font-semibold text-[#D99B38]">
          Milestone Unlocked · {achievementToast.category}
        </div>
        <div className="text-sm font-semibold text-[#F6EBD4]">
          {achievementToast.title}
        </div>
        <div className="text-xs text-[#C4B79C]">
          Recorded in your Field Ledger.
        </div>
      </div>
      <button
        type="button"
        onClick={() => setAchievementToast(null)}
        aria-label="Dismiss milestone notification"
        className="text-[#A99C82] hover:text-[#F6EBD4] p-0.5 rounded cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );

  if (screen === 'TITLE_MENU') {
    return (
      <TitleScreen
        savedGame={savedGame}
        onContinue={continueSavedJourney}
        onStartNew={startFreshJourney}
        muted={muted}
        onToggleMute={handleToggleMute}
      />
    );
  }

  if (screen === 'GAME_OVER') {
    return (
      <>
        <EndingScreen
          endingNode={currentNode}
          meters={meters}
          inventory={inventory}
          chronicle={chronicle}
          unlockedAchievements={unlockedAchievements}
          canRevisitLast={historyStack.length > 0}
          onRevisitLast={handleRevisitLast}
          onOpenAchievements={() => setLedgerTab('achievements')}
          onPlayAgain={startFreshJourney}
        />
        {ledgerTab && (
          <FieldLedgerModal
            chronicle={chronicle}
            metNpcs={metNpcs}
            trustedAllies={inventory.trustedAllies}
            unlockedAchievements={unlockedAchievements}
            initialTab={ledgerTab}
            onClose={() => setLedgerTab(null)}
          />
        )}
        {toastBanner}
      </>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0D1117] text-[#EDE3CE] flex flex-col">
      <TopHudBar
        chapterNumber={currentNode.chapterNumber}
        locationLabel={currentNode.locationLabel}
        dateLabel={currentNode.dateLabel}
        ambientTheme={currentNode.ambientTheme}
        meters={meters}
        muted={muted}
        onToggleMute={handleToggleMute}
        onOpenArchive={() => setLedgerTab('chronicle')}
        onPause={() => setScreen('PAUSED')}
      />

      <main className="flex-1 w-full max-w-[1380px] mx-auto px-4 sm:px-6 py-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-5 xl:col-span-4">
          <RouteMap
            currentStationId={currentNode.stationId}
            visitedStations={visitedStations}
            inventory={inventory}
          />
        </div>

        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          <NarrativePanel
            node={currentNode}
            inventory={inventory}
            meters={meters}
            lastOutcome={lastOutcome}
            hasCounseledCurrentNode={counseledNodes.includes(currentNode.id)}
            showHistoryDrawer={showHistoryDrawer}
            onToggleHistoryDrawer={() => setShowHistoryDrawer((prev) => !prev)}
            onSeekCounsel={handleSeekCounsel}
            onSelectChoice={handleSelectChoice}
          />
        </div>
      </main>

      {screen === 'PAUSED' && (
        <PauseModal
          onResume={() => setScreen('PLAYING')}
          onRestart={startFreshJourney}
          onReturnTitle={handleReturnToTitle}
        />
      )}

      {ledgerTab && (
        <FieldLedgerModal
          chronicle={chronicle}
          metNpcs={metNpcs}
          trustedAllies={inventory.trustedAllies}
          unlockedAchievements={unlockedAchievements}
          initialTab={ledgerTab}
          onClose={() => setLedgerTab(null)}
        />
      )}

      {toastBanner}
    </div>
  );
}
