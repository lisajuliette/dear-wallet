import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useTokens } from '@/theme';

type SparkleBurstProps = {
  count?: number;
  radius?: number;
  accessibilityLabel?: string;
};

/** Sparkles around a centre point; angles skip the bottom so text stays readable. */
export function SparkleBurst({
  count = 9,
  radius = 48,
  accessibilityLabel = 'sparkle burst',
}: SparkleBurstProps) {
  const t = useTokens();
  const fills = [t.c1, t.c2, t.c3, t.c4, t.c5];
  // Skip bottom 90° arc so copy underneath stays clear.
  const start = (-Math.PI * 5) / 6;
  const end = (Math.PI * 5) / 6;
  const size = radius * 2 + 40;

  const sparks = Array.from({ length: count }, (_, i) => {
    const angle = start + ((end - start) * i) / Math.max(count - 1, 1);
    const x = size / 2 + Math.cos(angle) * radius - 10;
    const y = size / 2 + Math.sin(angle) * radius - 10;
    return { x, y, fill: fills[i % fills.length] ?? t.c3, s: 16 + (i % 3) * 4 };
  });

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      accessibilityLabel={accessibilityLabel}
      style={{ width: size, height: size }}
    >
      {sparks.map((spark, index) => (
        <Svg
          key={index}
          width={spark.s}
          height={spark.s}
          viewBox="0 0 24 24"
          style={{ position: 'absolute', left: spark.x, top: spark.y }}
        >
          <Path
            d="M12 1C12.9 7.6 16.4 11.1 23 12C16.4 12.9 12.9 16.4 12 23C11.1 16.4 7.6 12.9 1 12C7.6 11.1 11.1 7.6 12 1Z"
            fill={spark.fill}
            stroke={t.outline}
            strokeWidth={1.8}
          />
        </Svg>
      ))}
    </View>
  );
}
