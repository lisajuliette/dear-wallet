import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { AccessibilityInfo, Pressable, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Coin, PixelIcon, RetroWindow, ScriptText, SparkleBurst, Sticker } from '@/components';
import type { StickerId } from '@/components/stickerAssets';
import { useSettingsStore } from '@/features/rewards/settingsStore';
import { formatCents } from '@/lib/money';
import { HOLO, useTokens } from '@/theme';

const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);

export type RewardMomentProps = {
  amountCents: number | null;
  monthCents: number;
  starAwarded: boolean;
  starCount: number;
  stickerId: StickerId | null;
  rare: boolean;
  onClose: () => void;
};

export function RewardMoment({
  amountCents,
  monthCents,
  starAwarded,
  starCount,
  stickerId,
  rare,
  onClose,
}: RewardMomentProps) {
  const t = useTokens();
  const { height } = useWindowDimensions();
  const compact = height < 740;
  const hapticsOn = useSettingsStore((s) => s.haptics);
  const reducedSetting = useSettingsStore((s) => s.reducedMotion);

  const veil = useSharedValue(0);
  const coinY = useSharedValue(-40);
  const coinScale = useSharedValue(0.7);
  const chipY = useSharedValue(12);
  const stickerScale = useSharedValue(0.85);
  const sparkle = useSharedValue(0);
  const monthOpacity = useSharedValue(0);
  const holoX = useSharedValue(-90);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const osReduced = await AccessibilityInfo.isReduceMotionEnabled();
      if (cancelled) return;
      const reduced = reducedSetting || osReduced;

      if (hapticsOn) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      if (reduced) {
        veil.value = withTiming(1, { duration: 200 });
        coinY.value = 0;
        coinScale.value = 1;
        chipY.value = 0;
        stickerScale.value = 1;
        sparkle.value = 1;
        monthOpacity.value = 1;
        holoX.value = 0;
        return;
      }

      veil.value = withTiming(1, { duration: 200, easing: EASE });
      coinY.value = withSpring(0, { stiffness: 220, damping: 14, mass: 1 });
      coinScale.value = withSpring(1, { stiffness: 220, damping: 14, mass: 1 });
      sparkle.value = withDelay(180, withTiming(1, { duration: 320, easing: EASE }));
      monthOpacity.value = withDelay(200, withTiming(1, { duration: 500, easing: EASE }));
      chipY.value = withDelay(300, withTiming(0, { duration: 400, easing: EASE }));
      stickerScale.value = withDelay(700, withTiming(1, { duration: 220, easing: EASE }));
      holoX.value = withDelay(920, withTiming(70, { duration: 580, easing: EASE }));
    })();
    return () => {
      cancelled = true;
    };
  }, [
    chipY,
    coinScale,
    coinY,
    hapticsOn,
    holoX,
    monthOpacity,
    reducedSetting,
    sparkle,
    stickerScale,
    veil,
  ]);

  const veilStyle = useAnimatedStyle(() => ({ opacity: veil.value }));
  const coinStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: coinY.value }, { scale: coinScale.value }],
  }));
  const chipStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: chipY.value }, { rotate: '8deg' }],
  }));
  const stickerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: stickerScale.value }],
  }));
  const sparkleStyle = useAnimatedStyle(() => ({ opacity: sparkle.value }));
  const monthStyle = useAnimatedStyle(() => ({ opacity: monthOpacity.value }));
  const holoStyle = useAnimatedStyle(() => ({
    opacity: 0.55,
    transform: [{ translateX: holoX.value }],
  }));

  const amountLabel =
    amountCents !== null && amountCents > 0
      ? `${formatCents(amountCents)} stays with u ♡`
      : 'u showed up today ♡';
  const plusChip = amountCents !== null && amountCents > 0 ? `+${formatCents(amountCents)}` : '+♡';

  return (
    <Pressable
      testID="reward-close"
      accessibilityRole="button"
      accessibilityLabel="Reward. Tap anywhere to close"
      onPress={onClose}
      style={{ flex: 1, backgroundColor: t.scrim }}
    >
      <Animated.View
        style={[{ flex: 1, alignItems: 'center', paddingTop: compact ? 40 : 72 }, veilStyle]}
      >
        <View style={{ alignItems: 'center', transform: [{ scale: compact ? 0.8 : 1 }] }}>
          {rare ? (
            <Animated.View
              pointerEvents="none"
              style={[
                {
                  position: 'absolute',
                  width: 80,
                  height: 220,
                  borderRadius: 40,
                  backgroundColor: HOLO[2],
                  top: 40,
                },
                holoStyle,
              ]}
            />
          ) : null}
          <Animated.View style={sparkleStyle}>
            <SparkleBurst count={9} radius={52} />
          </Animated.View>
          <Animated.View style={[{ marginTop: -120, alignItems: 'center' }, coinStyle]}>
            <Coin size={120} />
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  right: -36,
                  top: -8,
                  height: 34,
                  paddingHorizontal: 12,
                  borderRadius: 17,
                  borderWidth: 2,
                  borderColor: t.outline,
                  backgroundColor: t.c4,
                  justifyContent: 'center',
                },
                chipStyle,
              ]}
            >
              <Text style={{ fontFamily: 'PixelifySans_600SemiBold', fontSize: 18, color: t.text }}>
                {plusChip}
              </Text>
            </Animated.View>
          </Animated.View>
        </View>

        <View style={{ alignItems: 'center', marginTop: compact ? 8 : 16, gap: 4 }}>
          <ScriptText size={46}>nvm!</ScriptText>
          <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 19, color: t.text }}>
            {amountLabel}
          </Text>
        </View>

        <Animated.View style={[{ alignItems: 'center', marginTop: 18, gap: 6 }, monthStyle]}>
          <Text
            style={{
              fontFamily: 'PixelifySans_500Medium',
              fontSize: 12,
              letterSpacing: 0.72,
              color: t.text,
            }}
          >
            KEPT THIS MONTH
          </Text>
          <View
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.c1,
            }}
          >
            <Text style={{ fontFamily: 'PixelifySans_600SemiBold', fontSize: 30, color: t.text }}>
              {formatCents(monthCents)}
            </Text>
          </View>
        </Animated.View>

        {!stickerId && starAwarded ? (
          <View style={{ alignItems: 'center', marginTop: 20, gap: 10 }}>
            <View
              style={{
                height: 44,
                paddingHorizontal: 18,
                borderRadius: 22,
                borderWidth: 2,
                borderColor: t.outline,
                backgroundColor: t.surface,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <PixelIcon name="sparkle" size={22} />
              <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 16, color: t.text }}>
                +1 star on ur calendar
              </Text>
            </View>
            <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 14, color: t.text }}>
              {starCount} stars so far. they never reset ♡
            </Text>
          </View>
        ) : null}

        {stickerId ? (
          <Animated.View
            style={[{ marginTop: 20, width: '100%', paddingHorizontal: 24 }, stickerStyle]}
          >
            <RetroWindow
              title={rare ? 'RARE DROP!!' : 'NEW STICKER!'}
              titleBar={rare ? 'holo' : 'pink'}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <Sticker id={stickerId} size={96} />
                <View style={{ flex: 1, gap: 6 }}>
                  {rare ? (
                    <Text
                      style={{
                        fontFamily: 'PixelifySans_500Medium',
                        fontSize: 12,
                        letterSpacing: 0.72,
                        color: t.text,
                      }}
                    >
                      RARE · HOLO
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: 'PixelifySans_500Medium',
                        fontSize: 12,
                        letterSpacing: 0.72,
                        color: t.text,
                      }}
                    >
                      COMMON
                    </Text>
                  )}
                  <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 16, color: t.text }}>
                    {stickerId.replace(/^(common|rare-holo)-/, '').replace(/-/g, ' ')}
                  </Text>
                  <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 13, color: t.text }}>
                    added to ur album. stick it on a diary page anytime
                  </Text>
                </View>
              </View>
            </RetroWindow>
          </Animated.View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}
