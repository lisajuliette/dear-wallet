import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';

import {
  CalendarMonth,
  CheckerBar,
  HardShadow,
  IconButton,
  PixelIcon,
  Screen,
  ScriptText,
} from '@/components';
import type { CalendarDay } from '@/components/CalendarMonth';
import { DayCard, MonthArrow, TodayChip } from '@/features/diary/DayCard';
import type { DayCardModel } from '@/features/diary/dayCardModel';
import { PromptCard } from '@/features/diary/PromptCard';
import { useSettingsStore } from '@/features/rewards/settingsStore';
import { TASKBAR_SCROLL_PAD } from '@/lib/taskbarPad';
import { useTokens } from '@/theme';

export type DiaryViewModel = {
  promptText: string;
  starCount: number;
  starWord: string;
  monthLabel: string;
  showTodayChip: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
  days: CalendarDay[];
  day: DayCardModel;
};

type DiaryScreenProps = {
  vm: DiaryViewModel;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onSelectDay: (date: string) => void;
  onShuffle: () => void;
  onOpenItem: (id: string) => void;
  onOpenPage: () => void;
};

function fadeOut(hex: string): string {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},0)`;
}

export function DiaryScreen({
  vm,
  onPrevMonth,
  onNextMonth,
  onToday,
  onSelectDay,
  onShuffle,
  onOpenItem,
  onOpenPage,
}: DiaryScreenProps) {
  const t = useTokens();
  const { height } = useWindowDimensions();
  const compact = height < 740;
  const promptsOn = useSettingsStore((s) => s.prompts);
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const dayY = useRef(0);
  const lastDay = useRef<string | null>(null);
  // Pacifico's line box is much taller than the 48 pt row, so the fade is ~100 pt.
  // Content starts below that measured height, with a gap so the first card is clear.
  const [headerHeight, setHeaderHeight] = useState(104);

  useEffect(() => {
    if (lastDay.current === null || lastDay.current === vm.day.label) {
      lastDay.current = vm.day.label;
      return;
    }
    lastDay.current = vm.day.label;
    scrollRef.current?.scrollTo({
      y: Math.max(0, dayY.current - 8),
      animated: !reducedMotion,
    });
  }, [vm.day.label, reducedMotion]);

  return (
    <Screen accessibilityLabel="Diary">
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1, marginBottom: TASKBAR_SCROLL_PAD }}
          contentContainerStyle={{
            paddingTop: headerHeight + 12,
            paddingHorizontal: 16,
            paddingBottom: 20,
            gap: compact ? 8 : 14,
          }}
        >
          {promptsOn ? (
            <PromptCard text={vm.promptText} height={compact ? 74 : 86} onShuffle={onShuffle} />
          ) : null}

          <HardShadow accessibilityLabel={vm.monthLabel}>
            <View
              style={{
                borderRadius: 20,
                borderWidth: 2,
                borderColor: t.outline,
                backgroundColor: t.surface,
              }}
            >
              <View style={{ borderRadius: 18, overflow: 'hidden' }}>
                <View
                  style={{
                    height: 46,
                    borderBottomWidth: 2,
                    borderColor: t.outline,
                    justifyContent: 'center',
                  }}
                >
                  <CheckerBar a={t.c1} b={t.c2} patternId="diary-month" height={46} />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      paddingLeft: 8,
                      paddingRight: 6,
                    }}
                  >
                    <View
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 1,
                        borderRadius: 999,
                        borderWidth: 2,
                        borderColor: t.outline,
                        backgroundColor: t.surface,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'PixelifySans_500Medium',
                          fontSize: 13,
                          letterSpacing: 0.78,
                          color: t.text,
                        }}
                      >
                        {vm.monthLabel}
                      </Text>
                    </View>
                    {vm.showTodayChip ? <TodayChip onPress={onToday} /> : null}
                    <View style={{ flex: 1 }} />
                    <MonthArrow
                      label="Previous month"
                      direction="back"
                      disabled={!vm.canGoPrev}
                      onPress={onPrevMonth}
                    />
                    <MonthArrow
                      label="Next month"
                      direction="forward"
                      disabled={!vm.canGoNext}
                      onPress={onNextMonth}
                    />
                  </View>
                </View>
                <View style={{ paddingHorizontal: 10, paddingTop: 8, paddingBottom: 10 }}>
                  <CalendarMonth days={vm.days} onDayPress={onSelectDay} />
                </View>
              </View>
            </View>
          </HardShadow>

          <View
            onLayout={(event) => {
              dayY.current = event.nativeEvent.layout.y;
            }}
          >
            <DayCard day={vm.day} onOpenItem={onOpenItem} onOpenPage={onOpenPage} />
          </View>
        </ScrollView>

        <LinearGradient
          pointerEvents="box-none"
          colors={[t.bg1, t.bg1, fadeOut(t.bg1)]}
          locations={[0, 0.7, 1]}
          onLayout={(event) => {
            const next = event.nativeEvent.layout.height;
            setHeaderHeight((prev) => (prev === next ? prev : next));
          }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 48 }}>
            <View style={{ flex: 1 }}>
              <ScriptText size={32}>Diary</ScriptText>
            </View>
            <View
              accessibilityLabel={`${vm.starCount} ${vm.starWord}`}
              style={{
                height: 36,
                marginTop: 4,
                paddingLeft: 8,
                paddingRight: 12,
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
              <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 12, color: t.text }}>
                {vm.starWord}
              </Text>
            </View>
            <IconButton
              accessibilityLabel="Diary lock settings"
              icon={<PixelIcon name="lock" size={22} />}
              onPress={() => router.push('/settings')}
            />
          </View>
        </LinearGradient>
      </View>
    </Screen>
  );
}
