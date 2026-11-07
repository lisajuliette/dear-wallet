import { Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import type { Mood } from '@/components/MoodPicker';
import { Sticker } from '@/components/Sticker';
import type { StickerId } from '@/components/stickerAssets';
import { useTokens } from '@/theme';

export type CalendarDayData = {
  date: string;
  star?: boolean;
  mood?: Mood | null;
  today?: boolean;
  selected?: boolean;
  future?: boolean;
};

const MOOD_STICKER: Record<Mood, StickerId> = {
  proud: 'mood-proud',
  chill: 'mood-chill',
  meh: 'mood-meh',
  tempted: 'mood-tempted',
  wobbly: 'mood-wobbly',
};

type CalendarDayProps = {
  day: CalendarDayData;
  onPress?: (date: string) => void;
};

function StarMark({ fill, size }: { fill: string; size: number }) {
  const t = useTokens();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 1C12.9 7.6 16.4 11.1 23 12C16.4 12.9 12.9 16.4 12 23C11.1 16.4 7.6 12.9 1 12C7.6 11.1 11.1 7.6 12 1Z"
        fill={fill}
        stroke={t.outline}
        strokeWidth={2.6}
      />
    </Svg>
  );
}

/** One calendar cell. Selecting it does not open the journal. */
export function CalendarDay({ day, onPress }: CalendarDayProps) {
  const t = useTokens();
  const empty = day.date.startsWith('pad-');
  const dayNum = empty ? '' : day.date.slice(-2).replace(/^0/, '');
  const future = day.future === true;
  const selected = day.selected === true && !future;

  if (empty) {
    return <View style={{ width: `${100 / 7}%`, height: 36 }} />;
  }

  return (
    <View style={{ width: `${100 / 7}%`, height: 36, paddingHorizontal: 2 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={[
          day.date,
          day.today ? 'today' : null,
          day.mood ? `wrote a page, mood ${day.mood}` : null,
          day.star ? 'showed up' : null,
          future ? 'not yet' : null,
          selected ? 'selected' : null,
        ]
          .filter(Boolean)
          .join(', ')}
        accessibilityState={{ disabled: future, selected }}
        disabled={future || !onPress}
        onPress={() => onPress?.(day.date)}
        style={{ flex: 1, opacity: future ? 0.4 : 1 }}
      >
        <View
          style={{
            flex: 1,
            borderRadius: 11,
            borderWidth: 2,
            borderColor: selected
              ? day.today
                ? t.btn
                : t.outline
              : day.today
                ? t.btn
                : 'transparent',
            backgroundColor: selected ? t.btn : day.star ? t.c3 : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {selected ? (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 3,
                bottom: -3,
                borderRadius: 11,
                backgroundColor: t.shadow,
                zIndex: -1,
              }}
            />
          ) : null}
          {dayNum ? (
            <Text
              style={{
                fontFamily: day.mood ? 'PixelifySans_500Medium' : 'Nunito_800ExtraBold',
                fontSize: day.mood ? 10 : day.star ? 12 : 13,
                color: selected ? t.btnText : t.text,
                lineHeight: day.mood ? 11 : 14,
              }}
            >
              {dayNum}
            </Text>
          ) : null}
          {day.mood ? <Sticker id={MOOD_STICKER[day.mood]} size={18} /> : null}
          {day.star ? <StarMark fill={selected ? t.c3 : t.surface} size={11} /> : null}
        </View>
      </Pressable>
    </View>
  );
}
