import { createTestDatabase } from '@/db/testClient';
import { awardStar, countStars, listStarDays } from '@/features/rewards/stars';
import { LOCAL_USER_ID } from '@/lib/localUser';

const userId = LOCAL_USER_ID;

describe('stars', () => {
  let db: ReturnType<typeof createTestDatabase>;

  beforeEach(() => {
    db = createTestDatabase();
  });

  it('awards one star per local day and lists days', async () => {
    const morning = new Date(2026, 10, 6, 9);
    expect(awardStar(db, userId, 'log', morning)).toBe(true);
    expect(awardStar(db, userId, 'diary', new Date(2026, 10, 6, 22))).toBe(false);
    expect(awardStar(db, userId, 'log', new Date(2026, 10, 7, 1))).toBe(true);

    expect(await countStars(db, userId)).toBe(2);
    expect(await listStarDays(db, userId)).toEqual(['2026-11-06', '2026-11-07']);
  });

  it('returns zero when the user has no stars', async () => {
    expect(await countStars(db, userId)).toBe(0);
    expect(await listStarDays(db, userId)).toEqual([]);
  });
});
