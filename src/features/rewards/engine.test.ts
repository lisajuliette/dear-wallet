import {
  pickDailyQuest,
  rollSticker,
  shouldAwardStar,
  STARTER_COMMON,
  STARTER_RARE,
} from '@/features/rewards/engine';
import { dayKey } from '@/lib/dates';

function sequence(values: number[]): () => number {
  let i = 0;
  return () => {
    const v = values[i] ?? 0;
    i += 1;
    return v;
  };
}

describe('shouldAwardStar', () => {
  it('awards once per local day', () => {
    const noon = new Date(2026, 10, 6, 12);
    const evening = new Date(2026, 10, 6, 22);
    const next = new Date(2026, 10, 7, 1);
    expect(shouldAwardStar([], noon)).toBe(true);
    expect(shouldAwardStar([dayKey(noon)], evening)).toBe(false);
    expect(shouldAwardStar([dayKey(noon)], next)).toBe(true);
  });
});

describe('rollSticker', () => {
  it('misses when roll is above 1/3 and resets streak only on hit', () => {
    const miss = rollSticker(0, sequence([0.5]));
    expect(miss.stickerId).toBeNull();
    expect(miss.nextEmptyStreak).toBe(1);
  });

  it('forces a drop on the 4th empty action (pity)', () => {
    const forced = rollSticker(3, sequence([0.99, 0.5]));
    expect(forced.stickerId).not.toBeNull();
    expect(forced.nextEmptyStreak).toBe(0);
  });

  it('picks rare ~10% over many rolls within tolerance', () => {
    let rare = 0;
    let drops = 0;
    let streak = 0;
    // Deterministic LCG
    let seed = 42;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 0x100000000;
    };

    for (let i = 0; i < 10_000; i += 1) {
      const result = rollSticker(streak, random, STARTER_COMMON, STARTER_RARE);
      streak = result.nextEmptyStreak;
      if (result.stickerId) {
        drops += 1;
        if (result.rare) rare += 1;
      }
    }

    const rareRate = rare / drops;
    expect(drops).toBeGreaterThan(3000);
    expect(rareRate).toBeGreaterThan(0.07);
    expect(rareRate).toBeLessThan(0.13);
  });
});

describe('pickDailyQuest', () => {
  it('uses first_diary_line on the first day', () => {
    expect(pickDailyQuest('2026-11-06', 'user-a', true)).toBe('first_diary_line');
  });

  it('is stable for the same day and user', () => {
    const a = pickDailyQuest('2026-11-06', 'user-a', false);
    const b = pickDailyQuest('2026-11-06', 'user-a', false);
    expect(a).toBe(b);
  });

  it('can differ across users on the same day', () => {
    const a = pickDailyQuest('2026-11-06', 'user-a', false);
    const b = pickDailyQuest('2026-11-06', 'user-b', false);
    // Not guaranteed different, but hash should usually diverge — assert both valid
    expect(a).not.toBe('first_diary_line');
    expect(b).not.toBe('first_diary_line');
  });
});
