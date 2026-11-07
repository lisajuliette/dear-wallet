import { Pressable, Text, View } from 'react-native';

import { PixelIcon } from '@/components/PixelIcon';
import { formatCents } from '@/lib/money';
import { useTokens, type TokenName } from '@/theme';

type ListRowProps = {
  title: string;
  meta?: string;
  amountCents?: number;
  fill?: TokenName;
  onPress?: () => void;
  accessibilityLabel?: string;
  testID?: string;
};

/** List row with sparkle bullet, radius 15, optional amount. */
export function ListRow({
  title,
  meta,
  amountCents,
  fill = 'c5',
  onPress,
  accessibilityLabel,
  testID,
}: ListRowProps) {
  const t = useTokens();
  const label =
    accessibilityLabel ??
    [title, meta, amountCents !== undefined ? formatCents(amountCents) : null]
      .filter(Boolean)
      .join(', ');

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={!onPress}
      onPress={onPress}
      style={{
        minHeight: 56,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: t.outline,
        backgroundColor: t[fill],
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <PixelIcon name="sparkle" size={18} color={t.outline} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 15, color: t.text }}>{title}</Text>
        {meta ? (
          <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 12, color: t.text }}>{meta}</Text>
        ) : null}
      </View>
      {amountCents !== undefined ? (
        <Text style={{ fontFamily: 'PixelifySans_600SemiBold', fontSize: 16, color: t.text }}>
          {formatCents(amountCents)}
        </Text>
      ) : null}
    </Pressable>
  );
}
