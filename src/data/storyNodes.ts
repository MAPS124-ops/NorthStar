import {
  MapStation,
  PlayerInventory,
  ResourceMeters,
  StoryNode,
} from '../types/game';

export const MAP_STATIONS: MapStation[] = [
  {
    id: 'dorchester',
    name: 'Dorchester County',
    region: 'Maryland',
    x: 215,
    y: 435,
    historicalRole: 'Eastern Shore departure point; home waters of Harriet Tubman.',
  },
  {
    id: 'choptank',
    name: 'Choptank Marsh',
    region: 'Maryland',
    x: 230,
    y: 398,
    historicalRole: 'Tidal marshes where Harriet Tubman and free watermen guided night crossings.',
  },
  {
    id: 'delaware_line',
    name: 'Camden Woods',
    region: 'Delaware',
    x: 256,
    y: 362,
    historicalRole: 'Rural borderland linking Eastern Shore routes to Quaker farms.',
  },
  {
    id: 'wilmington',
    name: 'Wilmington',
    region: 'Delaware',
    x: 274,
    y: 325,
    historicalRole: 'Station of Thomas Garrett, who aided over 2,700 freedom seekers.',
  },
  {
    id: 'chester_turnpike',
    name: 'Kennett & Chester',
    region: 'Pennsylvania',
    x: 262,
    y: 288,
    historicalRole: 'First free-state soil, yet heavily patrolled under the 1850 Act.',
  },
  {
    id: 'philadelphia',
    name: 'Philadelphia',
    region: 'Pennsylvania',
    x: 294,
    y: 262,
    historicalRole: 'Headquarters of William Still and the Vigilance Committee.',
  },
  {
    id: 'new_york_corridor',
    name: 'Hudson Corridor',
    region: 'New York',
    x: 312,
    y: 196,
    historicalRole: 'Steamboat, freight, and ridge routes linking NYC to Albany.',
  },
  {
    id: 'syracuse',
    name: 'Syracuse',
    region: 'New York',
    x: 218,
    y: 158,
    historicalRole: 'Rev. Jermain Loguen’s station; site of the 1851 Jerry Rescue.',
  },
  {
    id: 'rochester',
    name: 'Rochester',
    region: 'New York',
    x: 154,
    y: 148,
    historicalRole: 'Frederick Douglass’s home and pressroom for The North Star.',
  },
  {
    id: 'niagara',
    name: 'Niagara Gorge',
    region: 'NY / Ontario Border',
    x: 96,
    y: 136,
    historicalRole: 'Suspension Bridge and dark river ferries to British territory.',
  },
  {
    id: 'st_catharines',
    name: 'St. Catharines',
    region: 'Canada West',
    x: 68,
    y: 102,
    historicalRole: 'Safe haven under British abolition law (1834); Harriet Tubman’s northern home.',
  },
];

export const INITIAL_METERS: ResourceMeters = {
  resolve: 80,
  stealth: 75,
  network: 45,
  cumulativeRisk: 10,
};

export const INITIAL_INVENTORY: PlayerInventory = {
  travelingWithClara: false,
  rations: 2,
  silverCoins: 2,
  forgedPass: false,
  armedDefense: true,
  stillReceipt: false,
  trueNameRecorded: false,
  savedSyracuseFamily: false,
  trustedAmos: false,
  tubmanGuidance: false,
  douglassLetter: false,
  trustedAllies: [],
  saferRoutesUnlocked: [],
};

export const SCENE_IMAGES = {
  lantern: '/src/assets/images/title_backdrop_lantern_1794703440165.jpg',
  marsh: '/src/assets/images/scene_marsh_crossing_1794703440247.jpg',
  philadelphia: '/src/assets/images/scene_philadelphia_ledger_1794703440975.jpg',
  niagara: '/src/assets/images/scene_niagara_crossing_1794703441921.jpg',
} as const;

export const STORY_NODES: Record<string, StoryNode> = {
  dorchester_departure: {
    id: 'dorchester_departure',
    chapterNumber: 1,
    stationId: 'dorchester',
    locationLabel: 'Dorchester County, Maryland',
    dateLabel: 'Saturday Night, November 11, 1854',
    title: 'The Signal at the Edge of the Quarter',
    imageKey: 'lantern',
    ambientTheme: 'forest_night',
    narrative: () => [
      'A frost settles hard over the Dorchester timberline. Saturday night was chosen deliberately—no runaway broadside can be printed until Monday morning. Two hours past curfew, your brother passes word from a free Black waterman: a conductor known as "Moses" has returned from the North and waits near the Choptank reeds before moonrise.',
      'Inside the cabin, your elderly Aunt Martha presses a wool shawl into your hands, knowing her joints cannot survive a winter march. Beside the hearth, your younger sister Clara—limping slightly from a sprained ankle—refuses to stay behind after hearing the master intends to sell her south to New Orleans after harvest.',
      'Every minute before midnight narrows the margin before morning roll call. A larger party moves slower and leaves deeper tracks in the frost; traveling alone buys speed at a heartbreaking cost.',
    ],
    dilemmaPrompt: 'Who crosses the timberline with you tonight?',
    historicalNote: {
      heading: 'Saturday Departures & Family Separation',
      yearContext: 'Maryland Eastern Shore, 1850s',
      body: 'Harriet Tubman and other conductors favored Saturday nights in late autumn or winter because enslaved people were often excused from Sunday labor and newspapers would not print runaway advertisements until Monday, buying a critical thirty-six-hour head start.',
      sourceAttribution: 'Sarah Bradford, Scenes in the Life of Harriet Tubman (1869).',
    },
    choices: [
      {
        id: 'bring_clara',
        label: 'Bring Clara and steady her pace along the treeline',
        detail: 'Share your coat with Clara and promise Aunt Martha you will send word through the church network once north.',
        riskTier: 'CALCULATED',
        riskPointsLabel: '+12 Risk · −10 Stealth',
        rewardSummary: 'Reward: Companion Clara & +15 Resolve',
        nextNodeId: 'choptank_marsh',
        resolveChoice: () => ({
          nextNodeId: 'choptank_marsh',
          effects: {
            resolveDelta: 15,
            stealthDelta: -10,
            riskDelta: 12,
            setFlags: { travelingWithClara: true },
            outcomeSummary: 'Clara walks beside you beneath the pines; your resolve steadies, though two pairs of boots raise early pursuit risk.',
            tone: 'caution',
          },
        }),
      },
      {
        id: 'leave_alone',
        label: 'Leave alone tonight under cover of deep night, leaving silver with Martha',
        detail: 'Slip out single-file while leaving half your meager silver with Clara and Martha for winter provisions.',
        riskTier: 'LOW',
        riskPointsLabel: '+0 Risk · +15 Stealth',
        rewardSummary: 'Reward: Silent Solo Trail (−1 Silver, −15 Resolve)',
        nextNodeId: 'choptank_marsh',
        resolveChoice: () => ({
          nextNodeId: 'choptank_marsh',
          effects: {
            resolveDelta: -15,
            stealthDelta: 15,
            riskDelta: 0,
            coinsDelta: -1,
            setFlags: { travelingWithClara: false },
            outcomeSummary: 'You vanish alone into the cypress shadows. Pursuit risk stays minimal, though grief weighs heavy on every mile.',
            tone: 'caution',
          },
        }),
      },
      {
        id: 'gather_provisions',
        label: 'Delay an hour to raid the smokehouse for extra salt pork and wool',
        detail: 'Risk the yard watchman to gather winter rations before meeting the conductor with Clara.',
        riskTier: 'HIGH',
        riskPointsLabel: '+20 Risk · −15 Stealth',
        rewardSummary: 'Reward: +1 Rations & Extra Wool (+5 Resolve)',
        nextNodeId: 'choptank_marsh',
        resolveChoice: () => ({
          nextNodeId: 'choptank_marsh',
          effects: {
            resolveDelta: 5,
            stealthDelta: -15,
            riskDelta: 20,
            rationsDelta: 1,
            setFlags: { travelingWithClara: true },
            outcomeSummary: 'You secure cured pork and an extra blanket for Clara, though a barking yard dog triggers an earlier patrol sweep.',
            tone: 'danger',
          },
        }),
      },
    ],
  },

  choptank_marsh: {
    id: 'choptank_marsh',
    chapterNumber: 2,
    stationId: 'choptank',
    locationLabel: 'Choptank River Marsh, Maryland',
    dateLabel: 'November 12, 1854 · 1:40 AM',
    title: 'Harriet Tubman in the Reeds',
    imageKey: 'marsh',
    ambientTheme: 'swamp_night',
    npcEncounter: {
      npcId: 'harriet_tubman',
      greeting:
        'Low in the cattails, a small, steel-eyed woman raises a single hand—then lowers the velvet-wrapped pistol resting against her wool coat. It is Harriet Tubman, five years removed from bondage here and already known across Dorchester as "Moses."',
      counselQuestion: 'Ask Harriet how to survive the Choptank patrols and winter cold',
      counselResponse:
        '"Listen to the water, not the dogs. Dogs cannot smell through running tide, and no patroller rides chest-deep in November mud unless he knows for certain you’re there. Stay silent, watch Polaris over the pine tops, and remember—once we step into this marsh, nobody turns back."',
      counselInsight:
        'Harriet’s discipline lowers Pursuit Risk (−5 Risk) and adds +10 Network—unlocking her personal Route Token and Niagara safe passage if you wade beside her.',
      counselBonus: {
        networkDelta: 10,
        riskDelta: -5,
      },
    },
    narrative: (inv, meters) => [
      'A low hymn—"Wade in the Water"—drifts just above the freezing rush of the Choptank tide. Stepping from the cypress shadow is Harriet Tubman herself, guiding two other fugitives north toward Delaware.',
      inv.travelingWithClara
        ? 'When Clara’s sprained ankle falters on a slick root and she whispers in terror of returning to Aunt Martha’s cabin, Tubman steps close without raising her voice. Her hand settles firmly on the pistol at her hip: "Dead folks tell no tales. You go on, or you endanger every soul in this county."'
        : 'Tubman inspects your boots and listens as lantern beams sweep the plank bridge upstream. County patrollers—known locally as "paddyrollers"—are riding the neck with two scent hounds.',
      meters.cumulativeRisk >= 25
        ? 'Because your departure left fresh noise behind, horsemen already patrol the outer crossroads—making Tubman’s water route urgent.'
        : 'Fifty yards inland stands the plank cabin of Enoch, a free Black carpenter whose trade license hangs by a thread under Maryland’s Black Codes. Tubman urges you instead into the waist-deep tidal creek.',
    ],
    dilemmaPrompt: 'Do you follow Harriet Tubman’s iron discipline into the freezing tide, or seek dry refuge?',
    historicalNote: {
      heading: 'Harriet Tubman’s Tactics & Discipline',
      yearContext: 'Dorchester County, Maryland, 1850–1857',
      body: 'Harriet Tubman never lost a passenger, largely through ruthless operational security. She used coded spirituals to signal danger ("Wade in the Water" warned fugitives off roads and into streams to break hound scent) and famously held her revolver on travelers who panicked and threatened to return and expose safe houses.',
      sourceAttribution: 'Catherine Clinton, Harriet Tubman: The Road to Freedom (2004).',
    },
    choices: [
      {
        id: 'follow_tubman_tide',
        label: 'Follow Harriet Tubman waist-deep through the freezing Choptank reeds',
        detail: 'Submit to her strict silence and wade across the tidal bend to erase every footprint and hound scent.',
        riskTier: 'CALCULATED',
        riskPointsLabel: '−10 Risk · +20 Stealth',
        rewardSummary: 'Reward: Trusted Ally (Harriet Tubman) & Choptank Water Route',
        nextNodeId: 'delaware_line',
        resolveChoice: () => ({
          nextNodeId: 'delaware_line',
          effects: {
            resolveDelta: -15,
            stealthDelta: 20,
            networkDelta: 10,
            riskDelta: -10,
            addAlly: 'harriet_tubman',
            unlockRoute: 'Choptank Tideway',
            setFlags: { tubmanGuidance: true },
            outcomeSummary: 'Icy water steals warmth from your limbs, yet the hounds lose your scent completely. At the Delaware line, Harriet Tubman presses a brass coat button into your palm for Niagara.',
            tone: 'sanctuary',
          },
        }),
      },
      {
        id: 'enoch_cabin',
        label: 'Part from Tubman’s column and knock at Enoch’s cabin for dry shelter',
        detail: 'Spare your aching limbs by hiding beneath Enoch’s floorboards until daylight fades, risking discovery.',
        riskTier: 'HIGH',
        riskPointsLabel: '+18 Risk · −10 Stealth',
        rewardSummary: 'Reward: Warm Shelter (+10 Resolve)',
        nextNodeId: 'delaware_line',
        resolveChoice: () => ({
          nextNodeId: 'delaware_line',
          effects: {
            resolveDelta: 10,
            stealthDelta: -10,
            riskDelta: 18,
            setFlags: { tubmanGuidance: false },
            outcomeSummary: 'Enoch hides you beneath cedar shavings while patrollers question him at the door, raising local suspicion across the neck.',
            tone: 'caution',
          },
        }),
      },
      {
        id: 'decoy_coat',
        label: 'Toss a spare ration bundle upstream to draw the dogs, then cut through the pines',
        detail: 'Spend 1 Ration to bait the patrol east, preserving both your warmth and Enoch’s safety.',
        riskTier: 'LOW',
        riskPointsLabel: '−5 Risk · +10 Stealth',
        rewardSummary: 'Reward: Patrol Diverted (−1 Ration, +5 Network)',
        nextNodeId: 'delaware_line',
        condition: { minRations: 1 },
        unavailableReason: 'Requires at least 1 Ration bundle to use as a scent decoy.',
        resolveChoice: () => ({
          nextNodeId: 'delaware_line',
          effects: {
            rationsDelta: -1,
            stealthDelta: 10,
            networkDelta: 5,
            riskDelta: -5,
            outcomeSummary: 'The hounds bay furiously toward the decoy cloth upstream while you slip northward along the dry ridge.',
            tone: 'sanctuary',
          },
        }),
      },
    ],
  },

  delaware_line: {
    id: 'delaware_line',
    chapterNumber: 3,
    stationId: 'delaware_line',
    locationLabel: 'Camden Woods, Delaware',
    dateLabel: 'November 15, 1854',
    title: 'A Stranger in the Pines',
    imageKey: 'lantern',
    ambientTheme: 'forest_night',
    narrative: (inv) => [
      'After two nights following Polaris across the state line into Kent County, Delaware, your party shelters inside a hollow sycamore windbreak. Delaware remains a slave state, though pockets of free Black settlements and Quaker farms thread northward toward Wilmington.',
      'At dusk, a slender man in his twenties stumbles into the thicket, calling softly in the dark. He introduces himself as Amos from Smyrna. Yet something gives you pause: his boots are remarkably dry for someone claiming three days in the swamps, and he presses eagerly to know the exact name of the Quaker farmhouse ahead.',
      inv.travelingWithClara
        ? 'Clara grips your sleeve in the shadows, whispering that reward notices in Dover promise two hundred dollars for informant tips.'
        : 'You remember Harriet Tubman’s warning: bounty hunters sometimes paid desperate men to infiltrate escape parties.',
    ],
    dilemmaPrompt: 'Trust a stranger in the dusk, test his story, or stay hidden?',
    historicalNote: {
      heading: 'Secrecy, Passwords, and Informants',
      yearContext: 'Delaware Border Corridor, 1850s',
      body: 'Conductors rarely knew the names of stations beyond the immediate next stop—a deliberate compartmentalization to protect the network. Travelers used quiet recognition phrases, hymns, or veiled questions ("Can you tell me where the Friend lives?") to vet strangers.',
      sourceAttribution: 'Wilbur Siebert, The Underground Railroad from Slavery to Freedom (1898).',
    },
    choices: [
      {
        id: 'test_amos',
        label: 'Remain concealed and test him with the coded verse from "Steal Away"',
        detail: 'Listen carefully to how he answers about the local meetinghouse before revealing any direction.',
        riskTier: 'LOW',
        riskPointsLabel: '−5 Risk · +5 Stealth',
        rewardSummary: 'Reward: Station Security (+10 Network)',
        nextNodeId: 'wilmington_station',
        resolveChoice: () => ({
          nextNodeId: 'wilmington_station',
          effects: {
            networkDelta: 10,
            stealthDelta: 5,
            riskDelta: -5,
            setFlags: { trustedAmos: false },
            outcomeSummary: 'Amos falters on the second line of the hymn and slips away before midnight—convincing you that caution just saved the Wilmington road.',
            tone: 'sanctuary',
          },
        }),
      },
      {
        id: 'share_fire_amos',
        label: 'Trust Amos, share 1 Ration, and travel together without naming stations',
        detail: 'Take a calculated human risk on a potentially starving fugitive while withholding Quaker names until Wilmington.',
        riskTier: 'CALCULATED',
        riskPointsLabel: '+10 Risk · −10 Stealth',
        rewardSummary: 'Reward: Shared Trail & +15 Resolve, +5 Network (−1 Ration)',
        nextNodeId: 'wilmington_station',
        condition: { minRations: 1 },
        unavailableReason: 'Requires at least 1 Ration to share.',
        resolveChoice: () => ({
          nextNodeId: 'wilmington_station',
          effects: {
            rationsDelta: -1,
            resolveDelta: 15,
            stealthDelta: -10,
            networkDelta: 5,
            riskDelta: 10,
            setFlags: { trustedAmos: true },
            outcomeSummary: 'Amos weeps over the salt pork—he had lost his shoes days prior and traded for dry boots from a carter. Together you reach the Brandywine.',
            tone: 'sanctuary',
          },
        }),
      },
      {
        id: 'misdirect_amos',
        label: 'Give him a false road east and march quickly by daylight cutoffs',
        detail: 'Move boldly down back-lane ditches at dawn to widen the gap ahead of patrols, abandoning Amos.',
        riskTier: 'HIGH',
        riskPointsLabel: '+15 Risk · +10 Stealth',
        rewardSummary: 'Reward: Rapid Daylight Ground (−10 Resolve, −5 Network)',
        nextNodeId: 'wilmington_station',
        resolveChoice: () => ({
          nextNodeId: 'wilmington_station',
          effects: {
            stealthDelta: 10,
            resolveDelta: -10,
            networkDelta: -5,
            riskDelta: 15,
            setFlags: { trustedAmos: false },
            outcomeSummary: 'Moving during early twilight gains miles fast, though a farmhand spots movement in the hedgerow and moral regret lingers.',
            tone: 'caution',
          },
        }),
      },
    ],
  },

  wilmington_station: {
    id: 'wilmington_station',
    chapterNumber: 4,
    stationId: 'wilmington',
    locationLabel: 'Wilmington, Delaware',
    dateLabel: 'November 17, 1854',
    title: 'Thomas Garrett’s Workshop',
    imageKey: 'philadelphia',
    ambientTheme: 'town_study',
    npcEncounter: {
      npcId: 'thomas_garrett',
      greeting:
        'Behind stacked iron hinges at 227 Shipley Street, silver-haired Quaker Thomas Garrett rises from his cobbler’s bench. Six years after federal courts fined him $5,400 and stripped his estate, his quiet resolve has not bent an inch.',
      counselQuestion: 'Ask Thomas Garrett why he insists on disarming travelers under his roof',
      counselResponse:
        '"Friend, I have faced judges and marshals without shedding a drop of blood. If violence erupts inside my house, every magistrate in Delaware gains excuse to close this door forever—and two hundred souls next winter will lose their bridge north. Take new shoes, take my papers, and leave iron behind."',
      counselInsight:
        'Speaking honestly with Garrett grants +5 Resolve and confirms his Forged Pass unlocks a safer daylight wagon crossing at Kennett Turnpike.',
      counselBonus: {
        resolveDelta: 5,
      },
    },
    narrative: (inv) => [
      'Rain beats against Shipley Street as a Vigilance guide ushers you behind the ironware and shoe shop of Thomas Garrett. He inspects your blistered boots, measures your feet for sturdy leather, and sets warm bread and cider on the workbench.',
      'Garrett offers concealment inside a false-bottomed shoemaker’s wagon bound across the Pennsylvania line, with forged labor papers stamped in Chester.',
      inv.armedDefense
        ? 'Yet Garrett’s gaze settles firmly on the small pocket pistol and clasp knife tucked inside your coat. As a devout Quaker pacifist, he forbids weapons under his roof—creating a sharp clash with Harriet Tubman’s rule of armed self-defense. Outside, a Black dockman warns that federal agents are watching Market Street.'
        : 'Outside, a Black dockman warns that federal agents have been watching Market Street since dusk.',
    ],
    dilemmaPrompt: 'Do you accept Thomas Garrett’s pacifist terms and covered wagon route?',
    historicalNote: {
      heading: 'Thomas Garrett & The Pacifist Paradox',
      yearContext: 'Wilmington, Delaware, 1848–1860',
      body: 'Thomas Garrett helped over 2,700 freedom seekers escape through Wilmington, collaborating closely with Harriet Tubman despite profound disagreement over firearms. Quaker conductors practiced strict nonviolence, while Black conductors and Vigilance committees increasingly viewed armed self-defense against kidnapping as essential.',
      sourceAttribution: 'James A. McGowan, Station Master: The Life and Times of Thomas Garrett.',
    },
    choices: [
      {
        id: 'accept_garrett_terms',
        label: 'Surrender your weapons and ride inside Garrett’s false-bottomed shoemaker wagon',
        detail: 'Trust the Quaker network completely. Receive dry boots and a forged Chester work pass.',
        riskTier: 'LOW',
        riskPointsLabel: '−10 Risk · +15 Stealth',
        rewardSummary: 'Reward: Ally (Thomas Garrett), Safer Wagon Route & Forged Pass (+20 Network)',
        nextNodeId: 'chester_turnpike',
        resolveChoice: () => ({
          nextNodeId: 'chester_turnpike',
          effects: {
            networkDelta: 20,
            stealthDelta: 15,
            resolveDelta: 5,
            riskDelta: -10,
            addAlly: 'thomas_garrett',
            unlockRoute: 'Garrett’s Covered Wagon',
            setFlags: { forgedPass: true, armedDefense: false },
            outcomeSummary: 'You leave the iron behind on Garrett’s anvil. Beneath crates of leather soles, the wagon rolls safely across the Brandywine.',
            tone: 'sanctuary',
          },
        }),
      },
      {
        id: 'keep_defense_creek',
        label: 'Keep your weapons, thank Garrett for dry shoes, and walk the Brandywine creek bed',
        detail: 'Refuse to travel unarmed; follow a Vigilance scout up the wooded gorge into Pennsylvania.',
        riskTier: 'CALCULATED',
        riskPointsLabel: '+10 Risk · −10 Stealth',
        rewardSummary: 'Reward: Keeps Armed Defense, +10 Resolve & +5 Network',
        nextNodeId: 'chester_turnpike',
        resolveChoice: () => ({
          nextNodeId: 'chester_turnpike',
          effects: {
            resolveDelta: 10,
            stealthDelta: -10,
            networkDelta: 5,
            riskDelta: 10,
            setFlags: { armedDefense: true },
            outcomeSummary: 'Garrett respects your conscience and presses fresh bread into your hands before you wade north along the rocky Brandywine.',
            tone: 'caution',
          },
        }),
      },
      {
        id: 'decoy_wagon_barge',
        label: 'Pay for a night timber barge while Garrett’s apprentices divert Market Street marshals',
        detail: 'Spend 1 Silver Coin for discreet river passage bound straight for Chester.',
        riskTier: 'HIGH',
        riskPointsLabel: '+15 Risk · +15 Stealth',
        rewardSummary: 'Reward: Barge Bypass (−1 Silver, −10 Network)',
        nextNodeId: 'chester_turnpike',
        condition: { minCoins: 1 },
        unavailableReason: 'Requires 1 Silver Coin for the barge fee.',
        resolveChoice: () => ({
          nextNodeId: 'chester_turnpike',
          effects: {
            coinsDelta: -1,
            stealthDelta: 15,
            networkDelta: -10,
            riskDelta: 15,
            outcomeSummary: 'While marshals inspect an empty dray cart on Market Street, your barge slips past the boundary stone—though federal eyes now watch Wilmington closer.',
            tone: 'caution',
          },
        }),
      },
    ],
  },

  chester_turnpike: {
    id: 'chester_turnpike',
    chapterNumber: 5,
    stationId: 'chester_turnpike',
    locationLabel: 'Chester County, Pennsylvania',
    dateLabel: 'November 19, 1854',
    title: 'The Fugitive Slave Act of 1850',
    imageKey: 'marsh',
    ambientTheme: 'train_frontier',
    narrative: (inv, meters) => [
      'You have crossed the Mason-Dixon Line into Pennsylvania—yet freedom remains a fragile illusion. Under the federal Fugitive Slave Act of 1850, U.S. commissioners receive ten dollars for ruling a suspect enslaved, and only five dollars for declaring them free. Bystanders face fines and prison for refusing to join a marshal’s posse.',
      meters.cumulativeRisk >= 45
        ? 'Federal telegraph notices from Baltimore have alerted Chester County constables to watch every northern pike. At Kennett Square, lantern light flares across a narrow tollhouse bridge.'
        : 'Near Kennett Square, lantern light flares at a tollhouse bridge. Two county constables stand beside a parked carriage, checking travelers’ passes against descriptions printed in Baltimore handbills.',
      inv.forgedPass
        ? 'Inside your coat rests Thomas Garrett’s forged Chester shoemaker pass—ink crisp, seal convincing, yet only as strong as your nerve.'
        : 'With no papers in your coat, stepping into the lantern ring means risking immediate detention under federal warrant.',
    ],
    dilemmaPrompt: 'Cross openly by forged papers, wait for friendly wheels, or crawl the frozen orchards?',
    historicalNote: {
      heading: 'No Free Soil Under Federal Law',
      yearContext: 'Fugitive Slave Act of September 18, 1850',
      body: 'The 1850 Act stripped accused freedom seekers of the right to testify in their own defense or receive a jury trial. Because commissioners were paid double ($10 vs. $5) to remand captives south, northern states were no longer safe destinations—pushing the Underground Railroad all the way to Canada.',
      sourceAttribution: 'U.S. Statutes at Large, 31st Congress, Sess. I, Ch. 60 (1850).',
    },
    choices: [
      {
        id: 'present_forged_pass',
        label: 'Walk boldly through the tollhouse presenting Garrett’s forged labor papers',
        detail: 'Speak evenly in daylight as a journeyman cobbler’s assistant bound for West Chester.',
        riskTier: 'CALCULATED',
        riskPointsLabel: '−10 Risk · +15 Stealth',
        rewardSummary: 'Reward: Clean Checkpoint Bypass & +10 Resolve',
        nextNodeId: 'philadelphia_still',
        condition: { requiresItem: 'forgedPass' },
        unavailableReason: 'Requires a Forged Pass from Thomas Garrett in Wilmington.',
        resolveChoice: () => ({
          nextNodeId: 'philadelphia_still',
          effects: {
            stealthDelta: 15,
            resolveDelta: 10,
            riskDelta: -10,
            setFlags: { forgedPass: false },
            outcomeSummary: 'The constable squints at Garrett’s stamp, waves you through with a grunt, and turns back to his brazier. Pursuit cools behind you.',
            tone: 'sanctuary',
          },
        }),
      },
      {
        id: 'longwood_orchards',
        label: 'Stay hidden by night and crawl through frozen Longwood orchards',
        detail: 'Avoid the tollhouse entirely by cutting through thorny hedgerows toward the Quaker meetinghouse.',
        riskTier: 'LOW',
        riskPointsLabel: '+0 Risk · +10 Stealth',
        rewardSummary: 'Reward: Zero Checkpoint Exposure (−15 Resolve)',
        nextNodeId: 'philadelphia_still',
        resolveChoice: () => ({
          nextNodeId: 'philadelphia_still',
          effects: {
            resolveDelta: -15,
            stealthDelta: 10,
            riskDelta: 0,
            outcomeSummary: 'Thorns tear at your sleeves in the dark, yet you bypass the constables unseen and reach the Philadelphia road.',
            tone: 'caution',
          },
        }),
      },
      {
        id: 'stand_ground_detour',
        label: 'Wait in the roadside ditch to slip aboard a passing hay wagon',
        detail: 'Gambling on friendly traffic—if your Network ties are strong, a Longwood Friend recognizes you; otherwise you risk a blind scramble.',
        riskTier: 'HIGH',
        riskPointsLabel: '+15 Risk (or −5 if Network ≥ 50)',
        rewardSummary: 'Reward: Safer Hay Wagon Route if Network ≥ 50',
        nextNodeId: 'philadelphia_still',
        resolveChoice: (meters) => {
          if (meters.network >= 50) {
            return {
              nextNodeId: 'philadelphia_still',
              effects: {
                stealthDelta: 10,
                networkDelta: 5,
                riskDelta: -5,
                unlockRoute: 'Longwood Quaker Hay Cart',
                outcomeSummary: 'A Longwood Friend recognizes your whistle signal from the hedge and buries you beneath fragrant timothy hay into Philadelphia.',
                tone: 'sanctuary',
              },
            };
          }
          return {
            nextNodeId: 'philadelphia_still',
            effects: {
              stealthDelta: -15,
              resolveDelta: -5,
              riskDelta: 18,
              outcomeSummary: 'You scramble onto a passing lumber cart without the driver’s word—escaping the bridge, though a watch dog alerts the gatehouse.',
              tone: 'danger',
            },
          };
        },
      },
    ],
  },

  philadelphia_still: {
    id: 'philadelphia_still',
    chapterNumber: 6,
    stationId: 'philadelphia',
    locationLabel: 'Philadelphia, Pennsylvania',
    dateLabel: 'November 21, 1854',
    title: 'William Still’s Ledger',
    imageKey: 'philadelphia',
    ambientTheme: 'town_study',
    npcEncounter: {
      npcId: 'william_still',
      greeting:
        'At 107 North Fifth Street, behind shuttered windows of the Pennsylvania Anti-Slavery Office, William Still—composed, meticulous, and himself the son of a Maryland mother who fled slavery—unlocks a heavy leather-bound journal.',
      counselQuestion: 'Ask William Still why he risks keeping written records under the 1850 Act',
      counselResponse:
        '"Every slaveholder tries to blot out our names and sever parent from child. I lock these ledgers inside a vault at Lebanon Cemetery whenever danger nears. Should you live to see freedom’s dawn, a single page of ink may be the only compass leading your family back to one another."',
      counselInsight:
        'Consulting William Still reduces Risk (−5 Risk) and adds +5 Network—clarifying that entrusting your true name earns his Silver fare & Vigilance Cipher.',
      counselBonus: {
        networkDelta: 5,
        riskDelta: -5,
      },
    },
    narrative: (inv) => [
      'Warm lamp oil lights William Still’s desk as Committee members bring dry stockings and hot broth. Unlike conductors who burned every scrap of paper, Still quietly records the true names, birthplaces, enslavers, and left-behind relatives of every freedom seeker passing through Philadelphia.',
      'Yet the peril is real: if federal marshals secure a warrant to search the Anti-Slavery Office before Still can move the ledger to Lebanon Cemetery, those names could expose kin and local helpers back in Maryland.',
      inv.travelingWithClara
        ? 'Still dips his quill and looks gently at you and Clara. "What name shall I write beside your history tonight—your true lineage for the future, or an alias to shield Dorchester?"'
        : 'Still dips his quill and speaks softly: "What name shall I write beside your history tonight—your true lineage for future reunion, or an alias to shield those behind?"',
    ],
    dilemmaPrompt: 'What do you ask William Still to enter into his secret ledger?',
    historicalNote: {
      heading: 'William Still & The Underground Rail Road (1872)',
      yearContext: 'Philadelphia Vigilance Committee, 1852–1861',
      body: 'William Still personally aided and interviewed roughly 800 freedom seekers in Philadelphia, keeping meticulous hidden records at immense personal risk. In 1855 he discovered that an interviewee—Peter Friedman—was his own long-lost brother left behind forty years earlier. Still published the full ledgers in 1872.',
      sourceAttribution: 'William Still, The Underground Rail Road (Philadelphia, 1872).',
    },
    choices: [
      {
        id: 'record_true_name',
        label: 'Entrust Still with your true name, Dorchester birthplace, and Aunt Martha’s lineage',
        detail: 'Accept the calculated risk of a written record in exchange for family history and Committee aid.',
        riskTier: 'CALCULATED',
        riskPointsLabel: '+12 Risk · −10 Stealth',
        rewardSummary: 'Reward: Ally (William Still), Cipher Receipt, +1 Silver & +20 Network',
        nextNodeId: 'new_york_corridor',
        resolveChoice: () => ({
          nextNodeId: 'new_york_corridor',
          effects: {
            networkDelta: 20,
            resolveDelta: 15,
            stealthDelta: -10,
            riskDelta: 12,
            coinsDelta: 1,
            addAlly: 'william_still',
            setFlags: { stillReceipt: true, trueNameRecorded: true },
            outcomeSummary: 'Still’s quill scratches steadily in the lamplight. He folds a coded Vigilance cipher and a silver dollar into your seam for New York.',
            tone: 'sanctuary',
          },
        }),
      },
      {
        id: 'give_alias',
        label: 'Give an assumed name and keep Dorchester County completely off the page',
        detail: 'Minimize written exposure for Aunt Martha and Enoch’s cabin, accepting anonymity.',
        riskTier: 'LOW',
        riskPointsLabel: '−10 Risk · +15 Stealth',
        rewardSummary: 'Reward: Maximum Anonymity (+5 Network, −10 Resolve)',
        nextNodeId: 'new_york_corridor',
        resolveChoice: () => ({
          nextNodeId: 'new_york_corridor',
          effects: {
            stealthDelta: 15,
            resolveDelta: -10,
            networkDelta: 5,
            riskDelta: -10,
            setFlags: { trueNameRecorded: false },
            outcomeSummary: 'Still nods without judgment and writes a quiet alias beside "Eastern Shore." Pursuit risk drops sharply.',
            tone: 'caution',
          },
        }),
      },
      {
        id: 'donate_rations_cipher',
        label: 'Donate 1 Ration for the next arrival and ask Still for a verbal Vigilance cipher',
        detail: 'Leave no written name while strengthening the Philadelphia committee’s pantry for families behind you.',
        riskTier: 'LOW',
        riskPointsLabel: '−5 Risk · +10 Stealth',
        rewardSummary: 'Reward: Ally (William Still) & Cipher Receipt (+15 Network, −1 Ration)',
        nextNodeId: 'new_york_corridor',
        condition: { minRations: 1 },
        unavailableReason: 'Requires 1 Ration to share with the station.',
        resolveChoice: () => ({
          nextNodeId: 'new_york_corridor',
          effects: {
            rationsDelta: -1,
            networkDelta: 15,
            stealthDelta: 10,
            riskDelta: -5,
            addAlly: 'william_still',
            setFlags: { stillReceipt: true, trueNameRecorded: false },
            outcomeSummary: 'Still commits your message to memory instead of ink, gifting you a discreet Committee cipher.',
            tone: 'sanctuary',
          },
        }),
      },
    ],
  },

  new_york_corridor: {
    id: 'new_york_corridor',
    chapterNumber: 7,
    stationId: 'new_york_corridor',
    locationLabel: 'New York Hudson Corridor',
    dateLabel: 'November 24, 1854',
    title: 'Crate, Steamer, or Sleet',
    imageKey: 'marsh',
    ambientTheme: 'swamp_night',
    narrative: (inv, meters) => [
      'Word reaches the New York Vigilance Committee that slave catchers armed with fresh federal warrants are watching Manhattan docks and railroad depots. Moving openly along the Hudson River grows perilous by the hour.',
      meters.cumulativeRisk >= 55
        ? 'Your high pursuit profile means printed descriptions already circulate at the Albany pier—making visible public steamers especially hazardous.'
        : inv.travelingWithClara
          ? 'Clara’s cough worsens in the November sleet. Your New York contacts lay out three desperate ways to clear the river valley toward Albany and Syracuse:'
          : 'Freezing sleet lashes the wharves. Your New York contacts lay out three desperate passages northward toward Albany and Syracuse:',
      'One freight clerk offers a wooden shipping crate bound by express wagon; a sympathetic Black steward offers forged seaman’s papers aboard a Hudson night steamer; or an abolitionist teamster offers the slow, sleet-swept ridge road through upstate farms.',
    ],
    dilemmaPrompt: 'Which passage northward through New York will you endure?',
    historicalNote: {
      heading: 'Box Freight & Hudson Steamboats',
      yearContext: 'New York Vigilance Committee, 1849–1855',
      body: 'In 1849 Henry "Box" Brown famously shipped himself from Richmond to Philadelphia inside a 3-by-2-foot wooden crate over 27 harrowing hours. Underground Railroad operators later discouraged crate travel due to extreme suffocation risks, preferring Hudson steamers and abolitionist farm wagons.',
      sourceAttribution: 'Narrative of the Life of Henry Box Brown (1851) & Eric Foner, Gateway to Freedom.',
    },
    choices: [
      {
        id: 'express_crate',
        label: 'Seal inside an Adams Express dry-goods crate on the night freight wagon',
        detail: 'Endure twenty hours of cramped, near-airless darkness beneath canvas tarps to evade every dock check.',
        riskTier: 'HIGH',
        riskPointsLabel: '−15 Risk · +25 Stealth (Physical Danger)',
        rewardSummary: 'Reward: Cleared Dock Checkpoints (−20 Resolve)',
        nextNodeId: 'syracuse_rescue',
        resolveChoice: (meters, inv) => {
          const resolveLoss = inv.travelingWithClara ? -25 : -20;
          const nextResolve = meters.resolve + resolveLoss;
          if (nextResolve <= 0) {
            return {
              nextNodeId: meters.network >= 60 ? 'ending_vigilance_rescue' : 'ending_intercepted',
              effects: {
                resolveDelta: resolveLoss,
                stealthDelta: 25,
                riskDelta: -15,
                outcomeSummary: 'Exhaustion and suffocating cold overwhelm your strength inside the freight depot.',
                tone: 'danger',
              },
            };
          }
          return {
            nextNodeId: 'syracuse_rescue',
            effects: {
              resolveDelta: resolveLoss,
              stealthDelta: 25,
              riskDelta: -15,
              outcomeSummary: 'Cramped and bruised in the dark, you hear inspectors tap the crate lid in Poughkeepsie and pass on. By dawn you roll into Albany.',
              tone: 'caution',
            },
          };
        },
      },
      {
        id: 'hudson_steamer',
        label: 'Board the Hudson night steamer openly using seaman’s protection papers',
        detail: 'Spend 1 Silver Coin to secure warm berths near the coal boilers.',
        riskTier: 'HIGH',
        riskPointsLabel: '+20 Risk · −15 Stealth',
        rewardSummary: 'Reward: Restorative Warmth (+15 Resolve, −1 Silver)',
        nextNodeId: 'syracuse_rescue',
        condition: { minCoins: 1 },
        unavailableReason: 'Requires 1 Silver Coin for the steamer passage.',
        resolveChoice: () => ({
          nextNodeId: 'syracuse_rescue',
          effects: {
            coinsDelta: -1,
            resolveDelta: 15,
            stealthDelta: -15,
            riskDelta: 20,
            outcomeSummary: 'Warmth returns beside the coal boilers, though an alert river agent eyes your party closely at the Albany pier.',
            tone: 'caution',
          },
        }),
      },
      {
        id: 'upstate_ridge_farms',
        label: 'Take the slow overland ridge trail through abolitionist farms toward Peterboro',
        detail: 'Travel by wagon and foot through Gerrit Smith’s upstate network, braving sleet and cold.',
        riskTier: 'CALCULATED',
        riskPointsLabel: '−5 Risk · +5 Stealth',
        rewardSummary: 'Reward: Safer Peterboro Farm Route & +15 Network, +1 Ration (−10 Resolve)',
        nextNodeId: 'syracuse_rescue',
        resolveChoice: () => ({
          nextNodeId: 'syracuse_rescue',
          effects: {
            networkDelta: 15,
            resolveDelta: -10,
            stealthDelta: 5,
            riskDelta: -5,
            rationsDelta: 1,
            unlockRoute: 'Peterboro Ridge Farms',
            outcomeSummary: 'Frozen mud slows every mile, yet abolitionist families in Peterboro press hot soup and fresh rations into your pack before guiding you west.',
            tone: 'sanctuary',
          },
        }),
      },
    ],
  },

  syracuse_rescue: {
    id: 'syracuse_rescue',
    chapterNumber: 8,
    stationId: 'syracuse',
    locationLabel: 'Syracuse, New York',
    dateLabel: 'November 27, 1854 · Midnight',
    title: 'Rev. Jermain Loguen & The Canal Trap',
    imageKey: 'lantern',
    ambientTheme: 'town_study',
    npcEncounter: {
      npcId: 'jermain_loguen',
      greeting:
        'Rev. Jermain Wesley Loguen—a towering AME Zion minister who once escaped Tennessee himself—opens his Genesee Street kitchen with steady urgency, his coat already draped over a chair.',
      counselQuestion: 'Ask Rev. Loguen about Syracuse’s defiance after the 1851 Jerry Rescue',
      counselResponse:
        '"Three years ago this town broke down a police door in broad daylight to free William Jerry Henry. If we allow bounty hunters to drag a mother out of Syracuse tonight while we watch from cellars, the Fugitive Slave Law wins. Yet I will not command you—you know how close Canada lies."',
      counselInsight:
        'Loguen’s counsel adds +5 Resolve and confirms that helping rescue the family earns Jermain Loguen as a Trusted Ally and telegraph backing in Rochester.',
      counselBonus: {
        resolveDelta: 5,
      },
    },
    narrative: () => [
      'In Syracuse, Rev. Jermain Loguen’s home shelters you beside the Erie Canal. Just past midnight, a boy dashes into the kitchen breathless: two armed bounty hunters have cornered a mother and her infant fleeing from Virginia inside a canal-side tavern three streets away, waiting for the morning Albany train.',
      'Loguen’s jaw tightens. If he leads a street confrontation openly, federal marshals will raid his Genesee Street station by sunrise. Four local Vigilance volunteers are slipping out the back gate to create a dockside diversion—and every pair of steady hands could spell the difference between rescue and capture.',
    ],
    dilemmaPrompt: 'Will you take the high risk of intervening in the street rescue?',
    historicalNote: {
      heading: 'Rev. Jermain Loguen & The Jerry Rescue',
      yearContext: 'Syracuse, New York, 1851–1854',
      body: 'Jermain Wesley Loguen aided over 1,500 freedom seekers through Syracuse. Following the 1851 Jerry Rescue—in which abolitionists freed a captive cooper named William Henry from federal custody—Syracuse citizens openly pledged that no fugitive would ever be taken peacefully from their city.',
      sourceAttribution: 'Rev. J. W. Loguen, As a Slave and as a Freeman (1859).',
    },
    choices: [
      {
        id: 'join_rescue',
        label: 'Join Loguen’s Vigilance volunteers at the canal alley to rescue the mother and child',
        detail: 'Help overturn a coal cart in the street to block the hunters while the mother and infant slip into the church cellar.',
        riskTier: 'HIGH',
        riskPointsLabel: '+22 Risk · −20 Stealth',
        rewardSummary: 'Reward: Ally (Rev. Loguen), +20 Resolve, +20 Network & Family Saved',
        nextNodeId: 'rochester_station',
        resolveChoice: (meters) => {
          const nextStealth = meters.stealth - 20;
          const nextRisk = meters.cumulativeRisk + 22;
          if ((nextStealth <= 0 || nextRisk >= 100) && meters.network + 20 < 60) {
            return {
              nextNodeId: 'ending_intercepted',
              effects: {
                resolveDelta: 20,
                networkDelta: 20,
                stealthDelta: -20,
                riskDelta: 22,
                setFlags: { savedSyracuseFamily: true },
                outcomeSummary: 'The mother and child vanish safely into the church cellar, yet federal marshals corner your retreat at the canal bridge.',
                tone: 'danger',
              },
            };
          }
          return {
            nextNodeId: 'rochester_station',
            effects: {
              resolveDelta: 20,
              networkDelta: 20,
              stealthDelta: -20,
              riskDelta: 22,
              addAlly: 'jermain_loguen',
              setFlags: { savedSyracuseFamily: true },
              outcomeSummary: 'Lanterns shatter against the cobblestones; the mother and child reach safety, and Loguen telegraphs word directly to Frederick Douglass in Rochester.',
              tone: 'sanctuary',
            },
          };
        },
      },
      {
        id: 'give_coat_stay_hidden',
        label: 'Donate spare woolens and remain hidden in Loguen’s cellar',
        detail: 'Support the rescue quietly with supplies without stepping into street light.',
        riskTier: 'LOW',
        riskPointsLabel: '−5 Risk · +10 Stealth',
        rewardSummary: 'Reward: Preserved Cover (+5 Network, −15 Resolve)',
        nextNodeId: 'rochester_station',
        resolveChoice: () => ({
          nextNodeId: 'rochester_station',
          effects: {
            stealthDelta: 10,
            networkDelta: 5,
            resolveDelta: -15,
            riskDelta: -5,
            outcomeSummary: 'By dawn you learn the mother escaped—yet one volunteer was struck in the scuffle. You depart west with quiet shame.',
            tone: 'caution',
          },
        }),
      },
      {
        id: 'depart_before_dawn',
        label: 'Slip onto the western road immediately before marshals seal Syracuse',
        detail: 'Preserve your own lead at all costs, leaving Syracuse to fight its own battle.',
        riskTier: 'CALCULATED',
        riskPointsLabel: '−15 Risk · +15 Stealth',
        rewardSummary: 'Reward: Sharp Pursuit Drop (−20 Network, −10 Resolve)',
        nextNodeId: 'rochester_station',
        resolveChoice: () => ({
          nextNodeId: 'rochester_station',
          effects: {
            stealthDelta: 15,
            networkDelta: -20,
            resolveDelta: -10,
            riskDelta: -15,
            outcomeSummary: 'You leave Syracuse behind in silence. Pursuit cools, though word travels coldly ahead to Rochester.',
            tone: 'danger',
          },
        }),
      },
    ],
  },

  rochester_station: {
    id: 'rochester_station',
    chapterNumber: 9,
    stationId: 'rochester',
    locationLabel: 'Rochester, New York',
    dateLabel: 'November 29, 1854',
    title: 'Frederick Douglass on the Genesee',
    imageKey: 'philadelphia',
    ambientTheme: 'train_frontier',
    npcEncounter: {
      npcId: 'frederick_douglass',
      greeting:
        'In the candlelit study of his South Avenue home—galley proofs of Frederick Douglass’ Paper stacked beside a map of Lake Ontario—Frederick Douglass rises to clasp your frost-reddened hands.',
      counselQuestion: 'Ask Frederick Douglass how he escaped Maryland and how to breach the final 80 miles',
      counselResponse:
        '"Sixteen years ago I rode north out of Baltimore dressed as a sailor with borrowed Seaman’s Protection papers—and a heart beating loud enough to drown the train. Watch your Pursuit Risk closely now: if marshals already hold your description, take the midnight boxcar or canal path; if your Network stands firm, my Lake Ontario schooner captain awaits."',
      counselInsight:
        'Douglass reduces Risk (−5 Risk) and adds +10 Network, preparing his personal Vigilance introduction for Niagara.',
      counselBonus: {
        networkDelta: 10,
        riskDelta: -5,
      },
    },
    narrative: (inv, meters) => [
      'Snow dusts the rooftops of Rochester, final stronghold along Lake Ontario. Here Frederick Douglass and Anna Murray Douglass shelter up to eleven freedom seekers at once while raising fares through the Rochester Ladies’ Anti-Slavery Society.',
      meters.cumulativeRisk >= 65
        ? 'Douglass studies the latest telegraph warnings with furrowed brow: your Pursuit Risk is dangerously high, and federal deputies are sweeping the Genesee docks.'
        : inv.savedSyracuseFamily
          ? 'Loguen’s cipher from Syracuse preceded you. Douglass listens intently to your account of the canal rescue, offering hot tea and a signed Vigilance letter—though he warns that federal marshals are boarding passenger trains along the Niagara line.'
          : 'Douglass listens gravely to the toll the road has taken on you, warning that federal marshals are boarding passenger cars all along the Niagara line.',
      'British soil lies just eighty miles west across the gorge, yet Lake Ontario’s winter gales and rail inspections turn this final stretch into a razor’s edge.',
    ],
    dilemmaPrompt: 'How will you cover the final eighty miles to the Niagara Frontier?',
    historicalNote: {
      heading: 'Frederick Douglass’s Rochester Station',
      yearContext: 'Rochester, New York, 1847–1860',
      body: 'In Rochester, Frederick Douglass and Anna Murray Douglass sheltered hundreds of freedom seekers in their South Avenue home. After the 1850 Fugitive Slave Act, Douglass—who had previously leaned toward Garrisonian pacifism—publicly defended armed resistance against kidnappers.',
      sourceAttribution: 'Frederick Douglass, Life and Times of Frederick Douglass (1881).',
    },
    choices: [
      {
        id: 'schooner_wait',
        label: 'Accept Douglass’s Vigilance letter and wait for his Lake Ontario schooner captain',
        detail: 'Rely on Douglass’s maritime contacts for warm passage across the lake toward the Niagara mouth.',
        riskTier: 'CALCULATED',
        riskPointsLabel: '−10 Risk if Network ≥ 55 (+15 Risk if low)',
        rewardSummary: 'Reward: Ally (Frederick Douglass), Safer Schooner Route & +10 Resolve',
        nextNodeId: 'niagara_crossing',
        resolveChoice: (meters) => {
          if (meters.network >= 55) {
            return {
              nextNodeId: 'niagara_crossing',
              effects: {
                resolveDelta: 10,
                networkDelta: 10,
                riskDelta: -10,
                addAlly: 'frederick_douglass',
                unlockRoute: 'Douglass’s Lake Ontario Schooner',
                setFlags: { douglassLetter: true },
                outcomeSummary: 'Douglass seals a Vigilance letter into your coat and arranges berth aboard a sympathetic grain schooner sailing under snow squalls.',
                tone: 'sanctuary',
              },
            };
          }
          return {
            nextNodeId: 'niagara_crossing',
            effects: {
              resolveDelta: 5,
              stealthDelta: -15,
              riskDelta: 15,
              addAlly: 'frederick_douglass',
              setFlags: { douglassLetter: true },
              outcomeSummary: 'Douglass gives you his letter and shelter, though waiting an extra day lets marshals narrow your trail to the Genesee riverfront.',
              tone: 'danger',
            },
          };
        },
      },
      {
        id: 'freight_boxcar',
        label: 'Thank Douglass for his letter and slip aboard a midnight Great Western freight boxcar',
        detail: 'Ride hidden behind stacked grain sacks straight toward the Niagara Suspension Bridge yards.',
        riskTier: 'HIGH',
        riskPointsLabel: '−10 Risk · +15 Stealth (−15 Resolve)',
        rewardSummary: 'Reward: Ally (Frederick Douglass) & Fast Border Approach',
        nextNodeId: 'niagara_crossing',
        resolveChoice: (meters) => {
          if (meters.resolve - 15 <= 0) {
            return {
              nextNodeId: meters.network >= 60 ? 'ending_vigilance_rescue' : 'ending_intercepted',
              effects: {
                resolveDelta: -15,
                stealthDelta: 15,
                riskDelta: -10,
                outcomeSummary: 'Frostbite and exhaustion leave you unable to rise when the freight door slides open at Suspension Bridge.',
                tone: 'danger',
              },
            };
          }
          return {
            nextNodeId: 'niagara_crossing',
            effects: {
              resolveDelta: -15,
              stealthDelta: 15,
              riskDelta: -10,
              addAlly: 'frederick_douglass',
              setFlags: { douglassLetter: true },
              outcomeSummary: 'Shivering beneath burlap grain sacks with Douglass’s letter buttoned inside your collar, you tumble out in the rail shadow of the Niagara Gorge.',
              tone: 'caution',
            },
          };
        },
      },
      {
        id: 'canal_towpath',
        label: 'March west along the frozen Erie Canal towpath beneath falling snow',
        detail: 'Avoid stations and schedules altogether, relying strictly on endurance.',
        riskTier: 'LOW',
        riskPointsLabel: '−10 Risk · +10 Stealth',
        rewardSummary: 'Reward: Untraceable Snow March (−15 Resolve)',
        nextNodeId: 'niagara_crossing',
        resolveChoice: () => ({
          nextNodeId: 'niagara_crossing',
          effects: {
            resolveDelta: -15,
            stealthDelta: 10,
            riskDelta: -10,
            outcomeSummary: 'Snow erases your footprints within minutes along the canal ice as the roar of Niagara rises ahead.',
            tone: 'caution',
          },
        }),
      },
    ],
  },

  niagara_crossing: {
    id: 'niagara_crossing',
    chapterNumber: 10,
    stationId: 'niagara',
    locationLabel: 'Niagara Gorge, New York / Ontario',
    dateLabel: 'December 1, 1854 · 4:15 AM',
    title: 'Feet from British Soil',
    imageKey: 'niagara',
    ambientTheme: 'niagara_falls',
    npcEncounter: {
      npcId: 'harriet_tubman',
      greeting:
        'Near the icy approach to the Suspension Bridge, a bundled figure steps from behind a limestone pillar—Harriet Tubman, crossing back from her St. Catharines base to meet late-autumn travelers at the border.',
      counselQuestion: 'Ask Harriet Tubman how to clear the American tollhouse inspection',
      counselResponse:
        '"Look right at the Canadian lamps across the water and keep your chin level. If you carry my button token, William Still’s cipher, or Mr. Douglass’s word, the timber driver in line knows our lantern sign. Otherwise, take the gorge steps to the river skiff—never walk empty-handed into a marshal’s lantern."',
      counselInsight:
        'Harriet’s border reconnaissance trims Risk (−5 Risk) and adds +5 Stealth before your final crossing.',
      counselBonus: {
        stealthDelta: 5,
        riskDelta: -5,
      },
    },
    narrative: (inv, meters) => [
      'A freezing mist rises from the Niagara Gorge, icing the iron cables of the Suspension Bridge. Across that narrow span lies Canada West—where British law abolished slavery twenty years ago in 1834, and the Crown refuses to surrender freedom seekers to American courts.',
      inv.travelingWithClara
        ? 'Clara stands beside you in the snow, eyes fixed on the faint amber lanterns glowing on the Canadian bluff. Only two hundred yards of timber and iron separate bondage from liberty.'
        : 'Through drifting snow, amber lanterns glow faintly on the Canadian bluff. Only two hundred yards of timber and iron separate bondage from liberty.',
      meters.cumulativeRisk >= 70
        ? 'At the American tollhouse, three federal deputies compare handbills closely under oil lamps—your high Pursuit Risk makes an unassisted crossing perilous.'
        : 'Yet at the American tollhouse, two men in heavy wool overcoats stand beside the gatekeeper, checking every lantern-lit carriage and pedestrian crossing before dawn.',
    ],
    dilemmaPrompt: 'Make your final crossing over the Niagara frontier.',
    historicalNote: {
      heading: 'The Niagara Frontier & Canada West',
      yearContext: 'Niagara Suspension Bridge & St. Catharines, 1854',
      body: 'Once across the Niagara River—by rowboat, ferry, or the Niagara Suspension Bridge—freedom seekers entered British North America where slavery had been outlawed by the Slavery Abolition Act of 1833 (effective August 1, 1834). St. Catharines became Harriet Tubman’s northern base throughout the 1850s.',
      sourceAttribution: 'Karolyn Smardz Frost, Steal Away Home & Parks Canada Underground Railroad Archives.',
    },
    choices: [
      {
        id: 'cipher_timber_wagon',
        label: 'Show Tubman’s token or Douglass’s Vigilance letter to the sympathetic timber driver',
        detail: 'Slip beneath planks inside a Canadian-bound lumber dray recognized by the border Vigilance network.',
        riskTier: 'LOW',
        riskPointsLabel: '−15 Risk · +20 Stealth',
        rewardSummary: 'Reward: Safer Timber Wagon Crossing (Requires Network ≥ 55)',
        nextNodeId: 'ending_freedom_solidarity',
        condition: { minNetwork: 55 },
        unavailableReason: 'Requires strong Underground Network ties (55+ Network) to signal the bridge driver.',
        resolveChoice: (meters) => {
          const outcomeNode =
            meters.resolve >= 45 && meters.network >= 60
              ? 'ending_freedom_solidarity'
              : 'ending_freedom_solitary';
          return {
            nextNodeId: outcomeNode,
            effects: {
              stealthDelta: 20,
              resolveDelta: 10,
              riskDelta: -15,
              unlockRoute: 'Niagara Timber Dray',
              outcomeSummary: 'The timber driver recognizes the Vigilance sign, drops the tailgate canvas, and rolls smoothly past the tollhouse onto British soil.',
              tone: 'sanctuary',
            },
          };
        },
      },
      {
        id: 'gorge_rowboat',
        label: 'Descend the icy gorge stairs below the bridge to a waiting fisherman’s skiff',
        detail: 'Cross the dark swirling river beneath the falls by oar, testing every ounce of strength.',
        riskTier: 'CALCULATED',
        riskPointsLabel: '+5 Risk · +15 Stealth (−10 Resolve)',
        rewardSummary: 'Reward: Dark River Crossing (Tests Resolve vs. Pursuit Risk)',
        nextNodeId: 'ending_freedom_solitary',
        resolveChoice: (meters) => {
          if (meters.resolve < 30 || (meters.cumulativeRisk >= 80 && meters.stealth < 50)) {
            return {
              nextNodeId: meters.network >= 60 ? 'ending_vigilance_rescue' : 'ending_intercepted',
              effects: {
                resolveDelta: -15,
                riskDelta: 10,
                outcomeSummary: 'On the slick stone steps, exhaustion and close pursuit draw the tollhouse lanterns down to the river bank.',
                tone: 'danger',
              },
            };
          }
          const outcomeNode =
            meters.network >= 60 && meters.resolve >= 45
              ? 'ending_freedom_solidarity'
              : 'ending_freedom_solitary';
          return {
            nextNodeId: outcomeNode,
            effects: {
              resolveDelta: -10,
              stealthDelta: 15,
              riskDelta: 5,
              outcomeSummary: 'Oars dip silently into the black current. Minutes later, the keel scrapes frozen Canadian gravel.',
              tone: 'sanctuary',
            },
          };
        },
      },
      {
        id: 'bold_pedestrian_crossing',
        label: 'Walk straight across the upper footway at shift change, armed or resolute',
        detail: 'Walk steadily behind morning market farmers, refusing to look back toward the tollhouse.',
        riskTier: 'HIGH',
        riskPointsLabel: '+18 Risk · Tests Stealth + Defense vs. Pursuit Risk',
        rewardSummary: 'Reward: Direct Bridge Crossing into Canada West',
        nextNodeId: 'ending_freedom_solidarity',
        resolveChoice: (meters, inv) => {
          const successScore =
            meters.stealth +
            (inv.armedDefense ? 15 : 0) +
            (meters.resolve >= 50 ? 10 : 0) -
            Math.floor(meters.cumulativeRisk * 0.25);
          if (successScore < 42) {
            return {
              nextNodeId: meters.network >= 60 ? 'ending_vigilance_rescue' : 'ending_intercepted',
              effects: {
                stealthDelta: -25,
                riskDelta: 18,
                outcomeSummary: 'A federal deputy recognizes your description in the lantern shadow halfway to the center span.',
                tone: 'danger',
              },
            };
          }
          const outcomeNode =
            meters.network >= 60 && meters.resolve >= 45
              ? 'ending_freedom_solidarity'
              : 'ending_freedom_solitary';
          return {
            nextNodeId: outcomeNode,
            effects: {
              resolveDelta: 10,
              riskDelta: 10,
              outcomeSummary: 'Your boots strike the British boundary iron at mid-span. The deputies dare not cross a single inch farther.',
              tone: 'sanctuary',
            },
          };
        },
      },
    ],
  },

  ending_freedom_solidarity: {
    id: 'ending_freedom_solidarity',
    chapterNumber: 11,
    stationId: 'st_catharines',
    locationLabel: 'St. Catharines, Canada West',
    dateLabel: 'December 1854',
    title: 'Sanctuary Beneath the North Star',
    imageKey: 'niagara',
    ambientTheme: 'sanctuary_dawn',
    isEnding: true,
    endingType: 'FREEDOM_SOLIDARITY',
    narrative: (inv) => [
      inv.travelingWithClara
        ? 'You and Clara step onto frozen earth in St. Catharines, where the bell of the British Methodist Episcopal Salem Chapel rings softly across the snow. Harriet Tubman walks beside you up the lane; no federal commissioner’s warrant holds power here.'
        : 'You step onto frozen earth in St. Catharines, where the bell of the British Methodist Episcopal Salem Chapel rings softly across the snow. No federal commissioner’s warrant holds power here.',
      inv.trueNameRecorded
        ? 'Because you entrusted your true name to William Still in Philadelphia, years later—when emancipation finally arrives and Still publishes his hidden ledger in 1872—word reaches Aunt Martha’s surviving kin in Dorchester County, reuniting your fractured family.'
        : 'Through the conductors and abolitionists you stood beside—Harriet Tubman, Thomas Garrett, William Still, Jermain Loguen, and Frederick Douglass—your calculated courage strengthens the invisible network for hundreds who will follow next winter.',
      inv.savedSyracuseFamily
        ? 'At the St. Catharines refugee aid house, you meet the Virginia mother and infant you helped rescue in Syracuse, warming their hands beside the same stove.'
        : 'Around the chapel stove, fellow freedom seekers from Maryland and Virginia share bread, hymns, and plans to build a new life in freedom.',
    ],
    dilemmaPrompt: 'Journey Complete — Liberty Reached in Solidarity.',
    historicalNote: {
      heading: 'St. Catharines & Harriet Tubman’s Base',
      yearContext: 'Canada West (Ontario), 1851–1861',
      body: 'St. Catharines hosted one of the largest Underground Railroad settlements in British North America. Harriet Tubman lived there between rescue missions south, worshiping at the Salem Chapel (British Methodist Episcopal Church), which still stands today as a historic landmark.',
      sourceAttribution: 'Salem Chapel BME Church Archives, St. Catharines, Ontario.',
    },
    choices: [],
  },

  ending_freedom_solitary: {
    id: 'ending_freedom_solitary',
    chapterNumber: 11,
    stationId: 'st_catharines',
    locationLabel: 'St. Catharines, Canada West',
    dateLabel: 'December 1854',
    title: 'A Quiet Dawn Across the Gorge',
    imageKey: 'niagara',
    ambientTheme: 'sanctuary_dawn',
    isEnding: true,
    endingType: 'FREEDOM_SOLITARY',
    narrative: (inv) => [
      inv.travelingWithClara
        ? 'Frost-bitten and breathless, you and Clara reach the Canadian bluff above the Niagara Gorge. The pursuit stops abruptly at the American tollhouse behind you.'
        : 'Frost-bitten and exhausted, you reach the Canadian bluff above the Niagara Gorge. The pursuit stops abruptly at the American tollhouse behind you.',
      'Freedom is yours—hard-won through icy marshes, concealed attics, and agonizing choices where caution demanded leaving companions, strangers, or your own recorded name in shadow.',
      inv.trueNameRecorded
        ? 'Though your path taxed the stations along the route, William Still’s quiet ledger in Philadelphia still holds the true thread of who you are and where you came from.'
        : 'Looking south across the steaming gorge toward Maryland, you carry the quiet grief of those left behind without a written trail—yet you resolve to send word back through Frederick Douglass’s and Harriet Tubman’s couriers.',
    ],
    dilemmaPrompt: 'Journey Complete — Freedom Won Through Endurance.',
    historicalNote: {
      heading: 'The Cost of Winter Flight',
      yearContext: 'Canada West Refugees, 1850s',
      body: 'Between 30,000 and 40,000 freedom seekers settled in Canada before the Civil War. Many arrived with frostbite, chronic exhaustion, and deep survivor’s grief for family members unable to escape—yet built thriving mutual-aid societies, schools, and farms in Ontario.',
      sourceAttribution: 'Benjamin Drew, The Refugee: Or the Narratives of Fugitive Slaves in Canada (1856).',
    },
    choices: [],
  },

  ending_vigilance_rescue: {
    id: 'ending_vigilance_rescue',
    chapterNumber: 11,
    stationId: 'st_catharines',
    locationLabel: 'Niagara Frontier → St. Catharines',
    dateLabel: 'December 1854',
    title: 'The Vigilance Rescue',
    imageKey: 'lantern',
    ambientTheme: 'sanctuary_dawn',
    isEnding: true,
    endingType: 'VIGILANCE_RESCUE',
    narrative: () => [
      'A federal marshal’s lantern catches you near the border depot after cumulative risks narrow your trail, and iron cuffs snap shut while awaiting a commissioner’s hearing under the Fugitive Slave Act of 1850.',
      'Yet the trust and allies you forged with Harriet Tubman, William Still, Rev. Loguen, and Frederick Douglass did not vanish in the snow. Within hours, local Vigilance Committee members—alerted by telegraph cipher—pack the depot street, overwhelm the guard in a sudden crowd surge, and spirit you into a waiting sleigh bound across the frozen river.',
      'You enter St. Catharines battered and indebted to dozens of ordinary citizens who risked prison for your liberty.',
    ],
    dilemmaPrompt: 'Journey Complete — Delivered by Collective Action.',
    historicalNote: {
      heading: 'Community Rescues Under the 1850 Law',
      yearContext: 'Boston, Syracuse & Oberlin, 1851–1858',
      body: 'When freedom seekers were seized in northern towns, Vigilance Committees sometimes staged dramatic public rescues—including Shadrach Minkins in Boston (1851), Jerry Henry in Syracuse (1851), and John Price in Oberlin-Wellington (1858)—spirited straight to Canada.',
      sourceAttribution: 'Stanley Campbell, The Slave Catchers: Enforcement of the Fugitive Slave Law.',
    },
    choices: [],
  },

  ending_intercepted: {
    id: 'ending_intercepted',
    chapterNumber: 11,
    stationId: 'niagara',
    locationLabel: 'Federal Hearing — New York Border',
    dateLabel: 'December 1854',
    title: 'Intercepted Under the 1850 Act',
    imageKey: 'philadelphia',
    ambientTheme: 'town_study',
    isEnding: true,
    endingType: 'INTERCEPTED',
    narrative: () => [
      'Outnumbered in the winter dark with cumulative pursuit risk catching up and local contacts strained thin, federal deputies enforce a warrant issued under the Fugitive Slave Act of 1850.',
      'Inside a closed commissioner’s chamber, you are barred by statute from testifying on your own behalf, while the commissioner collects his ten-dollar fee for issuing a certificate of removal. Yet even in defeat, word of your flight echoes back through Dorchester County and Philadelphia—proving that no patrol could extinguish the will to be free.',
      'Reflect on how balancing Risk vs. Reward, cultivating trusted allies like Harriet Tubman, William Still, and Frederick Douglass, and unlocking safer routes shape survival along the Underground Railroad.',
    ],
    dilemmaPrompt: 'Journey Halted — Reflect & Chart Another Course.',
    historicalNote: {
      heading: 'The Reality of Capture & Second Attempts',
      yearContext: 'Fugitive Slave Act Hearings, 1850–1860',
      body: 'Roughly 332 freedom seekers were brought before federal commissioners under the 1850 Act; nearly 300 were remanded south. Yet history records men and women like Josiah Henson, Anthony Burns, and countless unnamed travelers whose defiance—and repeated attempts—helped shatter the moral legitimacy of slavery across the North.',
      sourceAttribution: 'Library of Congress & National Underground Railroad Freedom Center.',
    },
    choices: [],
  },
};
