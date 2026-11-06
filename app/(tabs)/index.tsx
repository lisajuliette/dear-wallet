import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Text, View } from 'react-native';

import { HomeScreen } from '@/features/home/HomeScreen';
import { useHomeData } from '@/features/home/useHomeData';

export default function HomeRoute() {
  const { vm, refresh } = useHomeData();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  if (!vm) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>loading…</Text>
      </View>
    );
  }

  return <HomeScreen vm={vm} onRefresh={refresh} />;
}
