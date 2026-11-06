import { Pressable, Text, View } from 'react-native';

import { Sticker } from '@/components/Sticker';
import type { StickerId } from '@/components/stickerAssets';
import { useTokens } from '@/theme';

export type Mood = 'proud' | 'chill' | 'meh' | 'tempted' | 'wobbly';

const MOODS: { id: Mood; sticker: StickerId; label: string }[] = [
  { id: 'proud', sticker: 'mood-proud', label: 'proud' },
  { id: 'chill', sticker: 'mood-chill', label: 'chill' },
  { id: 'meh', sticker: 'mood-meh', label: 'meh' },
  { id: 'tempted', sticker: 'mood-tempted', label: 'tempted' },
  { id: 'wobbly', sticker: 'mood-wobbly', label: 'wobbly' },
];

type MoodPickerProps = {
  value: Mood | null;
  onChange: (mood: Mood) => void;
  accessibilityLabel?: string;
};

export function MoodPicker({
  value,
  onChange,
  accessibilityLabel = 'mood picker',
}: MoodPickerProps) {
  const t = useTokens();

  return (
    <View accessibilityLabel={accessibilityLabel} style={{ flexDirection: 'row', gap: 6 }}>
      {MOODS.map((mood) => {
        const selected = value === mood.id;
        return (
          <Pressable
            key={mood.id}
            accessibilityRole="button"
            accessibilityLabel={mood.label}
            accessibilityState={{ selected }}
            onPress={() => onChange(mood.id)}
            style={{
              flex: 1,
              height: 74,
              minHeight: 74,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: selected ? t.outline : 'transparent',
              backgroundColor: selected ? t.c1 : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Sticker id={mood.sticker} size={44} />
            <Text
              style={{
                fontFamily: selected ? 'Nunito_900Black' : 'Nunito_800ExtraBold',
                fontSize: 11,
                color: t.text,
              }}
            >
              {mood.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
