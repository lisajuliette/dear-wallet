import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { Screen } from '@/components';
import { TallyScreen, useTallyData, type TallyRange } from '@/features/tally';
import { loadTallyRange, saveTallyRange } from '@/features/tally/persistRange';

export default function TallyRoute() {
  const [range, setRange] = useState<TallyRange>('month');
  const { vm, refresh } = useTallyData(range);

  useEffect(() => {
    void loadTallyRange().then(setRange);
  }, []);

  const onRangeChange = (next: TallyRange) => {
    setRange(next);
    void saveTallyRange(next);
  };

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

  return <TallyScreen vm={vm} onRangeChange={onRangeChange} />;
}
