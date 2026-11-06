import { Text, View } from 'react-native';

import { useTokens, type TokenName } from '@/theme';

type StatusChipProps = {
  label: string;
  fill?: TokenName;
  accessibilityLabel?: string;
};

/** Small Pixelify status pill (kept / bought after all / savings). */
export function StatusChip({ label, fill = 'c4', accessibilityLabel }: StatusChipProps) {
  const t = useTokens();

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? label}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: t.outline,
        backgroundColor: t[fill],
      }}
    >
      <Text
        style={{
          fontFamily: 'PixelifySans_500Medium',
          fontSize: 12,
          letterSpacing: 0.72,
          color: t.text,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
