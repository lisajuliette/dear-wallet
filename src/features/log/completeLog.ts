import type { StickerId } from '@/components/stickerAssets';
import { db } from '@/db/client';
import { checkGoalReached } from '@/features/goals/repository';
import { storePickedPhoto } from '@/features/items/photos';
import { createItem, keptTotalCents, updateItem } from '@/features/items/repository';
import type { QuickLogSavePayload } from '@/features/log/QuickLogForm';
import { rollSticker } from '@/features/rewards/engine';
import { applyMilestones, listUnlockIds } from '@/features/rewards/milestones';
import type { MilestoneId } from '@/features/rewards/milestonesCatalog';
import { dropPoolsForUnlocks } from '@/features/rewards/packs';
import { usePityStore } from '@/features/rewards/pityStore';
import { useRewardQueueStore } from '@/features/rewards/rewardQueue';
import { awardStar, countStars } from '@/features/rewards/stars';
import { awardSticker } from '@/features/rewards/stickers';
import { scheduleSync } from '@/features/sync/runSync';
import { monthRange } from '@/lib/dates';
import { getLocalUserId } from '@/lib/localUser';

export type LogRewardResult = {
  itemId: string;
  kind: 'kept' | 'loved';
  amountCents: number | null;
  monthCents: number;
  starAwarded: boolean;
  starCount: number;
  stickerId: StickerId | null;
  rare: boolean;
  milestoneIds: MilestoneId[];
};

/** Local-first log save + star/sticker roll + milestones. No network. */
export async function completeLog(payload: QuickLogSavePayload): Promise<LogRewardResult> {
  const item = await createItem(db, {
    userId: getLocalUserId(),
    kind: payload.kind,
    name: payload.name,
    amountCents: payload.kind === 'kept' ? (payload.amountCents ?? 0) : payload.amountCents,
    category: payload.category,
    note: payload.note,
    link: payload.link,
  });

  if (payload.photoUri) {
    const photoPath = await storePickedPhoto(item.id, payload.photoUri);
    if (photoPath) {
      await updateItem(db, getLocalUserId(), item.id, { photoPath });
    }
  }

  const starAwarded = awardStar(db, getLocalUserId(), 'log');
  const starCount = await countStars(db, getLocalUserId());

  const unlockIds = await listUnlockIds(db, getLocalUserId());
  const pools = dropPoolsForUnlocks(unlockIds);
  const emptyStreak = usePityStore.getState().emptyStreak;
  const roll = rollSticker(emptyStreak, Math.random, pools.commons, pools.rares);
  usePityStore.getState().setEmptyStreak(roll.nextEmptyStreak);

  if (roll.stickerId) {
    awardSticker(db, getLocalUserId(), roll.stickerId, 'log', item.id);
  }

  const monthCents = await keptTotalCents(db, getLocalUserId(), monthRange());
  const milestoneIds = await applyMilestones(db, getLocalUserId());
  useRewardQueueStore.getState().enqueue(milestoneIds);
  await checkGoalReached(db, getLocalUserId());
  scheduleSync(db);

  return {
    itemId: item.id,
    kind: payload.kind,
    amountCents: item.amountCents,
    monthCents,
    starAwarded,
    starCount,
    stickerId: roll.stickerId,
    rare: roll.rare,
    milestoneIds,
  };
}
