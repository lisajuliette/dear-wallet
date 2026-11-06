import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { useTokens } from '@/theme';

type CoinProps = {
  size?: number;
  accessibilityLabel?: string;
};

/** c3 coin with dashed inner ring and a pixel heart. */
export function Coin({ size = 56, accessibilityLabel = 'coin' }: CoinProps) {
  const t = useTokens();
  const r = size / 2;

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle cx={r} cy={r} r={r - 1} fill={t.c3} stroke={t.outline} strokeWidth={2} />
        <Circle
          cx={r}
          cy={r}
          r={r - 10}
          fill="none"
          stroke={t.outline}
          strokeWidth={2}
          strokeDasharray="4 3"
        />
        <Path
          d={`M${r - 6} ${r - 4}h4v2h2v2h2v-2h2v-2h4v2h2v6h-2v2h-2v2h-2v2h-2v2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-6h2z`}
          fill={t.c1}
          stroke={t.outline}
          strokeWidth={1}
        />
      </Svg>
    </View>
  );
}
