import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { Screen } from '@/components';
import { db } from '@/db/client';
import { DiaryScreen, getDiaryByDate, useDiaryData } from '@/features/diary';
import { getLocalUserId } from '@/lib/localUser';

export default function DiaryRoute() {
  const [cursor, setCursor] = useState(() => new Date());
  const { vm, refresh } = useDiaryData(cursor);

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

  return (
    <DiaryScreen
      vm={vm}
      onPrevMonth={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
      onNextMonth={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
      onWrite={() => router.push({ pathname: '/diary/entry/[id]', params: { id: 'new' } })}
      onOpenEntry={(id) => router.push({ pathname: '/diary/entry/[id]', params: { id } })}
      onDayPress={(date) => {
        void getDiaryByDate(db, getLocalUserId(), date).then((entry) => {
          if (entry) {
            router.push({ pathname: '/diary/entry/[id]', params: { id: entry.id } });
          } else {
            router.push({ pathname: '/diary/entry/[id]', params: { id: 'new', date } });
          }
        });
      }}
    />
  );
}
