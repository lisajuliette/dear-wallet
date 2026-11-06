import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import {
  Chip,
  CloudCard,
  HardShadow,
  IconButton,
  PillButton,
  PillToggle,
  RetroWindow,
  Screen,
  ScriptText,
  Segmented,
} from '@/components';

export default function DevComponentsScreen() {
  const [segment, setSegment] = useState<'kept' | 'loved'>('kept');
  const [sounds, setSounds] = useState(true);
  const [motion, setMotion] = useState(false);
  const [chipOn, setChipOn] = useState(true);
  const isDev = __DEV__;

  if (!isDev) {
    return <Redirect href="/" />;
  }

  return (
    <Screen accessibilityLabel="components lab">
      <ScrollView contentContainerStyle={{ gap: 20, padding: 16, paddingBottom: 48 }}>
        <View className="gap-1">
          <Text className="font-pixel text-sm uppercase tracking-tag text-ink">
            foundations · component set
          </Text>
          <ScriptText size={30} className="text-ink">
            the lil parts
          </ScriptText>
        </View>

        <Text className="font-pixel text-sm uppercase tracking-tag text-ink">window</Text>
        <RetroWindow title="WINDOW TITLE">
          <Text className="font-sans text-sm text-ink">
            Radius 20 · checker title bar · title on a surface pill.
          </Text>
        </RetroWindow>

        <Text className="font-pixel text-sm uppercase tracking-tag text-ink">buttons</Text>
        <PillButton label="nvm!" />
        <View className="flex-row gap-2.5">
          <View className="flex-1">
            <PillButton label="secondary" variant="secondary" size="md" />
          </View>
          <PillButton label="go" size="md" />
          <PillButton label="not yet" size="md" disabled />
        </View>
        <PillButton label="skip for now" variant="link" size="md" />

        <Text className="font-pixel text-sm uppercase tracking-tag text-ink">
          pill toggle + segmented
        </Text>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <PillToggle label="sounds" value={sounds} onChange={setSounds} />
          </View>
          <View className="flex-1">
            <PillToggle label="motion" value={motion} onChange={setMotion} />
          </View>
        </View>
        <Segmented
          value={segment}
          onChange={setSegment}
          options={[
            { label: "didn't buy", value: 'kept' },
            { label: 'loved it', value: 'loved' },
          ]}
        />

        <Text className="font-pixel text-sm uppercase tracking-tag text-ink">chips + icon</Text>
        <View className="flex-row flex-wrap gap-2">
          <Chip label="$12" selected={chipOn} onPress={() => setChipOn((v) => !v)} />
          <Chip label="$24" />
          <Chip label="add tag" dashed />
          <IconButton
            accessibilityLabel="Close"
            icon={<Text className="font-sans-black text-ink">×</Text>}
          />
        </View>

        <Text className="font-pixel text-sm uppercase tracking-tag text-ink">cloud card</Text>
        <CloudCard fill="c3" height={76} accessibilityLabel="coin cloud">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-pixel text-xs uppercase tracking-tag text-ink">C3</Text>
              <Text className="font-sans-black text-[15px] text-ink">goal, coin</Text>
            </View>
          </View>
        </CloudCard>

        <Text className="font-pixel text-sm uppercase tracking-tag text-ink">hard shadow</Text>
        <HardShadow radius={16} accessibilityLabel="shadow demo">
          <View className="rounded-key border-2 border-outline bg-surface p-4">
            <Text className="font-sans text-ink">offset sibling, no blur</Text>
          </View>
        </HardShadow>
      </ScrollView>
    </Screen>
  );
}
