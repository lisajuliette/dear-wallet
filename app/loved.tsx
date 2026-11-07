import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';

import { Screen } from '@/components';
import { db } from '@/db/client';
import { listLovedByMonth } from '@/features/items/repository';
import { LovedListScreen, type LovedListViewModel } from '@/features/loved/LovedListScreen';
import { getLocalUserId } from '@/lib/localUser';

function shiftMonth(base: Date, delta: number): Date {
  return new Date(base.getFullYear(), base.getMonth() + delta, 1);
}

function buildVm(
  at: Date,
  items: Awaited<ReturnType<typeof listLovedByMonth>>,
): LovedListViewModel {
  const monthLabel = at.toLocaleDateString(undefined, { month: 'long' }).toUpperCase();
  const monthName = at.toLocaleDateString(undefined, { month: 'long' }).toLowerCase();
  return {
    monthLabel,
    monthName,
    count: items.length,
    items,
  };
}

export default function LovedRoute() {
  const [cursor, setCursor] = useState(() => new Date());
  const [vm, setVm] = useState<LovedListViewModel | null>(null);
  const at = useMemo(() => new Date(cursor.getFullYear(), cursor.getMonth(), 1), [cursor]);

  const refresh = useCallback(async () => {
    const items = await listLovedByMonth(db, getLocalUserId(), at);
    setVm(buildVm(at, items));
  }, [at]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  if (!vm) {
    return (
      <Screen accessibilityLabel="Loved list">
        <View style={{ flex: 1 }} />
      </Screen>
    );
  }

  return (
    <LovedListScreen
      vm={vm}
      onPrevMonth={() => setCursor((d) => shiftMonth(d, -1))}
      onNextMonth={() => setCursor((d) => shiftMonth(d, 1))}
      onAdd={() => router.push({ pathname: '/log', params: { kind: 'loved' } })}
    />
  );
}
