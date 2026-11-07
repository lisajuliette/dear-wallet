import { createTestDatabase } from '@/db/testClient';
import { createItem, markBoughtAfterAll, softDelete } from '@/features/items/repository';
import {
  applyMilestones,
  listAchievedMilestoneIds,
  listUnlockIds,
} from '@/features/rewards/milestones';
import { LOCAL_USER_ID } from '@/lib/localUser';

const userId = LOCAL_USER_ID;

describe('applyMilestones persistence', () => {
  it('keeps kept_100 after bought-after-all or delete drops the total', async () => {
    const db = createTestDatabase();
    const item = await createItem(db, {
      userId,
      kind: 'kept',
      name: 'bag',
      amountCents: 10_000,
    });

    const first = await applyMilestones(db, userId);
    expect(first).toEqual(expect.arrayContaining(['first_nvm', 'kept_100']));
    expect(await listAchievedMilestoneIds(db, userId)).toEqual(
      expect.arrayContaining(['first_nvm', 'kept_100']),
    );

    await markBoughtAfterAll(db, userId, item.id);
    const again = await applyMilestones(db, userId);
    expect(again).toEqual([]);
    expect(await listAchievedMilestoneIds(db, userId)).toEqual(
      expect.arrayContaining(['kept_100']),
    );

    await softDelete(db, userId, item.id);
    expect(await listAchievedMilestoneIds(db, userId)).toEqual(
      expect.arrayContaining(['kept_100']),
    );
  });

  it('unlocks Midnight CD at $1,000 kept', async () => {
    const db = createTestDatabase();
    await createItem(db, {
      userId,
      kind: 'kept',
      name: 'phone money',
      amountCents: 100_000,
    });

    const ids = await applyMilestones(db, userId);
    expect(ids).toContain('kept_1000');
    expect(await listUnlockIds(db, userId)).toContain('palette:midnight');
  });
});
