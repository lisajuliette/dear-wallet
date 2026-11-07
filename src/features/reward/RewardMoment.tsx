import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { AccessibilityInfo, Pressable, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Coin, PixelIcon, RetroWindow, ScriptText, SparkleBurst, Sticker } from '@/components';
import type { StickerId } from '@/components/stickerAssets';
import { useSettingsStore } from '@/features/rewards/settingsStore';
import { formatCents } from '@/lib/money';
import { HOLO, useTokens } from '@/theme';

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
  const chipY = useSharedValue(8);
  const stickerScale = useSharedValue(0.85);

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
        return;
      }

      veil.value = withTiming(1, { duration: 200 });
      coinY.value = withSpring(0, { stiffness: 220, damping: 14, mass: 1 });
      coinScale.value = withSpring(1, { stiffness: 220, damping: 14, mass: 1 });
      chipY.value = withTiming(-12, { duration: 400 });
      stickerScale.value = withSpring(1, { stiffness: 220, damping: 14, mass: 1 });
    })();
    return () => {
      cancelled = true;
    };
  }, [chipY, coinScale, coinY, hapticsOn, reducedSetting, stickerScale, veil]);

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
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                width: 220,
                height: 220,
                borderRadius: 110,
                backgroundColor: HOLO[0],
                opacity: 0.55,
                top: 40,
              }}
            />
          ) : null}
          <SparkleBurst count={9} radius={52} />
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

        <View style={{ alignItems: 'center', marginTop: 18, gap: 6 }}>
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
        </View>

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
