import { Text, View } from 'react-native';

import { useTokens } from '@/theme';

type DigitCounterProps = {
  value: number;
  changed?: number[];
  accessibilityLabel?: string;
};

/** Boxed Pixelify digits. `changed` indices get a soft highlight (roll cue). */
export function DigitCounter({ value, changed = [], accessibilityLabel }: DigitCounterProps) {
  const t = useTokens();
  const digits = Math.max(0, value).toString().split('');
  const label = accessibilityLabel ?? String(value);

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={label}
      style={{ flexDirection: 'row', gap: 4 }}
    >
      {digits.map((digit, index) => {
        const isChanged = changed.includes(index);
        return (
          <View
            key={`${index}-${digit}`}
            style={{
              minWidth: 28,
              height: 36,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: isChanged ? t.c3 : t.surface,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 4,
            }}
          >
            <Text style={{ fontFamily: 'PixelifySans_600SemiBold', fontSize: 20, color: t.text }}>
              {digit}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
