import {
  evaluateMilestones,
  MILESTONES,
  unlockForMilestone,
  type MilestoneStats,
} from '@/features/rewards/milestonesCatalog';

const empty: MilestoneStats = { keptTotalCents: 0, keptLogCount: 0, diaryTextCount: 0 };

describe('evaluateMilestones', () => {
  it.each([
    ['first_nvm', { ...empty, keptLogCount: 1 }, 'first_nvm'],
    ['kept_100 at', { ...empty, keptTotalCents: 10_000 }, 'kept_100'],
    ['kept_250 at', { ...empty, keptTotalCents: 25_000 }, 'kept_250'],
    ['kept_500 at', { ...empty, keptTotalCents: 50_000 }, 'kept_500'],
    ['kept_1000 at', { ...empty, keptTotalCents: 100_000 }, 'kept_1000'],
    ['logs_50 at', { ...empty, keptLogCount: 50 }, 'logs_50'],
    ['logs_100 at', { ...empty, keptLogCount: 100 }, 'logs_100'],
    ['diary_10 at', { ...empty, diaryTextCount: 10 }, 'diary_10'],
    ['diary_30 at', { ...empty, diaryTextCount: 30 }, 'diary_30'],
  ] as const)('%s crosses', (_label, stats, id) => {
    expect(evaluateMilestones(stats, [])).toContain(id);
  });

  it.each([
    ['kept_100 below', { ...empty, keptTotalCents: 9_999 }, 'kept_100'],
    ['kept_250 below', { ...empty, keptTotalCents: 24_999 }, 'kept_250'],
    ['kept_500 below', { ...empty, keptTotalCents: 49_999 }, 'kept_500'],
    ['kept_1000 below', { ...empty, keptTotalCents: 99_999 }, 'kept_1000'],
    ['logs_50 below', { ...empty, keptLogCount: 49 }, 'logs_50'],
    ['logs_100 below', { ...empty, keptLogCount: 99 }, 'logs_100'],
    ['diary_10 below', { ...empty, diaryTextCount: 9 }, 'diary_10'],
    ['diary_30 below', { ...empty, diaryTextCount: 29 }, 'diary_30'],
    ['first_nvm below', { ...empty, keptLogCount: 0 }, 'first_nvm'],
  ] as const)('%s does not cross', (_label, stats, id) => {
    expect(evaluateMilestones(stats, [])).not.toContain(id);
  });

  it('returns multiple money milestones when far above', () => {
    const ids = evaluateMilestones({ ...empty, keptTotalCents: 100_000, keptLogCount: 1 }, []);
    expect(ids).toEqual(['first_nvm', 'kept_100', 'kept_250', 'kept_500', 'kept_1000']);
  });

  it('filters already achieved', () => {
    const ids = evaluateMilestones({ ...empty, keptTotalCents: 100_000, keptLogCount: 1 }, [
      'first_nvm',
      'kept_100',
    ]);
    expect(ids).toEqual(['kept_250', 'kept_500', 'kept_1000']);
  });

  it('maps unlocks for pack and Midnight CD', () => {
    expect(unlockForMilestone('kept_500')).toBe('pack:y2k_desk');
    expect(unlockForMilestone('kept_1000')).toBe('palette:midnight');
    expect(unlockForMilestone('logs_50')).toBe('pack:holo_club');
    expect(unlockForMilestone('logs_100')).toBe('palette:peachsoda');
    expect(unlockForMilestone('diary_30')).toBe('palette:orchid');
    expect(unlockForMilestone('first_nvm')).toBeNull();
  });

  it('covers all nine catalogue entries', () => {
    expect(MILESTONES).toHaveLength(9);
  });
});
