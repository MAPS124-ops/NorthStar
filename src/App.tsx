import { useCallback, useEffect, useState } from 'react';
import { FieldLedgerModal, EndingScreen, PauseModal } from './components/Modals';
import { NarrativePanel } from './components/NarrativePanel';
import { RouteMap } from './components/RouteMap';
import { TitleScreen } from './components/TitleScreen';
import { TopHudBar } from './components/TopHudBar';
import {
  INITIAL_INVENTORY,
  INITIAL_METERS,
  STORY_NODES,
} from './data/storyNodes';
import {
  ChoiceEffects,
  ChronicleEntry,
  GameScreenState,
  GameSnapshot,
  NpcId,
  PlayerInventory,
  ResourceMeters,
  StationId,
  StoryChoice,
} from './types/game';
import { audioEngine } from './utils/audio';

function clampMeter(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export default function App() {
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
  const [showLedgerModal, setShowLedgerModal] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);

  const currentNode = STORY_NODES[currentNodeId] || STORY_NODES.dorchester_departure;

  const resetGame = useCallback((targetScreen: GameScreenState = 'PLAYING') => {
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
    setShowLedgerModal(false);
    setScreen(targetScreen);
  }, []);

  const handleStart = useCallback(() => {
    audioEngine.playSanctuaryChime();
    resetGame('PLAYING');
  }, [resetGame]);

  const handleToggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      audioEngine.setMuted(next);
      return next;
    });
  }, []);

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
      // Save snapshot so player can revisit the last crossroads if desired
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

      // Check failure conditions from Resolve=0 or CumulativeRisk=100 / Stealth=0
      let finalNextNodeId = rawNextId;
      const candidateNode = STORY_NODES[rawNextId];

      if (!candidateNode?.isEnding) {
        if (nextMeters.resolve <= 0 || nextMeters.cumulativeRisk >= 100 || nextMeters.stealth <= 0) {
          finalNextNodeId =
            nextMeters.network >= 60 ? 'ending_vigilance_rescue' : 'ending_intercepted';
        }
      }

      const nextNode = STORY_NODES[finalNextNodeId] || STORY_NODES.ending_intercepted;

      // Record NPC met on current node if any
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
    [currentNode, currentNodeId, meters, inventory, visitedStations, chronicle, metNpcs, counseledNodes]
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
        if (showLedgerModal) {
          setShowLedgerModal(false);
        } else {
          setScreen((prev) => (prev === 'PLAYING' ? 'PAUSED' : 'PLAYING'));
        }
        return;
      }

      if (screen !== 'PLAYING' || showLedgerModal) return;

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
    showLedgerModal,
    currentNode,
    inventory,
    meters,
    handleSelectChoice,
    handleSeekCounsel,
    handleToggleMute,
  ]);

  if (screen === 'TITLE_MENU') {
    return (
      <TitleScreen
        onStart={handleStart}
        muted={muted}
        onToggleMute={handleToggleMute}
      />
    );
  }

  if (screen === 'GAME_OVER') {
    return (
      <EndingScreen
        endingNode={currentNode}
        meters={meters}
        inventory={inventory}
        chronicle={chronicle}
        canRevisitLast={historyStack.length > 0}
        onRevisitLast={handleRevisitLast}
        onPlayAgain={() => resetGame('PLAYING')}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0D1117] text-[#EDE3CE] flex flex-col">
      <TopHudBar
        chapterNumber={currentNode.chapterNumber}
        locationLabel={currentNode.locationLabel}
        dateLabel={currentNode.dateLabel}
        meters={meters}
        muted={muted}
        onToggleMute={handleToggleMute}
        onOpenArchive={() => setShowLedgerModal(true)}
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
          onRestart={() => resetGame('PLAYING')}
          onReturnTitle={() => resetGame('TITLE_MENU')}
        />
      )}

      {showLedgerModal && (
        <FieldLedgerModal
          chronicle={chronicle}
          metNpcs={metNpcs}
          trustedAllies={inventory.trustedAllies}
          onClose={() => setShowLedgerModal(false)}
        />
      )}
    </div>
  );
}
