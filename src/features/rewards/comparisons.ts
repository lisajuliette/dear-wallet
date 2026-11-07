import type { MilestoneId } from '@/features/rewards/milestonesCatalog';

/** Real-world comparisons for money milestones (BUILD_SPEC §11). */
const MONEY: Partial<Record<MilestoneId, string>> = {
  kept_100: '4 cute tees',
  kept_250: "a weekend trip's worth of snacks",
  kept_500: '3 concert tickets',
  kept_1000: 'a whole new phone',
};

const COUNT: Partial<Record<MilestoneId, string>> = {
  first_nvm: 'ur first lil win. no streak needed',
  logs_50: '50 lil wins, no streak needed',
  logs_100: '100 lil wins, no streak needed',
  diary_10: '10 diary pages, soft and private',
  diary_30: '30 diary pages, soft and private',
};

export function comparisonFor(id: MilestoneId): string {
  return MONEY[id] ?? COUNT[id] ?? 'a soft win, kept forever';
}
