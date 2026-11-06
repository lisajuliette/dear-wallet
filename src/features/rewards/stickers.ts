import type { StickerId } from '@/components/stickerAssets';
import { stickerAwards } from '@/db/schema';
import { runTransaction, type ItemsDb } from '@/db/transaction';
import { createId } from '@/lib/uuid';

export function awardSticker(
  db: ItemsDb,
  userId: string,
  stickerId: StickerId,
  source: 'log' | 'diary',
  sourceId?: string,
): string {
  const id = createId();
  const now = new Date().toISOString();
  runTransaction(db, (tx) => {
    tx.insert(stickerAwards)
      .values({
        id,
        userId,
        stickerId,
        source,
        sourceId: sourceId ?? null,
        awardedAt: now,
        updatedAt: now,
        dirty: true,
      })
      .run();
  });
  return id;
}
