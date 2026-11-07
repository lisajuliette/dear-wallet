import type { Mood } from '@/components/MoodPicker';
import type { StickerId } from '@/components/stickerAssets';
import { db } from '@/db/client';
import { saveDiaryEntry } from '@/features/diary/repository';
import { checkGoalReached } from '@/features/goals/repository';
import { rollSticker } from '@/features/rewards/engine';
import { applyMilestones, listUnlockIds } from '@/features/rewards/milestones';
import type { MilestoneId } from '@/features/rewards/milestonesCatalog';
import { dropPoolsForUnlocks } from '@/features/rewards/packs';
import { usePityStore } from '@/features/rewards/pityStore';
import { useRewardQueueStore } from '@/features/rewards/rewardQueue';
import { awardStar, countStars } from '@/features/rewards/stars';
import { awardSticker } from '@/features/rewards/stickers';
import { scheduleSync } from '@/features/sync/runSync';
import { dayKey } from '@/lib/dates';
import { getLocalUserId } from '@/lib/localUser';

export type DiarySaveResult = {
  entryId: string;
  starAwarded: boolean;
  starCount: number;
  stickerId: StickerId | null;
  rare: boolean;
  milestoneIds: MilestoneId[];
};

export async function completeDiarySave(input: {
  id?: string;
  entryDate?: string;
  promptId: string | null;
  mood: Mood | null;
  body: string;
}): Promise<DiarySaveResult> {
  const entry = await saveDiaryEntry(db, {
    userId: getLocalUserId(),
    id: input.id,
    entryDate: input.entryDate ?? dayKey(),
    promptId: input.promptId,
    mood: input.mood,
    body: input.body,
  });

  const starAwarded = awardStar(db, getLocalUserId(), 'diary');
  const starCount = await countStars(db, getLocalUserId());

  const unlockIds = await listUnlockIds(db, getLocalUserId());
  const pools = dropPoolsForUnlocks(unlockIds);
  const emptyStreak = usePityStore.getState().emptyStreak;
  const roll = rollSticker(emptyStreak, Math.random, pools.commons, pools.rares);
  usePityStore.getState().setEmptyStreak(roll.nextEmptyStreak);

  if (roll.stickerId) {
    awardSticker(db, getLocalUserId(), roll.stickerId, 'diary', entry.id);
  }

  const milestoneIds = await applyMilestones(db, getLocalUserId());
  useRewardQueueStore.getState().enqueue(milestoneIds);
  await checkGoalReached(db, getLocalUserId());
  scheduleSync(db);

  return {
    entryId: entry.id,
    starAwarded,
    starCount,
    stickerId: roll.stickerId,
    rare: roll.rare,
    milestoneIds,
  };
}
