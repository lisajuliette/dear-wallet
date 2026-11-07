import { and, asc, eq, gte, isNull, lte, sql } from 'drizzle-orm';

import { enqueueOutbox } from '@/db/outbox';
import { items, type Item, type NewItem } from '@/db/schema';
import { runTransaction, type ItemsDb } from '@/db/transaction';
import { dayRange, monthRange, rangeIsoBounds, weekRange } from '@/lib/dates';
import { createId } from '@/lib/uuid';

export type { ItemsDb, Item };

export type ItemKind = 'kept' | 'loved';
export type ItemTag = 'savings' | 'debt';

export type CreateItemInput = {
  userId: string;
  kind: ItemKind;
  name: string;
  amountCents?: number | null;
  currency?: string;
  category?: string | null;
  note?: string | null;
  tag?: ItemTag | null;
  happenedAt?: Date;
};

export type UpdateItemInput = Partial<{
  name: string;
  amountCents: number | null;
  category: string | null;
  note: string | null;
  photoPath: string | null;
  tag: ItemTag | null;
  happenedAt: Date;
}>;

function nowIso(): string {
  return new Date().toISOString();
}

function assertKeptAmount(kind: ItemKind, amountCents: number | null | undefined) {
  if (kind === 'kept' && (amountCents === null || amountCents === undefined)) {
    throw new Error('kept items need an amount');
  }
}

export async function createItem(db: ItemsDb, input: CreateItemInput): Promise<Item> {
  assertKeptAmount(input.kind, input.amountCents);
  const id = createId();
  const happenedAt = (input.happenedAt ?? new Date()).toISOString();
  const updatedAt = nowIso();

  const row: NewItem = {
    id,
    userId: input.userId,
    kind: input.kind,
    name: input.name,
    amountCents: input.amountCents ?? null,
    currency: input.currency ?? 'USD',
    category: input.category ?? null,
    note: input.note ?? null,
    tag: input.tag ?? null,
    happenedAt,
    createdAt: updatedAt,
    updatedAt,
    dirty: true,
  };

  let created: Item | undefined;
  runTransaction(db, (tx) => {
    created = tx.insert(items).values(row).returning().get();
    enqueueOutbox(tx, 'items', id);
  });
  if (!created) throw new Error('item insert failed');
  return created;
}

export async function updateItem(
  db: ItemsDb,
  userId: string,
  id: string,
  patch: UpdateItemInput,
): Promise<Item> {
  const existing = await getItem(db, userId, id);
  if (!existing) throw new Error('item not found');

  const nextAmount = patch.amountCents !== undefined ? patch.amountCents : existing.amountCents;
  assertKeptAmount(existing.kind, nextAmount);

  const updatedAt = nowIso();
  let updated: Item | undefined;
  runTransaction(db, (tx) => {
    updated = tx
      .update(items)
      .set({
        name: patch.name ?? existing.name,
        amountCents: nextAmount,
        category: patch.category !== undefined ? patch.category : existing.category,
        note: patch.note !== undefined ? patch.note : existing.note,
        photoPath: patch.photoPath !== undefined ? patch.photoPath : existing.photoPath,
        tag: patch.tag !== undefined ? patch.tag : existing.tag,
        happenedAt: patch.happenedAt ? patch.happenedAt.toISOString() : existing.happenedAt,
        updatedAt,
        dirty: true,
      })
      .where(and(eq(items.id, id), eq(items.userId, userId)))
      .returning()
      .get();
    enqueueOutbox(tx, 'items', id);
  });
  if (!updated) throw new Error('item update failed');
  return updated;
}

export async function softDelete(db: ItemsDb, userId: string, id: string): Promise<Item> {
  const updatedAt = nowIso();
  let row: Item | undefined;
  runTransaction(db, (tx) => {
    row = tx
      .update(items)
      .set({ deletedAt: updatedAt, updatedAt, dirty: true })
      .where(and(eq(items.id, id), eq(items.userId, userId), isNull(items.deletedAt)))
      .returning()
      .get();
    enqueueOutbox(tx, 'items', id);
  });
  if (!row) throw new Error('item not found');
  return row;
}

export async function markBoughtAfterAll(db: ItemsDb, userId: string, id: string): Promise<Item> {
  const updatedAt = nowIso();
  let row: Item | undefined;
  runTransaction(db, (tx) => {
    row = tx
      .update(items)
      .set({ boughtAfterAllAt: updatedAt, updatedAt, dirty: true })
      .where(and(eq(items.id, id), eq(items.userId, userId), isNull(items.deletedAt)))
      .returning()
      .get();
    enqueueOutbox(tx, 'items', id);
  });
  if (!row) throw new Error('item not found');
  return row;
}

export async function undoBoughtAfterAll(db: ItemsDb, userId: string, id: string): Promise<Item> {
  const updatedAt = nowIso();
  let row: Item | undefined;
  runTransaction(db, (tx) => {
    row = tx
      .update(items)
      .set({ boughtAfterAllAt: null, updatedAt, dirty: true })
      .where(and(eq(items.id, id), eq(items.userId, userId), isNull(items.deletedAt)))
      .returning()
      .get();
    enqueueOutbox(tx, 'items', id);
  });
  if (!row) throw new Error('item not found');
  return row;
}

export async function getItem(
  db: ItemsDb,
  userId: string,
  id: string,
  opts?: { includeDeleted?: boolean },
): Promise<Item | null> {
  const row = db
    .select()
    .from(items)
    .where(
      and(
        eq(items.id, id),
        eq(items.userId, userId),
        opts?.includeDeleted ? undefined : isNull(items.deletedAt),
      ),
    )
    .get();
  return row ?? null;
}

type ListRange = 'day' | 'week' | 'month';

function boundsFor(range: ListRange, at: Date) {
  if (range === 'day') return rangeIsoBounds(dayRange(at));
  if (range === 'week') return rangeIsoBounds(weekRange(at));
  return rangeIsoBounds(monthRange(at));
}

export async function listByRange(
  db: ItemsDb,
  userId: string,
  range: ListRange,
  at: Date = new Date(),
): Promise<Item[]> {
  const { startIso, endIso } = boundsFor(range, at);
  return db
    .select()
    .from(items)
    .where(
      and(
        eq(items.userId, userId),
        isNull(items.deletedAt),
        gte(items.happenedAt, startIso),
        lte(items.happenedAt, endIso),
      ),
    )
    .orderBy(asc(items.happenedAt))
    .all();
}

export const listByDay = (db: ItemsDb, userId: string, at?: Date) =>
  listByRange(db, userId, 'day', at);
export const listByWeek = (db: ItemsDb, userId: string, at?: Date) =>
  listByRange(db, userId, 'week', at);
export const listByMonth = (db: ItemsDb, userId: string, at?: Date) =>
  listByRange(db, userId, 'month', at);

/** Loved items in the calendar month of `at`, newest first for the grid. */
export async function listLovedByMonth(
  db: ItemsDb,
  userId: string,
  at: Date = new Date(),
): Promise<Item[]> {
  const rows = await listByMonth(db, userId, at);
  return rows
    .filter((row) => row.kind === 'loved')
    .sort((a, b) => b.happenedAt.localeCompare(a.happenedAt));
}

/** Kept items in range for the tally list (includes bought-after-all). */
export async function listKeptByRange(
  db: ItemsDb,
  userId: string,
  range: ListRange,
  at: Date = new Date(),
): Promise<Item[]> {
  const rows = await listByRange(db, userId, range, at);
  return rows.filter((row) => row.kind === 'kept').reverse();
}

/** Kept total: kind=kept, not bought-after-all, not deleted, happened_at in range. */
export async function keptTotalCents(
  db: ItemsDb,
  userId: string,
  range?: { start: Date; end: Date } | null,
  tag?: ItemTag,
): Promise<number> {
  const conditions = [
    eq(items.userId, userId),
    eq(items.kind, 'kept'),
    isNull(items.deletedAt),
    isNull(items.boughtAfterAllAt),
  ];

  if (range) {
    const { startIso, endIso } = rangeIsoBounds(range);
    conditions.push(gte(items.happenedAt, startIso), lte(items.happenedAt, endIso));
  }
  if (tag) {
    conditions.push(eq(items.tag, tag));
  }

  const row = db
    .select({
      total: sql<number>`coalesce(sum(${items.amountCents}), 0)`,
    })
    .from(items)
    .where(and(...conditions))
    .get();

  return Number(row?.total ?? 0);
}

/**
 * Goal progress: kept amounts since start, not deleted.
 * Includes bought-after-all so progress never drops on that path (COPY.md).
 */
export async function goalProgressCents(
  db: ItemsDb,
  userId: string,
  startedAt: Date,
  at: Date = new Date(),
): Promise<number> {
  const { startIso, endIso } = rangeIsoBounds({ start: startedAt, end: at });
  const row = db
    .select({
      total: sql<number>`coalesce(sum(${items.amountCents}), 0)`,
    })
    .from(items)
    .where(
      and(
        eq(items.userId, userId),
        eq(items.kind, 'kept'),
        isNull(items.deletedAt),
        gte(items.happenedAt, startIso),
        lte(items.happenedAt, endIso),
      ),
    )
    .get();

  return Number(row?.total ?? 0);
}

/** Count of kept logs (not deleted). Bought-after-all still counts toward log milestones. */
export async function keptLogCount(db: ItemsDb, userId: string): Promise<number> {
  const row = db
    .select({ n: sql<number>`count(*)` })
    .from(items)
    .where(and(eq(items.userId, userId), eq(items.kind, 'kept'), isNull(items.deletedAt)))
    .get();
  return Number(row?.n ?? 0);
}
