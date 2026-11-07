import { eq } from 'drizzle-orm';

import { enqueueOutbox } from '@/db/outbox';
import { profiles } from '@/db/schema';
import { runTransaction, type ItemsDb } from '@/db/transaction';
import { ensureProfile } from '@/features/settings/repository';
import { getLocalUserId } from '@/lib/localUser';

export async function isOnboarded(
  db: ItemsDb,
  userId: string = getLocalUserId(),
): Promise<boolean> {
  await ensureProfile(db, userId);
  const rows = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
  return Boolean(rows[0]?.onboardedAt);
}

/** Mark onboarding finished (skip or complete). Idempotent. */
export async function markOnboarded(db: ItemsDb, userId: string = getLocalUserId()): Promise<void> {
  await ensureProfile(db, userId);
  const rows = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
  if (rows[0]?.onboardedAt) return;

  const now = new Date().toISOString();
  runTransaction(db, (tx) => {
    tx.update(profiles)
      .set({ onboardedAt: now, updatedAt: now, dirty: true })
      .where(eq(profiles.id, userId))
      .run();
    enqueueOutbox(tx, 'profiles', userId);
  });
}
