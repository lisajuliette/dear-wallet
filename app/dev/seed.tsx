import { router, Redirect } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { db } from '@/db/client';
import { SEED_LABELS, SEED_SCENARIOS, applyDevSeed, type SeedScenario } from '@/features/dev/seed';
import { isDevOfflineForced, setDevOffline } from '@/lib/network';

export default function DevSeedScreen() {
  const [busy, setBusy] = useState<SeedScenario | null>(null);
  const [offline, setOffline] = useState(isDevOfflineForced());
  const [note, setNote] = useState('replaces local diary data on this device');

  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  async function apply(scenario: SeedScenario) {
    setBusy(scenario);
    setNote('planting…');
    try {
      await applyDevSeed(db, scenario);
      setNote(`${SEED_LABELS[scenario].label} is ready`);
      router.replace('/(tabs)');
    } catch (error) {
      setNote(error instanceof Error ? error.message : 'could not plant that');
    } finally {
      setBusy(null);
    }
  }

  return (
    <ScrollView className="flex-1 bg-bg1" contentContainerClassName="gap-3 px-gutter py-6">
      <Text className="font-sans text-base text-ink">{note}</Text>
      <Pressable
        accessibilityRole="switch"
        accessibilityLabel="Force offline"
        accessibilityState={{ checked: offline }}
        onPress={() => {
          const next = !offline;
          setDevOffline(next);
          setOffline(next);
        }}
        className="min-h-tap justify-center rounded-key border-2 border-outline bg-surface px-4"
      >
        <Text className="font-sans-semibold text-base text-ink">
          {offline ? 'offline override on' : 'offline override off'}
        </Text>
      </Pressable>
      {SEED_SCENARIOS.map((scenario) => (
        <Pressable
          key={scenario}
          accessibilityRole="button"
          accessibilityLabel={SEED_LABELS[scenario].label}
          testID={`seed-${scenario}`}
          disabled={busy !== null}
          onPress={() => {
            void apply(scenario);
          }}
          className="min-h-tap justify-center rounded-key border-2 border-outline bg-surface px-4 py-2"
        >
          <Text className="font-sans-extrabold text-base text-ink">
            {SEED_LABELS[scenario].label}
          </Text>
          <Text className="font-sans text-sm text-ink">{SEED_LABELS[scenario].detail}</Text>
        </Pressable>
      ))}
      <View className="flex-row gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open theme lab"
          onPress={() => router.push('/dev/theme')}
          className="min-h-tap flex-1 items-center justify-center rounded-key border-2 border-outline bg-c3"
        >
          <Text className="font-sans-semibold text-base text-ink">theme</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open component lab"
          onPress={() => router.push('/dev/components')}
          className="min-h-tap flex-1 items-center justify-center rounded-key border-2 border-outline bg-c4"
        >
          <Text className="font-sans-semibold text-base text-ink">components</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
