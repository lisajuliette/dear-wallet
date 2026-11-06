import { and, count, eq } from 'drizzle-orm';

import { stars } from '@/db/schema';
import { runTransaction, type ItemsDb } from '@/db/transaction';
import { dayKey } from '@/lib/dates';

export type StarSource = 'log' | 'diary' | 'decorate' | 'quest';

export async function listStarDays(db: ItemsDb, userId: string): Promise<string[]> {
  const rows = db.select({ day: stars.day }).from(stars).where(eq(stars.userId, userId)).all();
  return rows.map((r) => r.day);
}

export async function countStars(db: ItemsDb, userId: string): Promise<number> {
  const row = db.select({ n: count() }).from(stars).where(eq(stars.userId, userId)).get();
  return Number(row?.n ?? 0);
}

/** Upsert one star for the local day. Returns true if this action earned a new star. */
export function awardStar(
  db: ItemsDb,
  userId: string,
  earnedBy: StarSource,
  at: Date = new Date(),
): boolean {
  const day = dayKey(at);
  const existing = db
    .select()
    .from(stars)
    .where(and(eq(stars.userId, userId), eq(stars.day, day)))
    .get();

  if (existing) return false;

  const now = at.toISOString();
  runTransaction(db, (tx) => {
    tx.insert(stars)
      .values({
        userId,
        day,
        earnedBy,
        createdAt: now,
        updatedAt: now,
        dirty: true,
      })
      .run();
  });
  return true;
}
