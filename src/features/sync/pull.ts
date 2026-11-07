import { eq } from 'drizzle-orm';

import { items } from '@/db/schema';
import type { ItemsDb } from '@/db/transaction';
import { remoteIsNewer } from '@/features/sync/merge';
import { supabase, supabaseConfigured } from '@/features/sync/supabase';
import { getLocalUserId } from '@/lib/localUser';

export type PullCursor = {
  items?: string;
};

function snakeToCamel(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    const camel = k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
    out[camel] = v;
  }
  return out;
}

/**
 * Pull remote items newer than cursor and merge LWW without enqueueing outbox.
 * Returns the new cursor timestamp.
 */
export async function pullItems(
  db: ItemsDb,
  cursor: string | null,
  deps: {
    fetchSince?: (since: string | null) => Promise<Record<string, unknown>[]>;
  } = {},
): Promise<string | null> {
  if (!supabaseConfigured && !deps.fetchSince) return cursor;

  const userId = getLocalUserId();
  const remoteRows =
    deps.fetchSince != null
      ? await deps.fetchSince(cursor)
      : await (async () => {
          let q = supabase.from('items').select('*').eq('user_id', userId);
          if (cursor) q = q.gt('updated_at', cursor);
          const { data, error } = await q;
          if (error) throw error;
          return (data ?? []) as Record<string, unknown>[];
        })();

  let newest = cursor;
  for (const raw of remoteRows) {
    const remote = snakeToCamel(raw);
    const id = String(remote.id);
    const remoteUpdated = String(remote.updatedAt ?? '');
    if (newest == null || remoteUpdated > newest) newest = remoteUpdated;

    const existing = await db.select().from(items).where(eq(items.id, id)).limit(1);
    const local = existing[0];
    if (local && !remoteIsNewer(local.updatedAt, remoteUpdated)) {
      continue;
    }

    const values = {
      id,
      userId: String(remote.userId ?? userId),
      kind: (remote.kind as 'kept' | 'loved') ?? 'kept',
      name: String(remote.name ?? ''),
      amountCents: (remote.amountCents as number | null) ?? null,
      currency: String(remote.currency ?? 'USD'),
      category: (remote.category as string | null) ?? null,
      note: (remote.note as string | null) ?? null,
      photoPath: (remote.photoPath as string | null) ?? null,
      tag: (remote.tag as 'savings' | 'debt' | null) ?? null,
      boughtAfterAllAt: (remote.boughtAfterAllAt as string | null) ?? null,
      happenedAt: String(remote.happenedAt ?? new Date().toISOString()),
      createdAt: String(remote.createdAt ?? new Date().toISOString()),
      updatedAt: remoteUpdated || new Date().toISOString(),
      deletedAt: (remote.deletedAt as string | null) ?? null,
      dirty: false,
      syncedAt: new Date().toISOString(),
    };

    if (local) {
      await db.update(items).set(values).where(eq(items.id, id));
    } else {
      await db.insert(items).values(values);
    }
  }

  return newest;
}
