import { asc, eq } from 'drizzle-orm';

import {
  diaryEntries,
  goals,
  items,
  outbox,
  pageStickers,
  profiles,
  stickerAwards,
} from '@/db/schema';
import type { ItemsDb } from '@/db/transaction';
import { supabase, supabaseConfigured } from '@/features/sync/supabase';

export type OutboxRow = {
  id: number;
  tableName: string;
  rowId: string;
};

/** Pure: order outbox rows by id ascending (FIFO). */
export function orderOutbox(rows: OutboxRow[]): OutboxRow[] {
  return [...rows].sort((a, b) => a.id - b.id);
}

/** Exponential backoff delay in ms for attempt 0..n. */
export function retryDelayMs(attempt: number): number {
  return Math.min(30_000, 500 * 2 ** attempt);
}

function camelToSnake(key: string): string {
  return key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
}

function rowToRemote(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    if (k === 'dirty' || k === 'syncedAt') continue;
    out[camelToSnake(k)] = v;
  }
  return out;
}

async function fetchLocalPayload(
  db: ItemsDb,
  tableName: string,
  rowId: string,
): Promise<Record<string, unknown> | null> {
  switch (tableName) {
    case 'items': {
      const row = await db.select().from(items).where(eq(items.id, rowId)).limit(1);
      return row[0] ? rowToRemote(row[0] as unknown as Record<string, unknown>) : null;
    }
    case 'diary_entries': {
      const row = await db.select().from(diaryEntries).where(eq(diaryEntries.id, rowId)).limit(1);
      return row[0] ? rowToRemote(row[0] as unknown as Record<string, unknown>) : null;
    }
    case 'page_stickers': {
      const row = await db.select().from(pageStickers).where(eq(pageStickers.id, rowId)).limit(1);
      return row[0] ? rowToRemote(row[0] as unknown as Record<string, unknown>) : null;
    }
    case 'profiles': {
      const row = await db.select().from(profiles).where(eq(profiles.id, rowId)).limit(1);
      return row[0] ? rowToRemote(row[0] as unknown as Record<string, unknown>) : null;
    }
    case 'goals': {
      const row = await db.select().from(goals).where(eq(goals.id, rowId)).limit(1);
      return row[0] ? rowToRemote(row[0] as unknown as Record<string, unknown>) : null;
    }
    case 'sticker_awards': {
      const row = await db.select().from(stickerAwards).where(eq(stickerAwards.id, rowId)).limit(1);
      return row[0] ? rowToRemote(row[0] as unknown as Record<string, unknown>) : null;
    }
    default:
      return null;
  }
}

export type PushDeps = {
  upsert?: (table: string, payload: Record<string, unknown>) => Promise<{ error: Error | null }>;
  maxAttempts?: number;
  sleep?: (ms: number) => Promise<void>;
};

/** Push outbox FIFO with retry/backoff. Clears entries on success. */
export async function pushOutbox(
  db: ItemsDb,
  deps: PushDeps = {},
): Promise<{ pushed: number; failed: number }> {
  if (!supabaseConfigured && !deps.upsert) {
    return { pushed: 0, failed: 0 };
  }

  const pending = await db.select().from(outbox).orderBy(asc(outbox.id));
  const ordered = orderOutbox(
    pending.map((r) => ({ id: r.id, tableName: r.tableName, rowId: r.rowId })),
  );

  const sleep = deps.sleep ?? ((ms: number) => new Promise((r) => setTimeout(r, ms)));
  const upsert =
    deps.upsert ??
    (async (table, payload) => {
      const { error } = await supabase.from(table as 'items').upsert(payload as never);
      return { error: error ? new Error(error.message) : null };
    });

  let pushed = 0;
  let failed = 0;
  const maxAttempts = deps.maxAttempts ?? 4;

  for (const entry of ordered) {
    const payload = await fetchLocalPayload(db, entry.tableName, entry.rowId);
    if (!payload) {
      await db.delete(outbox).where(eq(outbox.id, entry.id));
      continue;
    }

    let ok = false;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const result = await upsert(entry.tableName, payload);
      if (!result.error) {
        ok = true;
        break;
      }
      if (attempt < maxAttempts - 1) {
        await sleep(retryDelayMs(attempt));
      }
    }

    if (ok) {
      await db.delete(outbox).where(eq(outbox.id, entry.id));
      pushed += 1;
    } else {
      failed += 1;
      break;
    }
  }

  return { pushed, failed };
}
