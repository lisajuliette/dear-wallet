import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { Screen } from '@/components';
import { DiaryScreen, useDiaryData } from '@/features/diary';
import { selectDay } from '@/features/diary/daySelection';
import { dayAfterMonthChange, shiftMonth } from '@/features/diary/monthBounds';
import { dayKey } from '@/lib/dates';

export default function DiaryRoute() {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selected, setSelected] = useState(() => dayKey());
  const { vm, refresh, shuffle } = useDiaryData(cursor, selected);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  if (!vm) {
    return (
      <Screen accessibilityLabel="Diary">
        <View style={{ flex: 1 }} />
      </Screen>
    );
  }

  const openPage = () => {
    if (vm.day.page) {
      router.push({ pathname: '/diary/entry/[id]', params: { id: vm.day.page.id } });
      return;
    }
    router.push({ pathname: '/diary/entry/[id]', params: { id: 'new', date: selected } });
  };

  return (
    <DiaryScreen
      vm={vm}
      onPrevMonth={() => {
        if (!vm.canGoPrev) return;
        const next = shiftMonth(cursor, -1);
        setCursor(next);
        setSelected(dayAfterMonthChange(next, Number(selected.slice(-2)), new Date()));
      }}
      onNextMonth={() => {
        if (!vm.canGoNext) return;
        const next = shiftMonth(cursor, 1);
        setCursor(next);
        setSelected(dayAfterMonthChange(next, Number(selected.slice(-2)), new Date()));
      }}
      onToday={() => {
        const now = new Date();
        setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
        setSelected(dayKey(now));
      }}
      onSelectDay={(date) => {
        const result = selectDay(date, dayKey());
        if (result.selected) setSelected(result.date);
      }}
      onShuffle={() => {
        void shuffle();
      }}
      onOpenItem={(id) => router.push({ pathname: '/item/[id]', params: { id } })}
      onOpenPage={openPage}
    />
  );
}
