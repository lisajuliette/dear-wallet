import { and, count, eq, isNull } from 'drizzle-orm';
import { useCallback, useEffect, useState } from 'react';

import { db } from '@/db/client';
import { goals, items, quests } from '@/db/schema';
import { buildHomeViewModel, type HomeViewModel } from '@/features/home/homeModel';
import { goalProgressCents, keptTotalCents, listByDay } from '@/features/items/repository';
import { useSettingsStore } from '@/features/rewards/settingsStore';
import { countStars } from '@/features/rewards/stars';
import { dayKey, dayRange, monthRange } from '@/lib/dates';
import { LOCAL_USER_ID } from '@/lib/localUser';

export function useHomeData() {
  const displayName = useSettingsStore((s) => s.displayName);
  const [vm, setVm] = useState<HomeViewModel | null>(null);

  const refresh = useCallback(async () => {
    const now = new Date();
    const key = dayKey(now);
    const todayItems = await listByDay(db, LOCAL_USER_ID, now);
    const [todayCents, monthCents, starCount] = await Promise.all([
      keptTotalCents(db, LOCAL_USER_ID, dayRange(now)),
      keptTotalCents(db, LOCAL_USER_ID, monthRange(now)),
      countStars(db, LOCAL_USER_ID),
    ]);

    const allTime = db
      .select({ n: count() })
      .from(items)
      .where(and(eq(items.userId, LOCAL_USER_ID), isNull(items.deletedAt)))
      .get();

    const quest = db
      .select()
      .from(quests)
      .where(and(eq(quests.userId, LOCAL_USER_ID), eq(quests.day, key)))
      .get();

    const goal = db
      .select()
      .from(goals)
      .where(
        and(eq(goals.userId, LOCAL_USER_ID), isNull(goals.archivedAt), isNull(goals.deletedAt)),
      )
      .get();

    let goalProgress = 0;
    if (goal) {
      goalProgress = await goalProgressCents(db, LOCAL_USER_ID, new Date(goal.startedAt), now);
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
        userId: LOCAL_USER_ID,
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
