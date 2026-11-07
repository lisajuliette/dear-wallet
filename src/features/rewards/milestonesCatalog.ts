export type MilestoneId =
  | 'first_nvm'
  | 'kept_100'
  | 'kept_250'
  | 'kept_500'
  | 'kept_1000'
  | 'logs_50'
  | 'logs_100'
  | 'diary_10'
  | 'diary_30';

export type MilestoneUnit = 'KEPT' | 'NVMS LOGGED' | 'DIARY LINES';

export type MilestoneUnlock =
  | { kind: 'pack'; id: 'y2k_desk' | 'holo_club'; label: string; count: number }
  | { kind: 'palette'; id: 'peachsoda' | 'orchid' | 'midnight'; label: string }
  | null;

export type MilestoneDef = {
  id: MilestoneId;
  /** Display big number string, e.g. "$100" or "50". */
  big: string;
  unit: MilestoneUnit;
  headline: string;
  unlock: MilestoneUnlock;
  /** Stable order for evaluation and Collection. */
  order: number;
};

export type MilestoneStats = {
  keptTotalCents: number;
  keptLogCount: number;
  diaryTextCount: number;
};

export const MILESTONES: MilestoneDef[] = [
  {
    id: 'first_nvm',
    big: '1',
    unit: 'NVMS LOGGED',
    headline: 'u keep showing up.',
    unlock: null,
    order: 0,
  },
  {
    id: 'kept_100',
    big: '$100',
    unit: 'KEPT',
    headline: "that's actually huge.",
    unlock: null,
    order: 1,
  },
  {
    id: 'kept_250',
    big: '$250',
    unit: 'KEPT',
    headline: "that's actually huge.",
    unlock: null,
    order: 2,
  },
  {
    id: 'kept_500',
    big: '$500',
    unit: 'KEPT',
    headline: "$500 kept. that's actually huge.",
    unlock: { kind: 'pack', id: 'y2k_desk', label: 'y2k desk sticker pack', count: 6 },
    order: 3,
  },
  {
    id: 'kept_1000',
    big: '$1,000',
    unit: 'KEPT',
    headline: "$1,000 kept. that's actually huge.",
    unlock: { kind: 'palette', id: 'midnight', label: 'Midnight CD' },
    order: 4,
  },
  {
    id: 'logs_50',
    big: '50',
    unit: 'NVMS LOGGED',
    headline: 'u keep showing up.',
    unlock: { kind: 'pack', id: 'holo_club', label: 'holo club sticker pack', count: 3 },
    order: 5,
  },
  {
    id: 'logs_100',
    big: '100',
    unit: 'NVMS LOGGED',
    headline: 'u keep showing up.',
    unlock: { kind: 'palette', id: 'peachsoda', label: 'Peach Soda' },
    order: 6,
  },
  {
    id: 'diary_10',
    big: '10',
    unit: 'DIARY LINES',
    headline: 'u keep showing up.',
    unlock: null,
    order: 7,
  },
  {
    id: 'diary_30',
    big: '30',
    unit: 'DIARY LINES',
    headline: 'u keep showing up.',
    unlock: { kind: 'palette', id: 'orchid', label: 'Orchid Pop' },
    order: 8,
  },
];

export function milestoneById(id: string): MilestoneDef | undefined {
  return MILESTONES.find((m) => m.id === id);
}

export function unlockRowId(unlock: NonNullable<MilestoneUnlock>): string {
  return unlock.kind === 'pack' ? `pack:${unlock.id}` : `palette:${unlock.id}`;
}

export function unlockForMilestone(id: MilestoneId): string | null {
  const def = milestoneById(id);
  if (!def?.unlock) return null;
  return unlockRowId(def.unlock);
}

function crosses(def: MilestoneDef, stats: MilestoneStats): boolean {
  switch (def.id) {
    case 'first_nvm':
      return stats.keptLogCount >= 1;
    case 'kept_100':
      return stats.keptTotalCents >= 10_000;
    case 'kept_250':
      return stats.keptTotalCents >= 25_000;
    case 'kept_500':
      return stats.keptTotalCents >= 50_000;
    case 'kept_1000':
      return stats.keptTotalCents >= 100_000;
    case 'logs_50':
      return stats.keptLogCount >= 50;
    case 'logs_100':
      return stats.keptLogCount >= 100;
    case 'diary_10':
      return stats.diaryTextCount >= 10;
    case 'diary_30':
      return stats.diaryTextCount >= 30;
    default:
      return false;
  }
}

/**
 * Newly crossed milestones only, in catalogue order.
 * Already-achieved ids are never returned (milestones are never revoked).
 */
export function evaluateMilestones(
  stats: MilestoneStats,
  alreadyAchieved: Iterable<string>,
): MilestoneId[] {
  const done = new Set(alreadyAchieved);
  return MILESTONES.filter((m) => !done.has(m.id) && crosses(m, stats)).map((m) => m.id);
}

/** Next incomplete milestone after the given achieved set, or null. */
export function nextMilestone(alreadyAchieved: Iterable<string>): MilestoneDef | null {
  const done = new Set(alreadyAchieved);
  return MILESTONES.find((m) => !done.has(m.id)) ?? null;
}
