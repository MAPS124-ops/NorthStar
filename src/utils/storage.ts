import {
  ChoiceEffects,
  ChronicleEntry,
  GameSnapshot,
  NpcId,
  PlayerInventory,
  ResourceMeters,
  StationId,
  UnlockedAchievement,
} from '../types/game';

const SAVE_STORAGE_KEY = 'following_north_star_save_v1';
const MUTE_STORAGE_KEY = 'following_north_star_muted_v1';
const ACHIEVEMENTS_STORAGE_KEY = 'following_north_star_achievements_v1';

export interface SavedGameData {
  version: 1;
  savedAt: string;
  isEnding: boolean;
  currentNodeId: string;
  meters: ResourceMeters;
  inventory: PlayerInventory;
  visitedStations: StationId[];
  chronicle: ChronicleEntry[];
  metNpcs: NpcId[];
  counseledNodes: string[];
  lastOutcome: ChoiceEffects | null;
  historyStack: GameSnapshot[];
}

export function loadSavedGame(): SavedGameData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SAVE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedGameData;
    if (
      !parsed ||
      parsed.version !== 1 ||
      typeof parsed.currentNodeId !== 'string' ||
      !parsed.meters ||
      !parsed.inventory
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveGameProgress(data: Omit<SavedGameData, 'version' | 'savedAt'>): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: SavedGameData = {
      ...data,
      version: 1,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota or private-browsing errors gracefully
  }
}

export function clearSavedGame(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(SAVE_STORAGE_KEY);
  } catch {
    // Ignore storage access errors
  }
}

export function loadMutedPreference(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function saveMutedPreference(muted: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(MUTE_STORAGE_KEY, muted ? 'true' : 'false');
  } catch {
    // Ignore storage access errors
  }
}

export function loadUnlockedAchievements(): UnlockedAchievement[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUnlockedAchievements(items: UnlockedAchievement[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage access errors
  }
}

