import { and, eq, isNull } from 'drizzle-orm';

import { goals, type Goal } from '@/db/schema';
import { runTransaction, type ItemsDb } from '@/db/transaction';
import { goalProgressCents } from '@/features/items/repository';
import { createId } from '@/lib/uuid';

export type { Goal };

function nowIso(): string {
  return new Date().toISOString();
}

export async function getActiveGoal(db: ItemsDb, userId: string): Promise<Goal | null> {
  return (
    db
      .select()
      .from(goals)
      .where(and(eq(goals.userId, userId), isNull(goals.archivedAt), isNull(goals.deletedAt)))
      .get() ?? null
  );
}

export async function createGoal(
  db: ItemsDb,
  userId: string,
  name: string,
  targetCents: number,
): Promise<Goal> {
  const id = createId();
  const now = nowIso();
  let row: Goal | undefined;
  runTransaction(db, (tx) => {
    // Archive any existing active goal (one at a time).
    tx.update(goals)
      .set({ archivedAt: now, updatedAt: now, dirty: true })
      .where(and(eq(goals.userId, userId), isNull(goals.archivedAt), isNull(goals.deletedAt)))
      .run();

    row = tx
      .insert(goals)
      .values({
        id,
        userId,
        name: name.trim(),
        targetCents,
        startedAt: now,
        createdAt: now,
        updatedAt: now,
        dirty: true,
      })
      .returning()
      .get();
  });
  if (!row) throw new Error('goal create failed');
  return row;
}

export async function updateGoalTarget(
  db: ItemsDb,
  userId: string,
  id: string,
  targetCents: number,
): Promise<Goal> {
  const now = nowIso();
  let row: Goal | undefined;
  runTransaction(db, (tx) => {
    row = tx
      .update(goals)
      .set({ targetCents, updatedAt: now, dirty: true })
      .where(and(eq(goals.id, id), eq(goals.userId, userId), isNull(goals.deletedAt)))
      .returning()
      .get();
  });
  if (!row) throw new Error('goal not found');
  return row;
}

export async function archiveGoal(db: ItemsDb, userId: string, id: string): Promise<void> {
  const now = nowIso();
  runTransaction(db, (tx) => {
    tx.update(goals)
      .set({ archivedAt: now, updatedAt: now, dirty: true })
      .where(and(eq(goals.id, id), eq(goals.userId, userId)))
      .run();
  });
}

export async function markGoalReached(db: ItemsDb, userId: string, id: string): Promise<Goal> {
  const now = nowIso();
  let row: Goal | undefined;
  runTransaction(db, (tx) => {
    row = tx
      .update(goals)
      .set({ reachedAt: now, updatedAt: now, dirty: true })
      .where(and(eq(goals.id, id), eq(goals.userId, userId), isNull(goals.reachedAt)))
      .returning()
      .get();
  });
  if (!row) {
    const existing = await getActiveGoal(db, userId);
    if (existing?.id === id) return existing;
    throw new Error('goal not found');
  }
  return row;
}

/** Clear reachedAt so the same goal keeps counting past 100%. */
export async function keepCountingGoal(db: ItemsDb, userId: string, id: string): Promise<Goal> {
  const now = nowIso();
  let row: Goal | undefined;
  runTransaction(db, (tx) => {
    row = tx
      .update(goals)
      .set({ reachedAt: null, updatedAt: now, dirty: true })
      .where(and(eq(goals.id, id), eq(goals.userId, userId)))
      .returning()
      .get();
  });
  if (!row) throw new Error('goal not found');
  return row;
}

export async function progressForGoal(db: ItemsDb, userId: string, goal: Goal): Promise<number> {
  return goalProgressCents(db, userId, new Date(goal.startedAt));
}

/** If active goal crossed its target, set reachedAt. */
export async function checkGoalReached(db: ItemsDb, userId: string): Promise<boolean> {
  const goal = await getActiveGoal(db, userId);
  if (!goal || goal.reachedAt) return false;
  const progress = await progressForGoal(db, userId, goal);
  if (progress < goal.targetCents) return false;
  await markGoalReached(db, userId, goal.id);
  return true;
}
