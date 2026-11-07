import { eq } from 'drizzle-orm';

import {
  diaryEntries,
  goals,
  items,
  milestones,
  outbox,
  pageStickers,
  quests,
  stars,
  stickerAwards,
  unlocks,
} from '@/db/schema';
import { runTransaction, type ItemsDb } from '@/db/transaction';
import { saveDiaryEntry, replacePageStickers } from '@/features/diary/repository';
import { checkGoalReached, createGoal } from '@/features/goals/repository';
import { createItem } from '@/features/items/repository';
import { markOnboarded } from '@/features/onboarding/profile';
import { markMilestoneSeen, recordMilestones } from '@/features/rewards/milestones';
import { awardStar } from '@/features/rewards/stars';
import { awardSticker } from '@/features/rewards/stickers';
import { savePalette } from '@/features/settings/prefs';
import { dayKey, weekRange } from '@/lib/dates';
import { getLocalUserId } from '@/lib/localUser';

export const SEED_SCENARIOS = [
  'first_day',
  'active_day',
  'quiet_week',
  'busy_month',
  'decorated_diary',
  'goal_progress',
  'goal_reached',
  'milestones_ready',
  'palettes_mixed',
] as const;

export type SeedScenario = (typeof SEED_SCENARIOS)[number];

export const SEED_LABELS: Record<SeedScenario, { label: string; detail: string }> = {
  first_day: { label: 'first day', detail: 'onboarded, nothing logged yet' },
  active_day: { label: 'active day', detail: 'three kept things today, plus one loved' },
  quiet_week: { label: 'quiet week', detail: 'one kept thing this week, not today' },
  busy_month: { label: 'busy month', detail: 'kept things across this month' },
  decorated_diary: { label: 'decorated diary', detail: 'two pages with stickers' },
  goal_progress: { label: 'goal in progress', detail: 'headphones, partway there' },
  goal_reached: { label: 'goal reached', detail: 'a small goal already reached' },
  milestones_ready: {
    label: 'milestones ready',
    detail: '$99.99 kept, 49 logs, 9 diary lines. next one crosses',
  },
  palettes_mixed: {
    label: 'palettes',
    detail: 'Peach Soda and Midnight CD unlocked, Orchid Pop still locked',
  },
};

function noon(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return noon(next);
}

async function resetLocalData(db: ItemsDb, userId: string): Promise<void> {
  runTransaction(db, (tx) => {
    tx.delete(pageStickers).where(eq(pageStickers.userId, userId)).run();
    tx.delete(stickerAwards).where(eq(stickerAwards.userId, userId)).run();
    tx.delete(diaryEntries).where(eq(diaryEntries.userId, userId)).run();
    tx.delete(items).where(eq(items.userId, userId)).run();
    tx.delete(stars).where(eq(stars.userId, userId)).run();
    tx.delete(quests).where(eq(quests.userId, userId)).run();
    tx.delete(milestones).where(eq(milestones.userId, userId)).run();
    tx.delete(unlocks).where(eq(unlocks.userId, userId)).run();
    tx.delete(goals).where(eq(goals.userId, userId)).run();
    tx.delete(outbox).run();
  });
  await markOnboarded(db, userId);
  await savePalette(db, 'cloud');
}

async function kept(
  db: ItemsDb,
  userId: string,
  name: string,
  amountCents: number,
  happenedAt: Date,
): Promise<void> {
  await createItem(db, { userId, kind: 'kept', name, amountCents, happenedAt });
  awardStar(db, userId, 'log', happenedAt);
}

/** Replace this device's local diary with one review state. Dev builds only. */
export async function applyDevSeed(
  db: ItemsDb,
  scenario: SeedScenario,
  userId: string = getLocalUserId(),
  now: Date = new Date(),
): Promise<void> {
  await resetLocalData(db, userId);
  const today = noon(now);

  if (scenario === 'first_day') return;

  if (scenario === 'active_day') {
    await kept(db, userId, 'matcha', 620, today);
    await kept(db, userId, 'the bus', 280, today);
    await kept(db, userId, 'lip gloss', 1400, today);
    await createItem(db, { userId, kind: 'loved', name: 'window seat', happenedAt: today });
    return;
  }

  if (scenario === 'quiet_week') {
    const monday = noon(weekRange(now).start);
    await kept(db, userId, 'a pastry', 350, monday);
    return;
  }

  if (scenario === 'busy_month') {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 12);
    const days = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12].filter((day) => {
      const date = new Date(now.getFullYear(), now.getMonth(), day, 12);
      return date <= today;
    });
    const names = ['coffee', 'lunch', 'a book', 'snacks', 'a plant', 'the bus', 'matcha', 'boba'];
    const amounts = [450, 1200, 800, 650, 1500, 900, 620, 480, 700, 540];
    for (let i = 0; i < days.length; i += 1) {
      const date = new Date(monthStart);
      date.setDate(days[i] ?? 1);
      await kept(db, userId, names[i % names.length] ?? 'a little thing', amounts[i] ?? 400, date);
    }
    return;
  }

  if (scenario === 'decorated_diary') {
    await kept(db, userId, 'matcha', 620, today);
    const yesterday = addDays(today, -1);
    const older = addDays(today, -2);
    const first = await saveDiaryEntry(db, {
      userId,
      entryDate: dayKey(yesterday),
      promptId: 'wallet_feeling',
      mood: 'proud',
      body: 'kept the matcha money and still had a cute day',
    });
    const second = await saveDiaryEntry(db, {
      userId,
      entryDate: dayKey(older),
      promptId: 'loved_free',
      mood: 'chill',
      body: 'sat by the window and that was the whole treat',
    });
    awardStar(db, userId, 'diary', yesterday);
    awardStar(db, userId, 'diary', older);
    awardSticker(db, userId, 'common-lil-cloud', 'diary', first.id);
    awardSticker(db, userId, 'common-gold-star', 'diary', second.id);
    await replacePageStickers(db, userId, first.id, [
      { stickerId: 'common-lil-cloud', x: 0.22, y: 0.3, scale: 1, rotation: -8, z: 0 },
      { stickerId: 'mood-proud', x: 0.68, y: 0.62, scale: 0.9, rotation: 6, z: 1 },
    ]);
    await replacePageStickers(db, userId, second.id, [
      { stickerId: 'common-gold-star', x: 0.5, y: 0.4, scale: 1.1, rotation: 0, z: 0 },
    ]);
    return;
  }

  if (scenario === 'goal_progress') {
    await createGoal(db, userId, 'new headphones', 8000);
    await kept(db, userId, 'skipped the cart', 3200, new Date());
    return;
  }

  if (scenario === 'goal_reached') {
    await createGoal(db, userId, 'a tiny fund', 2000);
    await kept(db, userId, 'weekend snacks', 2500, new Date());
    await checkGoalReached(db, userId);
    return;
  }

  if (scenario === 'milestones_ready') {
    recordMilestones(db, userId, ['first_nvm']);
    markMilestoneSeen(db, userId, 'first_nvm');
    for (let i = 0; i < 48; i += 1) {
      await kept(db, userId, 'a tiny nvm', 1, addDays(today, -(i + 1)));
    }
    await kept(db, userId, 'almost a hundred', 9951, addDays(today, -1));
    for (let i = 0; i < 9; i += 1) {
      await saveDiaryEntry(db, {
        userId,
        entryDate: dayKey(addDays(today, -(i + 1))),
        promptId: 'money_win',
        mood: 'chill',
        body: 'a line for the diary',
      });
    }
    return;
  }

  if (scenario === 'palettes_mixed') {
    await kept(db, userId, 'matcha', 620, today);
    const stamp = new Date().toISOString();
    runTransaction(db, (tx) => {
      for (const unlockId of ['palette:peachsoda', 'palette:midnight']) {
        tx.insert(unlocks)
          .values({
            userId,
            unlockId,
            unlockedAt: stamp,
            updatedAt: stamp,
            dirty: true,
          })
          .run();
      }
    });
  }
}
