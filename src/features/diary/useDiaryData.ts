import { useCallback, useEffect, useState } from 'react';

import { db } from '@/db/client';
import { buildCalendarDays } from '@/features/diary/buildCalendarDays';
import type { DiaryViewModel } from '@/features/diary/DiaryScreen';
import { pickPrompt } from '@/features/diary/prompts';
import { listDiaryByMonth, listPromptHistory, listRecentDiary } from '@/features/diary/repository';
import { countStars, listStarDays } from '@/features/rewards/stars';
import { dayKey } from '@/lib/dates';
import { getLocalUserId } from '@/lib/localUser';

export function useDiaryData(cursor: Date) {
  const [vm, setVm] = useState<DiaryViewModel | null>(null);

  const refresh = useCallback(async () => {
    const [entries, recent, history, starDays, starCount] = await Promise.all([
      listDiaryByMonth(db, getLocalUserId(), cursor),
      listRecentDiary(db, getLocalUserId(), 8),
      listPromptHistory(db, getLocalUserId()),
      listStarDays(db, getLocalUserId()),
      countStars(db, getLocalUserId()),
    ]);

    const prompt = pickPrompt(history);
    const monthLabel = cursor
      .toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
      .toUpperCase();

    setVm({
      monthLabel,
      promptText: prompt.text,
      starCount,
      days: buildCalendarDays(
        cursor,
        entries,
        starDays.map((day) => ({ day })),
        new Date(),
      ),
      recent: recent.map((row) => ({
        id: row.id,
        entryDate: row.entryDate,
        mood: row.mood,
        body: row.body,
      })),
    });
  }, [cursor]);

  useEffect(() => {
    const handle = setTimeout(() => {
      void refresh();
    }, 0);
    return () => clearTimeout(handle);
  }, [refresh]);

  return { vm, refresh, todayKey: dayKey() };
}
