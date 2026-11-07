import { LinearGradient } from 'expo-linear-gradient';
import { Tabs, router } from 'expo-router';
import { View } from 'react-native';

import { GridPaper, Taskbar, type TaskbarTab } from '@/components';
import { useTokens } from '@/theme';

function TabBar({ state }: { state: { index: number; routes: { name: string }[] } }) {
  const route = state.routes[state.index]?.name;
  const active: TaskbarTab | 'none' =
    route === 'index'
      ? 'home'
      : route === 'tally' || route === 'diary' || route === 'collection'
        ? route
        : 'none';

  return (
    <View pointerEvents="box-none" style={{ height: 0 }}>
      <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <Taskbar
          active={active}
          onTabPress={(tab) => {
            if (tab === 'home') router.push('/(tabs)');
            else router.push(`/(tabs)/${tab}`);
          }}
          onLogPress={() => router.push('/log')}
        />
      </View>
    </View>
  );
}

export default function TabsLayout() {
  const t = useTokens();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg1 }}>
      <LinearGradient
        colors={[t.bg1, t.bg2]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      />
      <GridPaper />
      <Tabs
        safeAreaInsets={{ bottom: 0 }}
        tabBar={(props) => <TabBar state={props.state} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 96,
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
          },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="tally" options={{ title: 'Tally' }} />
        <Tabs.Screen name="diary" options={{ title: 'Diary' }} />
        <Tabs.Screen name="collection" options={{ title: 'Collection' }} />
      </Tabs>
    </View>
  );
}
