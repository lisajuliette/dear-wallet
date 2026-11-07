import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import {
  CalendarMonth,
  CloudCard,
  EmptyState,
  IconButton,
  PixelIcon,
  RetroWindow,
  Screen,
  ScriptText,
  Sticker,
} from '@/components';
import type { CalendarDay } from '@/components/CalendarMonth';
import type { Mood } from '@/components/MoodPicker';
import { useTokens } from '@/theme';

export type DiaryRecentRow = {
  id: string;
  entryDate: string;
  mood: Mood | null;
  body: string;
};

export type DiaryViewModel = {
  monthLabel: string;
  promptText: string;
  starCount: number;
  days: CalendarDay[];
  recent: DiaryRecentRow[];
};

type DiaryScreenProps = {
  vm: DiaryViewModel;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onWrite: () => void;
  onOpenEntry: (id: string) => void;
  onDayPress: (date: string) => void;
};

const MOOD_STICKER = {
  proud: 'mood-proud',
  chill: 'mood-chill',
  meh: 'mood-meh',
  tempted: 'mood-tempted',
  wobbly: 'mood-wobbly',
} as const;

function formatEntryDate(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  if (!y || !m || !d) return key;
  return new Date(y, m - 1, d)
    .toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    .toLowerCase();
}

export function DiaryScreen({
  vm,
  onPrevMonth,
  onNextMonth,
  onWrite,
  onOpenEntry,
  onDayPress,
}: DiaryScreenProps) {
  const t = useTokens();

  return (
    <Screen accessibilityLabel="Diary">
      <ScrollView
        contentContainerStyle={{
          gap: 12,
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 100,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <ScriptText size={32}>Diary</ScriptText>
          </View>
          <View
            accessibilityLabel={`${vm.starCount} stars`}
            style={{
              height: 36,
              paddingHorizontal: 12,
              borderRadius: 18,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.surface,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <PixelIcon name="sparkle" size={18} />
            <Text style={{ fontFamily: 'PixelifySans_600SemiBold', fontSize: 16, color: t.text }}>
              {vm.starCount}
            </Text>
          </View>
          <IconButton
            accessibilityLabel="Lock settings"
            icon={<PixelIcon name="lock" size={22} />}
            onPress={() => router.push('/settings')}
          />
        </View>

        <CloudCard fill="c2" height={110} accessibilityLabel="Today's prompt">
          <View style={{ flex: 1, justifyContent: 'center', gap: 8 }}>
            <Text
              style={{
                fontFamily: 'PixelifySans_500Medium',
                fontSize: 12,
                letterSpacing: 0.72,
                color: t.text,
              }}
            >
              {"TODAY'S PROMPT"}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text
                style={{
                  flex: 1,
                  fontFamily: 'Nunito_800ExtraBold',
                  fontSize: 16,
                  color: t.text,
                  lineHeight: 22,
                }}
              >
                {vm.promptText}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="write"
                onPress={onWrite}
                style={{
                  height: 40,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: t.outline,
                  backgroundColor: t.btn,
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 15, color: t.btnText }}>
                  write
                </Text>
              </Pressable>
            </View>
          </View>
        </CloudCard>

        <RetroWindow
          title={vm.monthLabel}
          titleBar="mint"
          right={
            <View style={{ flexDirection: 'row', gap: 4 }}>
              <IconButton
                size={36}
                accessibilityLabel="Previous month"
                icon={<PixelIcon name="back" size={16} />}
                onPress={onPrevMonth}
              />
              <IconButton
                size={36}
                accessibilityLabel="Next month"
                icon={<PixelIcon name="forward" size={16} />}
                onPress={onNextMonth}
              />
            </View>
          }
        >
          <CalendarMonth days={vm.days} onDayPress={onDayPress} />
        </RetroWindow>

        <RetroWindow title="RECENT ENTRIES" titleBar="butter">
          {vm.recent.length === 0 ? (
            <EmptyState
              sticker="mood-chill"
              title="no entries yet. one line is plenty"
              body="or just pick a mood, that counts too ♡"
            />
          ) : (
            <View style={{ gap: 6 }}>
              {vm.recent.map((row) => (
                <Pressable
                  key={row.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Entry ${formatEntryDate(row.entryDate)}`}
                  onPress={() => onOpenEntry(row.id)}
                  style={{
                    minHeight: 52,
                    borderRadius: 15,
                    borderWidth: 2,
                    borderColor: t.outline,
                    backgroundColor: t.c5,
                    paddingHorizontal: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  {row.mood ? (
                    <Sticker id={MOOD_STICKER[row.mood]} size={28} />
                  ) : (
                    <PixelIcon name="note" size={22} />
                  )}
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text
                      style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 12, color: t.text }}
                    >
                      {formatEntryDate(row.entryDate)}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{ fontFamily: 'Nunito_700Bold', fontSize: 14, color: t.text }}
                    >
                      {row.body.trim() || (row.mood ? `feeling ${row.mood}` : '…')}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </RetroWindow>
      </ScrollView>
    </Screen>
  );
}
