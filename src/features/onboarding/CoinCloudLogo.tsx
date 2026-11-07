import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import { useTokens } from '@/theme';

type CoinCloudLogoProps = {
  size?: number;
  accessibilityLabel?: string;
  /** Extra translate for the coin group (settle animation). */
  coinOffsetY?: number;
};

/** Coin-in-cloud mark used on Splash and Onboarding. */
export function CoinCloudLogo({
  size = 248,
  accessibilityLabel = 'Dear Wallet logo',
  coinOffsetY = 0,
}: CoinCloudLogoProps) {
  const t = useTokens();
  return (
    <View accessibilityLabel={accessibilityLabel} accessible style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="90 100 860 840">
        <Circle cx={512} cy={450} r={250} fill={t.shadow} />
        <G transform={`translate(0 ${coinOffsetY})`}>
          <Circle cx={512} cy={430} r={250} fill={t.c3} stroke={t.outline} strokeWidth={18} />
          <Circle
            cx={512}
            cy={430}
            r={204}
            fill="none"
            stroke={t.outline}
            strokeWidth={9}
            strokeDasharray="28 20"
            strokeLinecap="round"
          />
          <Ellipse
            cx={398}
            cy={292}
            rx={54}
            ry={26}
            fill={t.surface}
            opacity={0.9}
            transform="rotate(-35 398 292)"
          />
          <G transform="translate(393 296) scale(17)">
            <Path
              d="M3.5 2.5h2v1h1v1h1v-1h1v-1h2v1h1v3h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-3h1z"
              fill={t.c1}
              stroke={t.outline}
              strokeWidth={1}
            />
          </G>
        </G>
        <Path
          d="M250 900C160 900 120 830 150 770C100 720 140 630 230 640C240 560 340 520 410 570C450 500 580 490 620 570C680 520 790 545 800 630C890 620 940 720 880 780C920 840 860 900 780 900Z"
          fill={t.shadow}
          transform="translate(0 20)"
        />
        <Path
          d="M250 900C160 900 120 830 150 770C100 720 140 630 230 640C240 560 340 520 410 570C450 500 580 490 620 570C680 520 790 545 800 630C890 620 940 720 880 780C920 840 860 900 780 900Z"
          fill={t.surface}
          stroke={t.outline}
          strokeWidth={18}
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}
