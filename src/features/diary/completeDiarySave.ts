import type { Mood } from '@/components/MoodPicker';
import type { StickerId } from '@/components/stickerAssets';
import { db } from '@/db/client';
import { saveDiaryEntry } from '@/features/diary/repository';
import { rollSticker } from '@/features/rewards/engine';
import { usePityStore } from '@/features/rewards/pityStore';
import { awardStar, countStars } from '@/features/rewards/stars';
import { awardSticker } from '@/features/rewards/stickers';
import { dayKey } from '@/lib/dates';
import { LOCAL_USER_ID } from '@/lib/localUser';

export type DiarySaveResult = {
  entryId: string;
  starAwarded: boolean;
  starCount: number;
  stickerId: StickerId | null;
  rare: boolean;
};

export async function completeDiarySave(input: {
  id?: string;
  entryDate?: string;
  promptId: string | null;
  mood: Mood | null;
  body: string;
}): Promise<DiarySaveResult> {
  const entry = await saveDiaryEntry(db, {
    userId: LOCAL_USER_ID,
    id: input.id,
    entryDate: input.entryDate ?? dayKey(),
    promptId: input.promptId,
    mood: input.mood,
    body: input.body,
  });

  const starAwarded = awardStar(db, LOCAL_USER_ID, 'diary');
  const starCount = await countStars(db, LOCAL_USER_ID);

  const emptyStreak = usePityStore.getState().emptyStreak;
  const roll = rollSticker(emptyStreak);
  usePityStore.getState().setEmptyStreak(roll.nextEmptyStreak);

  if (roll.stickerId) {
    awardSticker(db, LOCAL_USER_ID, roll.stickerId, 'diary', entry.id);
  }

  return {
    entryId: entry.id,
    starAwarded,
    starCount,
    stickerId: roll.stickerId,
    rare: roll.rare,
  };
}
