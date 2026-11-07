import { eq } from 'drizzle-orm';

import { milestones, pageStickers, profiles, unlocks } from '@/db/schema';
import { createTestDatabase } from '@/db/testClient';
import { applyDevSeed } from '@/features/dev/seed';
import { listPageStickers } from '@/features/diary/repository';
import { getActiveGoal } from '@/features/goals/repository';
import { keptTotalCents, listByMonth, listByWeek, keptLogCount } from '@/features/items/repository';
import { countDiaryTextEntries, listAchievedMilestoneIds } from '@/features/rewards/milestones';
import { tallyCaption, buildTallyBars } from '@/features/tally/buildTallyBars';
import { FALLBACK_LOCAL_USER_ID } from '@/lib/localUser';

const userId = FALLBACK_LOCAL_USER_ID;
const now = new Date(2026, 10, 7, 15, 0, 0, 0);

describe('applyDevSeed', () => {
  it('first day is onboarded with an empty diary', async () => {
    const db = createTestDatabase();
    await applyDevSeed(db, 'first_day', userId, now);
    const profile = db.select().from(profiles).where(eq(profiles.id, userId)).get();
    expect(profile?.onboardedAt).toBeTruthy();
    expect(await keptLogCount(db, userId)).toBe(0);
    expect(await getActiveGoal(db, userId)).toBeNull();
  });

  it('active day has three kept things and one loved thing today', async () => {
    const db = createTestDatabase();
    await applyDevSeed(db, 'active_day', userId, now);
    expect(await keptTotalCents(db, userId)).toBe(620 + 280 + 1400);
    const week = await listByWeek(db, userId, now);
    expect(week.filter((item) => item.kind === 'loved')).toHaveLength(1);
  });

  it('quiet week has a single kept day', async () => {
    const db = createTestDatabase();
    await applyDevSeed(db, 'quiet_week', userId, now);
    const week = await listByWeek(db, userId, now);
    const bars = buildTallyBars('week', week, now);
    const total = week.reduce((sum, item) => sum + (item.amountCents ?? 0), 0);
    expect(tallyCaption('week', bars, total)).toBe('a quiet week. still counts ♡');
  });

  it('busy month spreads kept things across the month', async () => {
    const db = createTestDatabase();
    await applyDevSeed(db, 'busy_month', userId, now);
    const month = await listByMonth(db, userId, now);
    const bars = buildTallyBars('month', month, now);
    const total = month.reduce((sum, item) => sum + (item.amountCents ?? 0), 0);
    expect(month.length).toBeGreaterThan(2);
    expect(tallyCaption('month', bars, total)).toMatch(/^wk \d was ur biggest week/);
  });

  it('decorated diary stores sticker positions as page fractions', async () => {
    const db = createTestDatabase();
    await applyDevSeed(db, 'decorated_diary', userId, now);
    const placed = db.select().from(pageStickers).all();
    expect(placed.length).toBeGreaterThanOrEqual(3);
    for (const sticker of placed) {
      expect(sticker.x).toBeGreaterThan(0);
      expect(sticker.x).toBeLessThan(1);
      expect(sticker.y).toBeGreaterThan(0);
      expect(sticker.y).toBeLessThan(1);
    }
    const page = await listPageStickers(db, userId, placed[0]?.diaryEntryId ?? '');
    expect(page.length).toBeGreaterThan(0);
  });

  it('goal in progress stays under the target', async () => {
    const db = createTestDatabase();
    await applyDevSeed(db, 'goal_progress', userId, now);
    const goal = await getActiveGoal(db, userId);
    expect(goal?.name).toBe('new headphones');
    expect(goal?.reachedAt).toBeNull();
    expect(await keptTotalCents(db, userId)).toBeLessThan(goal?.targetCents ?? 0);
  });

  it('goal reached marks the goal', async () => {
    const db = createTestDatabase();
    await applyDevSeed(db, 'goal_reached', userId, now);
    const goal = await getActiveGoal(db, userId);
    expect(goal?.reachedAt).toBeTruthy();
    expect(await keptTotalCents(db, userId)).toBeGreaterThanOrEqual(goal?.targetCents ?? 0);
  });

  it('milestones ready sit one step under the next thresholds', async () => {
    const db = createTestDatabase();
    await applyDevSeed(db, 'milestones_ready', userId, now);
    expect(await keptTotalCents(db, userId)).toBe(9999);
    expect(await keptLogCount(db, userId)).toBe(49);
    expect(await countDiaryTextEntries(db, userId)).toBe(9);
    const achieved = await listAchievedMilestoneIds(db, userId);
    expect(achieved).toEqual(['first_nvm']);
    const seen = db.select().from(milestones).where(eq(milestones.userId, userId)).get();
    expect(seen?.seenAt).toBeTruthy();
  });

  it('palettes seed unlocks two earned faceplates and leaves orchid locked', async () => {
    const db = createTestDatabase();
    await applyDevSeed(db, 'palettes_mixed', userId, now);
    const rows = db.select().from(unlocks).all();
    const ids = rows.map((row) => row.unlockId);
    expect(ids).toEqual(expect.arrayContaining(['palette:peachsoda', 'palette:midnight']));
    expect(ids).not.toContain('palette:orchid');
  });
});
