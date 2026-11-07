import { createTestDatabase } from '@/db/testClient';
import {
  checkGoalReached,
  createGoal,
  getActiveGoal,
  progressForGoal,
  updateGoalTarget,
} from '@/features/goals/repository';
import { createItem, markBoughtAfterAll } from '@/features/items/repository';
import { LOCAL_USER_ID } from '@/lib/localUser';

const userId = LOCAL_USER_ID;

function justAfter(iso: string): Date {
  // Within [startedAt, now] so goalProgressCents range includes the item.
  return new Date(new Date(iso).getTime() + 1);
}

describe('goals repository', () => {
  it('counts bought-after-all toward progress', async () => {
    const db = createTestDatabase();
    const goal = await createGoal(db, userId, 'concert tickets', 50_000);
    const item = await createItem(db, {
      userId,
      kind: 'kept',
      name: 'nvm',
      amountCents: 12_000,
      happenedAt: justAfter(goal.startedAt),
    });

    expect(await progressForGoal(db, userId, goal)).toBe(12_000);
    await markBoughtAfterAll(db, userId, item.id);
    expect(await progressForGoal(db, userId, goal)).toBe(12_000);
  });

  it('editing target up does not reset progress', async () => {
    const db = createTestDatabase();
    const goal = await createGoal(db, userId, 'trip', 20_000);
    await createItem(db, {
      userId,
      kind: 'kept',
      name: 'snack',
      amountCents: 5_000,
      happenedAt: justAfter(goal.startedAt),
    });
    const updated = await updateGoalTarget(db, userId, goal.id, 40_000);
    expect(updated.targetCents).toBe(40_000);
    expect(await progressForGoal(db, userId, updated)).toBe(5_000);
  });

  it('sets reachedAt when progress crosses target', async () => {
    const db = createTestDatabase();
    const goal = await createGoal(db, userId, 'phone', 10_000);
    await createItem(db, {
      userId,
      kind: 'kept',
      name: 'big',
      amountCents: 10_000,
      happenedAt: justAfter(goal.startedAt),
    });
    expect(await checkGoalReached(db, userId)).toBe(true);
    const active = await getActiveGoal(db, userId);
    expect(active?.reachedAt).toBeTruthy();
  });
});
