import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import {
  AmountPad,
  BarChart,
  BottomSheet,
  CalendarMonth,
  Chip,
  CloudCard,
  Coin,
  DigitCounter,
  EmptyState,
  Faceplate,
  HardShadow,
  IconButton,
  KindMessage,
  ListRow,
  MoodPicker,
  PillButton,
  PillToggle,
  PixelIcon,
  PreviewBar,
  RetroWindow,
  Screen,
  ScriptText,
  SegmentBar,
  Segmented,
  SparkleBurst,
  StatusChip,
  Sticker,
  StickerTray,
  TagChip,
  Taskbar,
  type Mood,
  type TaskbarTab,
} from '@/components';
import { applyPadKey } from '@/lib';

export default function DevComponentsScreen() {
  const [segment, setSegment] = useState<'kept' | 'loved'>('kept');
  const [sounds, setSounds] = useState(true);
  const [motion, setMotion] = useState(false);
  const [chipOn, setChipOn] = useState(true);
  const [tagOn, setTagOn] = useState(false);
  const [pad, setPad] = useState('');
  const [mood, setMood] = useState<Mood | null>('proud');
  const [tab, setTab] = useState<TaskbarTab>('home');
  const [sheetOpen, setSheetOpen] = useState(false);
  const isDev = __DEV__;

  if (!isDev) {
    return <Redirect href="/" />;
  }

  return (
    <Screen accessibilityLabel="components lab">
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ gap: 20, padding: 16, paddingBottom: 24 }}>
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
          <PillButton label="nvm!" fullWidth={false} />
          <View className="flex-row gap-2.5">
            <View className="flex-1">
              <PillButton label="secondary" variant="secondary" size="md" />
            </View>
            <PillButton label="go" size="md" fullWidth={false} />
            <PillButton label="not yet" size="md" disabled fullWidth={false} />
          </View>
          <PillButton label="skip for now" variant="link" size="md" fullWidth={false} />

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
            <TagChip label="savings" selected={tagOn} onPress={() => setTagOn((v) => !v)} />
            <StatusChip label="kept" />
            <IconButton
              accessibilityLabel="Close"
              icon={<Text className="font-sans-black text-ink">×</Text>}
            />
            <PixelIcon name="sparkle" size={28} />
          </View>

          <Text className="font-pixel text-sm uppercase tracking-tag text-ink">amount pad</Text>
          <Text className="font-sans-black text-2xl text-ink">{pad || '0'}</Text>
          <AmountPad onKey={(key) => setPad((prev) => applyPadKey(prev, key))} />

          <Text className="font-pixel text-sm uppercase tracking-tag text-ink">list + empty</Text>
          <ListRow title="matcha latte" meta="today · 2:14" amountCents={620} onPress={() => {}} />
          <EmptyState
            sticker="common-lil-cloud"
            title="no logs yet"
            body="tap LOG when u almost buy something — ur future self will thank u"
          />

          <Text className="font-pixel text-sm uppercase tracking-tag text-ink">
            stickers + mood
          </Text>
          <View className="flex-row items-center gap-3">
            <Sticker id="common-pixel-heart" size={64} />
            <Sticker id="rare-holo-star" size={64} />
            <Coin size={56} />
          </View>
          <MoodPicker value={mood} onChange={setMood} />
          <StickerTray
            items={[
              { id: 'common-butterfly', count: 2 },
              { id: 'common-gold-star', count: 0, placed: true },
              { id: 'rare-holo-cd', count: 1 },
            ]}
          />

          <Text className="font-pixel text-sm uppercase tracking-tag text-ink">charts + bits</Text>
          <BarChart
            bars={[
              { label: 'mo', cents: 1200 },
              { label: 'tu', cents: 0 },
              { label: 'we', cents: 840 },
              { label: 'th', cents: 2100 },
              { label: 'fr', cents: 400 },
            ]}
          />
          <SegmentBar value={0.58} />
          <SegmentBar value={1} holo />
          <DigitCounter value={38} changed={[1]} />
          <KindMessage>ur doing amazing, keep going ♡</KindMessage>
          <View className="items-center">
            <SparkleBurst count={9} radius={40} />
          </View>

          <Text className="font-pixel text-sm uppercase tracking-tag text-ink">
            faceplate + preview
          </Text>
          <View className="flex-row gap-3">
            <Faceplate palette="cloud" selected />
            <Faceplate palette="lilac" />
            <Faceplate palette="orchid" locked />
          </View>
          <PreviewBar palette="peachfuzz" unlockText="unlock at $100 kept" onRevert={() => {}} />

          <Text className="font-pixel text-sm uppercase tracking-tag text-ink">calendar</Text>
          <CalendarMonth
            days={[
              { date: '2026-11-02', star: true },
              { date: '2026-11-03', mood: 'chill' },
              { date: '2026-11-04' },
              { date: '2026-11-05' },
              { date: '2026-11-06', today: true, star: true, mood: 'proud' },
              { date: '2026-11-07' },
              { date: '2026-11-08' },
            ]}
          />

          <Text className="font-pixel text-sm uppercase tracking-tag text-ink">sheet</Text>
          <PillButton label="open sheet" size="md" onPress={() => setSheetOpen(true)} />
          <BottomSheet visible={sheetOpen} title="BOTTOM SHEET" onClose={() => setSheetOpen(false)}>
            <Text className="font-sans text-sm text-ink">radius 28 · checker title · scrim</Text>
          </BottomSheet>

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

        <Taskbar active={tab} onTabPress={setTab} onLogPress={() => setSheetOpen(true)} />
      </View>
    </Screen>
  );
}
