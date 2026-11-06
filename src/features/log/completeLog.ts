import type { StickerId } from '@/components/stickerAssets';
import { db } from '@/db/client';
import { createItem, keptTotalCents } from '@/features/items/repository';
import type { QuickLogSavePayload } from '@/features/log/QuickLogForm';
import { rollSticker } from '@/features/rewards/engine';
import { usePityStore } from '@/features/rewards/pityStore';
import { awardStar, countStars } from '@/features/rewards/stars';
import { awardSticker } from '@/features/rewards/stickers';
import { monthRange } from '@/lib/dates';
import { LOCAL_USER_ID } from '@/lib/localUser';

export type LogRewardResult = {
  itemId: string;
  kind: 'kept' | 'loved';
  amountCents: number | null;
  monthCents: number;
  starAwarded: boolean;
  starCount: number;
  stickerId: StickerId | null;
  rare: boolean;
};

/** Local-first log save + star/sticker roll. No network. */
export async function completeLog(payload: QuickLogSavePayload): Promise<LogRewardResult> {
  const item = await createItem(db, {
    userId: LOCAL_USER_ID,
    kind: payload.kind,
    name: payload.name,
    amountCents: payload.kind === 'kept' ? (payload.amountCents ?? 0) : payload.amountCents,
    category: payload.category,
    note: payload.note,
  });

  const starAwarded = awardStar(db, LOCAL_USER_ID, 'log');
  const starCount = await countStars(db, LOCAL_USER_ID);

  const emptyStreak = usePityStore.getState().emptyStreak;
  const roll = rollSticker(emptyStreak);
  usePityStore.getState().setEmptyStreak(roll.nextEmptyStreak);

  if (roll.stickerId) {
    awardSticker(db, LOCAL_USER_ID, roll.stickerId, 'log', item.id);
  }

  const monthCents = await keptTotalCents(db, LOCAL_USER_ID, monthRange());

  return {
    itemId: item.id,
    kind: payload.kind,
    amountCents: item.amountCents,
    monthCents,
    starAwarded,
    starCount,
    stickerId: roll.stickerId,
    rare: roll.rare,
  };
}
