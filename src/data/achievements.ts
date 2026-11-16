import { AchievementDefinition } from '../types/game';

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'successfully_escaped',
    title: 'Successfully Escaped',
    category: 'Liberty Reached',
    description:
      'Crossed the Niagara frontier onto British soil in St. Catharines, beyond the reach of the 1850 Fugitive Slave Act.',
    criteriaHint: 'Reach St. Catharines, Canada West via any escape or rescue ending.',
    checkUnlocked: ({ currentNode }) =>
      currentNode.endingType === 'FREEDOM_SOLIDARITY' ||
      currentNode.endingType === 'FREEDOM_SOLITARY' ||
      currentNode.endingType === 'VIGILANCE_RESCUE',
  },
  {
    id: 'syracuse_rescue',
    title: 'Helped Another Runaway',
    category: 'Moral Solidarity',
    description:
      'Risked your own lead in Syracuse alongside Rev. Jermain Loguen’s volunteers to free a trapped mother and infant.',
    criteriaHint: 'Join the midnight canal-side rescue in Syracuse (Chapter 8).',
    checkUnlocked: ({ inventory }) => inventory.savedSyracuseFamily,
  },
  {
    id: 'moses_discipline',
    title: 'Wade in the Water',
    category: 'Conductor’s Trust',
    description:
      'Followed Harriet Tubman waist-deep into the freezing Choptank reeds to break the hounds’ scent.',
    criteriaHint: 'Wade the Choptank tidal marsh beside Harriet Tubman (Chapter 2).',
    checkUnlocked: ({ inventory }) => inventory.tubmanGuidance,
  },
  {
    id: 'helped_amos',
    title: 'Bread in the Pines',
    category: 'Compassion Under Risk',
    description:
      'Took a calculated risk in Camden Woods to share scarce rations with Amos without betraying station secrecy.',
    criteriaHint: 'Share rations with Amos in Camden Woods, Delaware (Chapter 3).',
    checkUnlocked: ({ inventory }) => inventory.trustedAmos,
  },
  {
    id: 'still_ledger',
    title: 'Ink Against Erasure',
    category: 'Historical Memory',
    description:
      'Entrusted your true name and family lineage to William Still’s secret ledger in Philadelphia for future reunion.',
    criteriaHint: 'Record your true name in William Still’s ledger (Chapter 6).',
    checkUnlocked: ({ inventory }) => inventory.trueNameRecorded,
  },
  {
    id: 'sister_keeper',
    title: 'Keeper of Kin',
    category: 'Family Bond',
    description:
      'Brought your younger sister Clara across the Mason-Dixon Line and into British freedom.',
    criteriaHint: 'Escape to Canada West while traveling alongside Clara.',
    checkUnlocked: ({ currentNode, inventory }) =>
      inventory.travelingWithClara &&
      (currentNode.endingType === 'FREEDOM_SOLIDARITY' ||
        currentNode.endingType === 'FREEDOM_SOLITARY' ||
        currentNode.endingType === 'VIGILANCE_RESCUE'),
  },
  {
    id: 'trusted_coalition',
    title: 'Allies of the North Star',
    category: 'Underground Network',
    description:
      'Forged trusted alliances with at least three historic conductors or Vigilance leaders on one journey.',
    criteriaHint: 'Earn 3 or more Trusted Allies in a single run.',
    checkUnlocked: ({ inventory }) => inventory.trustedAllies.length >= 3,
  },
  {
    id: 'calculated_navigator',
    title: 'Quiet Horizon',
    category: 'Risk Mastery',
    description:
      'Reached Canada West while keeping Cumulative Pursuit Risk below 40 through disciplined planning.',
    criteriaHint: 'Reach freedom with Cumulative Pursuit Risk under 40.',
    checkUnlocked: ({ currentNode, meters }) =>
      meters.cumulativeRisk < 40 &&
      (currentNode.endingType === 'FREEDOM_SOLIDARITY' ||
        currentNode.endingType === 'FREEDOM_SOLITARY' ||
        currentNode.endingType === 'VIGILANCE_RESCUE'),
  },
];
