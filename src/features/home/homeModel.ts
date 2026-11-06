import type { Item } from '@/db/schema';
import { QUEST_COPY, pickDailyQuest, type QuestId } from '@/features/rewards/engine';
import { formatCents } from '@/lib/money';

export type HomeState = 'first_day' | 'empty_today' | 'active' | 'quest_done';

export type HomeViewModel = {
  state: HomeState;
  greeting: string;
  starCount: number;
  todayCents: number;
  monthCents: number;
  todayCaption: string;
  questId: QuestId;
  questText: string;
  questDone: boolean;
  todayItems: Item[];
  hasGoal: boolean;
  goalLabel: string;
  goalProgressCents: number;
  goalTargetCents: number;
};

export function buildHomeViewModel(input: {
  displayName: string;
  starCount: number;
  todayCents: number;
  monthCents: number;
  todayItems: Item[];
  allTimeItemCount: number;
  dayKey: string;
  userId: string;
  questCompleted: boolean;
  hasGoal: boolean;
  goalName?: string;
  goalProgressCents?: number;
  goalTargetCents?: number;
}): HomeViewModel {
  const isFirstDay = input.allTimeItemCount === 0 && !input.hasGoal;
  const questId = pickDailyQuest(input.dayKey, input.userId, isFirstDay);
  const questDone = input.questCompleted;

  let state: HomeState;
  if (isFirstDay) state = 'first_day';
  else if (questDone) state = 'quest_done';
  else if (input.todayItems.length === 0) state = 'empty_today';
  else state = 'active';

  const greeting =
    state === 'first_day'
      ? `HI ${input.displayName.toUpperCase()} ♡ DAY ONE`
      : `HI ${input.displayName.toUpperCase()} ♡`;

  let todayCaption: string;
  if (state === 'first_day') todayCaption = 'ur kept total starts here ♡';
  else if (input.todayItems.length === 0) todayCaption = "nothing yet, and that's totally fine";
  else {
    const n = input.todayItems.filter((i) => i.kind === 'kept').length;
    todayCaption = `${n} thing${n === 1 ? '' : 's'} u didn't buy ♡`;
  }

  return {
    state,
    greeting,
    starCount: input.starCount,
    todayCents: input.todayCents,
    monthCents: input.monthCents,
    todayCaption,
    questId,
    questText: QUEST_COPY[questId],
    questDone,
    todayItems: input.todayItems,
    hasGoal: input.hasGoal,
    goalLabel: input.goalName ?? '',
    goalProgressCents: input.goalProgressCents ?? 0,
    goalTargetCents: input.goalTargetCents ?? 0,
  };
}

export function formatKept(cents: number): string {
  return formatCents(cents);
}
