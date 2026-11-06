import { eq } from 'drizzle-orm';

import { outbox } from '@/db/schema';
import { createTestDatabase } from '@/db/testClient';
import {
  createItem,
  keptTotalCents,
  listByDay,
  listByMonth,
  listByWeek,
  markBoughtAfterAll,
  softDelete,
  undoBoughtAfterAll,
  updateItem,
} from '@/features/items/repository';
import { dayRange, monthRange, weekRange } from '@/lib/dates';
import { LOCAL_USER_ID } from '@/lib/localUser';

const userId = LOCAL_USER_ID;

describe('items repository', () => {
  let db: ReturnType<typeof createTestDatabase>;

  beforeEach(() => {
    db = createTestDatabase();
  });

  async function seedKept(
    name: string,
    cents: number,
    happenedAt: Date,
    extras?: { tag?: 'savings' | 'debt' },
  ) {
    return createItem(db, {
      userId,
      kind: 'kept',
      name,
      amountCents: cents,
      happenedAt,
      tag: extras?.tag,
    });
  }

  it('creates a kept item and outbox row in one transaction', async () => {
    const item = await seedKept('matcha', 620, new Date(2026, 10, 6, 12));
    expect(item.dirty).toBe(true);
    expect(item.amountCents).toBe(620);

    const box = db.select().from(outbox).where(eq(outbox.rowId, item.id)).all();
    expect(box).toHaveLength(1);
    expect(box[0]?.tableName).toBe('items');
  });

  it('rejects kept items without an amount', async () => {
    await expect(createItem(db, { userId, kind: 'kept', name: 'oops' })).rejects.toThrow(/amount/);
  });

  it('allows loved items without a price', async () => {
    const loved = await createItem(db, {
      userId,
      kind: 'loved',
      name: 'thrift coat',
      happenedAt: new Date(2026, 10, 6, 13),
    });
    expect(loved.amountCents).toBeNull();
  });

  it('sums kept totals and ignores loved items', async () => {
    const day = new Date(2026, 10, 6, 10);
    await seedKept('a', 1000, day);
    await seedKept('b', 500, day);
    await createItem(db, {
      userId,
      kind: 'loved',
      name: 'loved',
      amountCents: 9999,
      happenedAt: day,
    });

    const total = await keptTotalCents(db, userId, dayRange(day));
    expect(total).toBe(1500);
  });

  it('removes bought-after-all from totals and restores on undo', async () => {
    const day = new Date(2026, 10, 6, 11);
    const item = await seedKept('sneaker', 8000, day);
    expect(await keptTotalCents(db, userId, dayRange(day))).toBe(8000);

    await markBoughtAfterAll(db, userId, item.id);
    expect(await keptTotalCents(db, userId, dayRange(day))).toBe(0);

    await undoBoughtAfterAll(db, userId, item.id);
    expect(await keptTotalCents(db, userId, dayRange(day))).toBe(8000);
  });

  it('excludes soft-deleted items from lists and totals', async () => {
    const day = new Date(2026, 10, 6, 14);
    const item = await seedKept('gone', 300, day);
    await softDelete(db, userId, item.id);

    expect(await listByDay(db, userId, day)).toHaveLength(0);
    expect(await keptTotalCents(db, userId, dayRange(day))).toBe(0);
  });

  it('lists by week (Mon–Sun) and month bounds', async () => {
    await seedKept('mon', 100, new Date(2026, 10, 2, 9));
    await seedKept('sun', 200, new Date(2026, 10, 8, 9));
    await seedKept('next-mon', 400, new Date(2026, 10, 9, 9));
    await seedKept('oct', 50, new Date(2026, 9, 31, 9));

    const weekItems = await listByWeek(db, userId, new Date(2026, 10, 6));
    expect(weekItems.map((i) => i.name).sort()).toEqual(['mon', 'sun']);

    const monthItems = await listByMonth(db, userId, new Date(2026, 10, 15));
    expect(monthItems.map((i) => i.name).sort()).toEqual(['mon', 'next-mon', 'sun']);

    expect(await keptTotalCents(db, userId, weekRange(new Date(2026, 10, 6)))).toBe(300);
    expect(await keptTotalCents(db, userId, monthRange(new Date(2026, 10, 6)))).toBe(700);
  });

  it('tracks side totals for savings and debt tags', async () => {
    const day = new Date(2026, 10, 6, 16);
    await seedKept('save', 2000, day, { tag: 'savings' });
    await seedKept('owe', 1500, day, { tag: 'debt' });
    await seedKept('plain', 100, day);

    expect(await keptTotalCents(db, userId, dayRange(day), 'savings')).toBe(2000);
    expect(await keptTotalCents(db, userId, dayRange(day), 'debt')).toBe(1500);
    expect(await keptTotalCents(db, userId, dayRange(day))).toBe(3600);
  });

  it('updates fields and re-enqueues the outbox', async () => {
    const item = await seedKept('before', 100, new Date(2026, 10, 6, 17));
    const beforeCount = db.select().from(outbox).all().length;

    const updated = await updateItem(db, userId, item.id, { name: 'after', amountCents: 250 });
    expect(updated.name).toBe('after');
    expect(updated.amountCents).toBe(250);

    const afterCount = db.select().from(outbox).all().length;
    expect(afterCount).toBe(beforeCount + 1);
  });
});
