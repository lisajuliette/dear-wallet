import { useEffect, useState } from 'react';
import { AccessibilityInfo, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Screen } from '@/components';
import { CoinCloudLogo } from '@/features/onboarding/CoinCloudLogo';
import { useSettingsStore } from '@/features/rewards/settingsStore';
import { useTokens } from '@/theme';

type SplashHandOffProps = {
  onDone: () => void;
};

/** First in-app frame after the native splash: coin settles, then fades out. */
export function SplashHandOff({ onDone }: SplashHandOffProps) {
  const t = useTokens();
  const { height } = useWindowDimensions();
  const compact = height < 740;
  const reducedSetting = useSettingsStore((s) => s.reducedMotion);
  const [osReduced, setOsReduced] = useState(false);
  const reduced = reducedSetting || osReduced;

  const coinY = useSharedValue(-28);
  const opacity = useSharedValue(1);

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setOsReduced);
  }, []);

  useEffect(() => {
    if (reduced) {
      opacity.value = withTiming(0, { duration: 200 }, (finished) => {
        if (finished) runOnJS(onDone)();
      });
      return;
    }

    coinY.value = withSequence(
      withTiming(6, { duration: 420, easing: Easing.out(Easing.cubic) }),
      withTiming(-4, { duration: 140 }),
      withTiming(0, { duration: 120 }),
    );
    opacity.value = withDelay(
      520,
      withTiming(0, { duration: 400 }, (finished) => {
        if (finished) runOnJS(onDone)();
      }),
    );
  }, [reduced, coinY, opacity, onDone]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const coinStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: coinY.value }],
  }));

  return (
    <Screen accessibilityLabel="Splash">
      <Animated.View style={[{ flex: 1 }, fadeStyle]}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            paddingTop: compact ? 150 : 232,
            gap: 18,
          }}
        >
          <Animated.View style={coinStyle}>
            <CoinCloudLogo size={compact ? 200 : 248} />
          </Animated.View>
          <View style={{ alignItems: 'center', gap: 2 }}>
            <Text
              style={{
                fontFamily: 'Pacifico_400Regular',
                fontSize: 46,
                color: t.text,
                lineHeight: 60,
              }}
            >
              Dear Wallet
            </Text>
            <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 17, color: t.text }}>
              a lil diary for the money u kept ♡
            </Text>
          </View>
        </View>

        <View style={{ alignItems: 'center', paddingBottom: compact ? 32 : 52 }}>
          <View
            style={{
              height: 32,
              paddingHorizontal: 14,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.surface,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Text
              style={{
                fontFamily: 'PixelifySans_500Medium',
                fontSize: 13,
                letterSpacing: 0.78,
                color: t.text,
              }}
            >
              PRIVATE BY DEFAULT
            </Text>
          </View>
        </View>
      </Animated.View>
    </Screen>
  );
}
