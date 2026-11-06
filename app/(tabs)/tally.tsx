import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { Screen } from '@/components';
import { TallyScreen, useTallyData, type TallyRange } from '@/features/tally';

export default function TallyRoute() {
  const [range, setRange] = useState<TallyRange>('month');
  const { vm, refresh } = useTallyData(range);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  if (!vm) {
    return (
      <Screen accessibilityLabel="Tally">
        <View style={{ flex: 1 }} />
      </Screen>
    );
  }

  return <TallyScreen vm={vm} onRangeChange={setRange} />;
}
