import * as Haptics from 'expo-haptics';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';

import { type PadKey } from '@/lib/amountPad';
import { useTokens } from '@/theme';

const KEYS: { key: PadKey; label: string }[] = [
  { key: '1', label: '1' },
  { key: '2', label: '2' },
  { key: '3', label: '3' },
  { key: '4', label: '4' },
  { key: '5', label: '5' },
  { key: '6', label: '6' },
  { key: '7', label: '7' },
  { key: '8', label: '8' },
  { key: '9', label: '9' },
  { key: '.', label: 'Decimal point' },
  { key: '0', label: '0' },
  { key: 'back', label: 'Delete' },
];

type AmountPadProps = {
  onKey: (key: PadKey) => void;
  compact?: boolean;
  hapticsEnabled?: boolean;
  accessibilityLabel?: string;
  /** Time uses a colon in place of the decimal key. */
  variant?: 'amount' | 'time';
};

/** 3 × 4 money pad. Keys are c2 with Pixelify labels and a hard shadow. */
export function AmountPad({
  onKey,
  compact: compactProp,
  hapticsEnabled = true,
  accessibilityLabel = 'amount pad',
  variant = 'amount',
}: AmountPadProps) {
  const t = useTokens();
  const { height } = useWindowDimensions();
  const compact = compactProp ?? height < 740;
  const keyHeight = compact ? 40 : 46;

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}
    >
      {KEYS.map(({ key, label }) => {
        const display = key === 'back' ? '⌫' : key === '.' ? (variant === 'time' ? ':' : '.') : key;
        const spoken = variant === 'time' && key === '.' ? 'Colon' : label;
        return (
          <Pressable
            key={key}
            testID={`pad-key-${key}`}
            accessibilityRole="button"
            accessibilityLabel={spoken}
            onPress={() => {
              if (hapticsEnabled) {
                void Haptics.selectionAsync();
              }
              onKey(key);
            }}
            style={{
              width: '31%',
              flexGrow: 1,
              height: keyHeight,
              minHeight: 44,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.c2,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 3,
              shadowColor: t.shadow,
            }}
          >
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 3,
                right: 0,
                bottom: -3,
                left: 0,
                borderRadius: 16,
                backgroundColor: t.shadow,
                zIndex: -1,
              }}
            />
            <Text
              style={{
                fontFamily: 'PixelifySans_600SemiBold',
                fontSize: 22,
                color: t.text,
              }}
            >
              {display}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
