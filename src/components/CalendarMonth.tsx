import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { CalendarDay, type CalendarDayData } from '@/components/CalendarDay';
import { Sticker } from '@/components/Sticker';
import { useTokens } from '@/theme';

export type { CalendarDayData as CalendarDay } from '@/components/CalendarDay';

type CalendarMonthProps = {
  days: CalendarDayData[];
  onDayPress?: (date: string) => void;
  accessibilityLabel?: string;
};

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

function LegendStar() {
  const t = useTokens();
  return (
    <View
      style={{
        width: 16,
        height: 16,
        borderRadius: 5,
        backgroundColor: t.c3,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width={9} height={9} viewBox="0 0 24 24">
        <Path
          d="M12 1C12.9 7.6 16.4 11.1 23 12C16.4 12.9 12.9 16.4 12 23C11.1 16.4 7.6 12.9 1 12C7.6 11.1 11.1 7.6 12 1Z"
          fill={t.surface}
          stroke={t.outline}
          strokeWidth={3}
        />
      </Svg>
    </View>
  );
}

/** 7 × 6 diary month grid, Monday first. 36 pt cells, 3 pt rows, 4 pt columns. */
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
    <View accessibilityLabel={accessibilityLabel} style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row' }}>
        {WEEKDAYS.map((day, index) => (
          <Text
            key={`${day}-${index}`}
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: 'PixelifySans_500Medium',
              fontSize: 11,
              letterSpacing: 0.66,
              color: t.text,
            }}
          >
            {day}
          </Text>
        ))}
      </View>
      <View accessibilityRole="grid" style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 3 }}>
        {cells.slice(0, 42).map((day) => (
          <CalendarDay key={day.date} day={day} onPress={onDayPress} />
        ))}
      </View>
      <View
        style={{
          marginTop: 2,
          paddingTop: 6,
          borderTopWidth: 2,
          borderStyle: 'dashed',
          borderColor: t.ring,
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 14,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Sticker id="mood-proud" size={16} />
          <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 11, color: t.soft }}>
            wrote a page
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <LegendStar />
          <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 11, color: t.soft }}>
            showed up
          </Text>
        </View>
      </View>
    </View>
  );
}
