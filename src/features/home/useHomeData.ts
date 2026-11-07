import { and, count, eq, isNull } from 'drizzle-orm';
import { useCallback, useEffect, useState } from 'react';

import { db } from '@/db/client';
import { goals, items, quests } from '@/db/schema';
import { buildHomeViewModel, type HomeViewModel } from '@/features/home/homeModel';
import { goalProgressCents, keptTotalCents, listByDay } from '@/features/items/repository';
import { useSettingsStore } from '@/features/rewards/settingsStore';
import { countStars } from '@/features/rewards/stars';
import { dayKey, dayRange, monthRange } from '@/lib/dates';
import { getLocalUserId } from '@/lib/localUser';

export function useHomeData() {
  const displayName = useSettingsStore((s) => s.displayName);
  const [vm, setVm] = useState<HomeViewModel | null>(null);

  const refresh = useCallback(async () => {
    const now = new Date();
    const key = dayKey(now);
    const todayItems = await listByDay(db, getLocalUserId(), now);
    const [todayCents, monthCents, starCount] = await Promise.all([
      keptTotalCents(db, getLocalUserId(), dayRange(now)),
      keptTotalCents(db, getLocalUserId(), monthRange(now)),
      countStars(db, getLocalUserId()),
    ]);

    const allTime = db
      .select({ n: count() })
      .from(items)
      .where(and(eq(items.userId, getLocalUserId()), isNull(items.deletedAt)))
      .get();

    const quest = db
      .select()
      .from(quests)
      .where(and(eq(quests.userId, getLocalUserId()), eq(quests.day, key)))
      .get();

    const goal = db
      .select()
      .from(goals)
      .where(
        and(eq(goals.userId, getLocalUserId()), isNull(goals.archivedAt), isNull(goals.deletedAt)),
      )
      .get();

    let goalProgress = 0;
    if (goal) {
      goalProgress = await goalProgressCents(db, getLocalUserId(), new Date(goal.startedAt), now);
    }

    setVm(
      buildHomeViewModel({
        displayName,
        starCount,
        todayCents,
        monthCents,
        todayItems,
        allTimeItemCount: Number(allTime?.n ?? 0),
        dayKey: key,
        userId: getLocalUserId(),
        questCompleted: !!quest?.completedAt,
        hasGoal: !!goal,
        goalName: goal?.name,
        goalProgressCents: goalProgress,
        goalTargetCents: goal?.targetCents,
      }),
    );
  }, [displayName]);

  useEffect(() => {
    const handle = setTimeout(() => {
      void refresh();
    }, 0);
    return () => clearTimeout(handle);
  }, [refresh]);

  return { vm, refresh };
}
