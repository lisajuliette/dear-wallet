import { and, count, eq, isNull, ne, sql } from 'drizzle-orm';

import { diaryEntries, milestones, unlocks } from '@/db/schema';
import { runTransaction, type ItemsDb } from '@/db/transaction';
import { keptLogCount, keptTotalCents } from '@/features/items/repository';
import {
  evaluateMilestones,
  unlockForMilestone,
  type MilestoneId,
  type MilestoneStats,
} from '@/features/rewards/milestonesCatalog';

export async function listAchievedMilestoneIds(db: ItemsDb, userId: string): Promise<string[]> {
  const rows = db
    .select({ id: milestones.milestoneId })
    .from(milestones)
    .where(eq(milestones.userId, userId))
    .all();
  return rows.map((r) => r.id);
}

export async function listUnlockIds(db: ItemsDb, userId: string): Promise<string[]> {
  const rows = db
    .select({ id: unlocks.unlockId })
    .from(unlocks)
    .where(eq(unlocks.userId, userId))
    .all();
  return rows.map((r) => r.id);
}

export async function countDiaryTextEntries(db: ItemsDb, userId: string): Promise<number> {
  const row = db
    .select({ n: count() })
    .from(diaryEntries)
    .where(
      and(
        eq(diaryEntries.userId, userId),
        isNull(diaryEntries.deletedAt),
        ne(diaryEntries.body, ''),
        sql`length(trim(${diaryEntries.body})) > 0`,
      ),
    )
    .get();
  return Number(row?.n ?? 0);
}

export async function loadMilestoneStats(db: ItemsDb, userId: string): Promise<MilestoneStats> {
  const [keptTotal, logs, diaryTextCount] = await Promise.all([
    keptTotalCents(db, userId, null),
    keptLogCount(db, userId),
    countDiaryTextEntries(db, userId),
  ]);
  return { keptTotalCents: keptTotal, keptLogCount: logs, diaryTextCount };
}

export function recordMilestones(db: ItemsDb, userId: string, ids: MilestoneId[]): void {
  if (ids.length === 0) return;
  const now = new Date().toISOString();
  runTransaction(db, (tx) => {
    for (const milestoneId of ids) {
      tx.insert(milestones)
        .values({
          userId,
          milestoneId,
          achievedAt: now,
          updatedAt: now,
          dirty: true,
        })
        .onConflictDoNothing()
        .run();

      const unlockId = unlockForMilestone(milestoneId);
      if (unlockId) {
        tx.insert(unlocks)
          .values({
            userId,
            unlockId,
            unlockedAt: now,
            updatedAt: now,
            dirty: true,
          })
          .onConflictDoNothing()
          .run();
      }
    }
  });
}

export function markMilestoneSeen(db: ItemsDb, userId: string, milestoneId: string): void {
  const now = new Date().toISOString();
  runTransaction(db, (tx) => {
    tx.update(milestones)
      .set({ seenAt: now, updatedAt: now, dirty: true })
      .where(and(eq(milestones.userId, userId), eq(milestones.milestoneId, milestoneId)))
      .run();
  });
}

/** Evaluate current stats, persist new milestones/unlocks, return newly achieved ids. */
export async function applyMilestones(db: ItemsDb, userId: string): Promise<MilestoneId[]> {
  const [stats, achieved] = await Promise.all([
    loadMilestoneStats(db, userId),
    listAchievedMilestoneIds(db, userId),
  ]);
  const newly = evaluateMilestones(stats, achieved);
  recordMilestones(db, userId, newly);
  return newly;
}
