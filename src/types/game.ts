export type GameScreenState = 'TITLE_MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type StationId =
  | 'dorchester'
  | 'choptank'
  | 'delaware_line'
  | 'wilmington'
  | 'chester_turnpike'
  | 'philadelphia'
  | 'new_york_corridor'
  | 'syracuse'
  | 'rochester'
  | 'niagara'
  | 'st_catharines';

export type NpcId =
  | 'harriet_tubman'
  | 'thomas_garrett'
  | 'william_still'
  | 'jermain_loguen'
  | 'frederick_douglass';

export type RiskTier = 'LOW' | 'CALCULATED' | 'HIGH';

export interface NpcProfile {
  id: NpcId;
  name: string;
  lifespan: string;
  role: string;
  stationLabel: string;
  biography: string;
  historicalQuote: string;
}

export interface NpcEncounterData {
  npcId: NpcId;
  greeting: string;
  counselQuestion: string;
  counselResponse: string;
  counselInsight: string;
  counselBonus?: {
    networkDelta?: number;
    resolveDelta?: number;
    stealthDelta?: number;
    riskDelta?: number;
  };
}

export interface ResourceMeters {
  resolve: number; // 0-100: Stamina, courage, and collective morale
  stealth: number; // 0-100: Secrecy and distance from patrollers/marshals
  network: number; // 0-100: Trust and strength of Abolitionist / Vigilance ties
  cumulativeRisk: number; // 0-100: Accumulated pursuit exposure from risky choices
}

export interface PlayerInventory {
  travelingWithClara: boolean;
  rations: number;
  silverCoins: number;
  forgedPass: boolean;
  armedDefense: boolean;
  stillReceipt: boolean;
  trueNameRecorded: boolean;
  savedSyracuseFamily: boolean;
  trustedAmos: boolean;
  tubmanGuidance: boolean;
  douglassLetter: boolean;
  trustedAllies: NpcId[];
  saferRoutesUnlocked: string[];
}

export interface GameSnapshot {
  currentNodeId: string;
  meters: ResourceMeters;
  inventory: PlayerInventory;
  visitedStations: StationId[];
  chronicle: ChronicleEntry[];
  metNpcs: NpcId[];
  counseledNodes: string[];
}

export interface ChoiceCondition {
  requiresItem?: keyof Pick<
    PlayerInventory,
    'forgedPass' | 'armedDefense' | 'stillReceipt' | 'tubmanGuidance' | 'douglassLetter'
  >;
  minRations?: number;
  minCoins?: number;
  minNetwork?: number;
  minStealth?: number;
  minResolve?: number;
  maxRisk?: number;
  requiresClara?: boolean;
}

export interface ChoiceEffects {
  resolveDelta?: number;
  stealthDelta?: number;
  networkDelta?: number;
  riskDelta?: number;
  rationsDelta?: number;
  coinsDelta?: number;
  addAlly?: NpcId;
  unlockRoute?: string;
  setFlags?: Partial<PlayerInventory>;
  outcomeSummary: string;
  tone: 'sanctuary' | 'caution' | 'danger';
}

export interface StoryChoice {
  id: string;
  label: string;
  detail: string;
  riskTier: RiskTier;
  riskPointsLabel: string;
  rewardSummary: string;
  nextNodeId: string;
  condition?: ChoiceCondition;
  unavailableReason?: string;
  resolveChoice: (meters: ResourceMeters, inventory: PlayerInventory) => {
    nextNodeId: string;
    effects: ChoiceEffects;
  };
}

export interface HistoricalNote {
  heading: string;
  yearContext: string;
  body: string;
  sourceAttribution: string;
}

export type AmbientTheme =
  | 'forest_night'
  | 'swamp_night'
  | 'town_study'
  | 'train_frontier'
  | 'niagara_falls'
  | 'sanctuary_dawn';

export interface StoryNode {
  id: string;
  chapterNumber: number;
  stationId: StationId;
  locationLabel: string;
  dateLabel: string;
  title: string;
  imageKey: 'marsh' | 'philadelphia' | 'niagara' | 'lantern';
  ambientTheme: AmbientTheme;
  npcEncounter?: NpcEncounterData;
  narrative: (inventory: PlayerInventory, meters: ResourceMeters) => string[];
  dilemmaPrompt: string;
  historicalNote: HistoricalNote;
  choices: StoryChoice[];
  isEnding?: boolean;
  endingType?: 'FREEDOM_SOLIDARITY' | 'FREEDOM_SOLITARY' | 'VIGILANCE_RESCUE' | 'INTERCEPTED';
}

export interface ChronicleEntry {
  nodeId: string;
  stationId: StationId;
  locationLabel: string;
  dateLabel: string;
  title: string;
  choiceLabel: string;
  riskTier: RiskTier;
  riskDelta: number;
  outcomeSummary: string;
  tone: 'sanctuary' | 'caution' | 'danger';
  historicalHeading: string;
}

export interface MapStation {
  id: StationId;
  name: string;
  region: string;
  x: number;
  y: number;
  historicalRole: string;
}

export type AchievementId =
  | 'sister_keeper'
  | 'moses_discipline'
  | 'helped_amos'
  | 'still_ledger'
  | 'syracuse_rescue'
  | 'trusted_coalition'
  | 'calculated_navigator'
  | 'successfully_escaped';

export interface AchievementContext {
  currentNode: StoryNode;
  meters: ResourceMeters;
  inventory: PlayerInventory;
}

export interface AchievementDefinition {
  id: AchievementId;
  title: string;
  category: string;
  description: string;
  criteriaHint: string;
  checkUnlocked: (ctx: AchievementContext) => boolean;
}

export interface UnlockedAchievement {
  id: AchievementId;
  unlockedAt: string;
}

