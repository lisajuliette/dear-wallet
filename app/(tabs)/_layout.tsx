import { Tabs, router } from 'expo-router';
import { View } from 'react-native';

import { Taskbar, type TaskbarTab } from '@/components';

function TabBar({ state }: { state: { index: number; routes: { name: string }[] } }) {
  const route = state.routes[state.index]?.name;
  const active: TaskbarTab | 'none' =
    route === 'index'
      ? 'home'
      : route === 'tally' || route === 'diary' || route === 'collection'
        ? route
        : 'none';

  return (
    <Taskbar
      active={active}
      onTabPress={(tab) => {
        if (tab === 'home') router.push('/(tabs)');
        else router.push(`/(tabs)/${tab}`);
      }}
      onLogPress={() => router.push('/log')}
    />
  );
}

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => <TabBar state={props.state} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="tally" options={{ title: 'Tally' }} />
        <Tabs.Screen name="diary" options={{ title: 'Diary' }} />
        <Tabs.Screen name="collection" options={{ title: 'Collection' }} />
      </Tabs>
    </View>
  );
}
