import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

import { db } from '@/db/client';
import { buildCalendarDays } from '@/features/diary/buildCalendarDays';
import { buildDayCard, starWord } from '@/features/diary/dayCardModel';
import type { DiaryViewModel } from '@/features/diary/DiaryScreen';
import { canGoNext, canGoPrev, showTodayChip } from '@/features/diary/monthBounds';
import {
  loadShuffleHistory,
  pickPrompt,
  rememberPrompt,
  type DiaryPrompt,
} from '@/features/diary/prompts';
import {
  earliestActivityDay,
  listDiaryByMonth,
  listPromptHistory,
} from '@/features/diary/repository';
import { listByMonth } from '@/features/items/repository';
import { countStars, listStarDays } from '@/features/rewards/stars';
import { dayKey } from '@/lib/dates';
import { getLocalUserId } from '@/lib/localUser';

const MONTHS = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
] as const;

export function useDiaryData(cursor: Date, selected: string) {
  const [vm, setVm] = useState<DiaryViewModel | null>(null);
  const promptRef = useRef<DiaryPrompt | null>(null);
  const [prompt, setPrompt] = useState<DiaryPrompt | null>(null);

  const refresh = useCallback(async () => {
    const userId = getLocalUserId();
    const today = new Date();
    const [entries, monthItems, history, shuffles, starDays, starCount, earliest] =
      await Promise.all([
        listDiaryByMonth(db, userId, cursor),
        listByMonth(db, userId, cursor),
        listPromptHistory(db, userId),
        loadShuffleHistory(),
        listStarDays(db, userId),
        countStars(db, userId),
        Promise.resolve(earliestActivityDay(db, userId)),
      ]);

    let current = promptRef.current;
    if (!current) {
      current = pickPrompt([...history, ...shuffles]);
      promptRef.current = current;
      setPrompt(current);
      void rememberPrompt(current.id);
    }

    const entry = entries.find((row) => row.entryDate === selected) ?? null;
    const items = monthItems
      .filter((item) => dayKey(new Date(item.happenedAt)) === selected)
      .map((item) => ({
        id: item.id,
        name: item.name,
        kind: item.kind,
        amountCents: item.amountCents,
        category: item.category,
        boughtAfterAll: item.boughtAfterAllAt != null,
      }));

    setVm({
      promptText: current.text,
      starCount,
      starWord: starWord(starCount),
      monthLabel: `${MONTHS[cursor.getMonth()] ?? ''} ${cursor.getFullYear()}`,
      showTodayChip: showTodayChip(cursor, today),
      canGoPrev: canGoPrev(cursor, earliest ? earliest.slice(0, 7) : null),
      canGoNext: canGoNext(cursor, today),
      days: buildCalendarDays(
        cursor,
        entries,
        starDays.map((day) => ({ day })),
        today,
        selected,
      ),
      day: buildDayCard({
        date: selected,
        todayKey: dayKey(today),
        items,
        page: entry ? { id: entry.id, mood: entry.mood, body: entry.body } : null,
        hasStar: starDays.includes(selected),
      }),
    });
  }, [cursor, selected]);

  const shuffle = useCallback(async () => {
    const userId = getLocalUserId();
    const [history, shuffles] = await Promise.all([
      listPromptHistory(db, userId),
      loadShuffleHistory(),
    ]);
    const next = pickPrompt(
      [...history, ...shuffles],
      new Date(),
      Math.random,
      promptRef.current?.id,
    );
    promptRef.current = next;
    setPrompt(next);
    await rememberPrompt(next.id);
    AccessibilityInfo.announceForAccessibility(next.text);
    setVm((prev) => (prev ? { ...prev, promptText: next.text } : prev));
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      void refresh();
    }, 0);
    return () => clearTimeout(handle);
  }, [refresh]);

  return { vm, refresh, shuffle, prompt };
}
