import { Pressable, Text, View } from 'react-native';

import type { Mood } from '@/components/MoodPicker';
import { useTokens } from '@/theme';

export type CalendarDay = {
  date: string;
  star?: boolean;
  mood?: Mood | null;
  today?: boolean;
};

type CalendarMonthProps = {
  days: CalendarDay[];
  onDayPress?: (date: string) => void;
  accessibilityLabel?: string;
};

const WEEKDAYS = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'] as const;

/** 7 × 6 diary month grid, Monday first. */
export function CalendarMonth({
  days,
  onDayPress,
  accessibilityLabel = 'calendar month',
}: CalendarMonthProps) {
  const t = useTokens();
  const cells = [...days];
  while (cells.length < 42) {
    cells.push({ date: `pad-${cells.length}` });
  }

  return (
    <View accessibilityLabel={accessibilityLabel} style={{ gap: 6 }}>
      <View style={{ flexDirection: 'row' }}>
        {WEEKDAYS.map((day) => (
          <Text
            key={day}
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: 'PixelifySans_500Medium',
              fontSize: 11,
              letterSpacing: 0.66,
              color: t.text,
              textTransform: 'uppercase',
            }}
          >
            {day}
          </Text>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {cells.slice(0, 42).map((day) => {
          const empty = day.date.startsWith('pad-');
          const dayNum = empty ? '' : day.date.slice(-2).replace(/^0/, '');
          return (
            <Pressable
              key={day.date}
              accessibilityRole={empty ? undefined : 'button'}
              accessibilityLabel={
                empty
                  ? undefined
                  : [day.date, day.today ? 'today' : null, day.star ? 'star' : null, day.mood]
                      .filter(Boolean)
                      .join(', ')
              }
              disabled={empty || !onDayPress}
              onPress={() => onDayPress?.(day.date)}
              style={{
                width: `${100 / 7}%`,
                aspectRatio: 1,
                padding: 2,
              }}
            >
              <View
                style={{
                  flex: 1,
                  borderRadius: 10,
                  borderWidth: day.today ? 2 : empty ? 0 : 1,
                  borderColor: day.today ? t.outline : t.ring,
                  backgroundColor: empty ? 'transparent' : day.today ? t.c1 : t.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Nunito_700Bold',
                    fontSize: 12,
                    color: t.text,
                  }}
                >
                  {dayNum}
                </Text>
                {day.star ? (
                  <View
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: 2.5,
                      backgroundColor: t.c3,
                      borderWidth: 1,
                      borderColor: t.outline,
                    }}
                  />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
