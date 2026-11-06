import { Text, View } from 'react-native';

import { HardShadow } from '@/components/HardShadow';
import { formatCents } from '@/lib/money';
import { useTokens } from '@/theme';

type Bar = {
  label: string;
  cents: number;
};

type BarChartProps = {
  bars: Bar[];
  /** When true, skip the outer HardShadow card (for nesting inside RetroWindow). */
  embedded?: boolean;
  accessibilityLabel?: string;
};

/** Pastel bars cycling c1–c5. Zero values render as a 6 pt dashed stub. */
export function BarChart({
  bars,
  embedded = false,
  accessibilityLabel = 'bar chart',
}: BarChartProps) {
  const t = useTokens();
  const fills = [t.c1, t.c2, t.c3, t.c4, t.c5];
  const max = Math.max(...bars.map((b) => b.cents), 1);

  const body = (
    <View
      accessibilityLabel={accessibilityLabel}
      style={{
        height: embedded ? 140 : 170,
        borderRadius: embedded ? 0 : 20,
        borderWidth: embedded ? 0 : 2,
        borderColor: t.outline,
        backgroundColor: embedded ? 'transparent' : t.surface,
        paddingHorizontal: embedded ? 0 : 16,
        paddingTop: embedded ? 8 : 14,
        paddingBottom: embedded ? 0 : 10,
        flexDirection: 'row',
        gap: 8,
      }}
    >
      {bars.map((bar, index) => {
        const zero = bar.cents <= 0;
        const height = zero
          ? 6
          : Math.max(12, Math.round((bar.cents / max) * (embedded ? 100 : 92)));
        return (
          <View
            key={`${bar.label}-${index}`}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}
          >
            <Text style={{ fontFamily: 'PixelifySans_600SemiBold', fontSize: 11, color: t.text }}>
              {zero ? '' : formatCents(bar.cents)}
            </Text>
            <View
              style={{
                width: '100%',
                height,
                borderRadius: 9,
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4,
                borderWidth: 2,
                borderColor: t.outline,
                borderStyle: zero ? 'dashed' : 'solid',
                backgroundColor: zero ? 'transparent' : (fills[index % fills.length] ?? t.c3),
              }}
            />
            <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 11, color: t.text }}>
              {bar.label}
            </Text>
          </View>
        );
      })}
    </View>
  );

  if (embedded) return body;
  return (
    <HardShadow radius={20} accessibilityLabel={accessibilityLabel}>
      {body}
    </HardShadow>
  );
}
