import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { AccessibilityInfo, Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { PillButton, PixelIcon, RetroWindow, ScriptText } from '@/components';
import { comparisonFor } from '@/features/rewards/comparisons';
import type { MilestoneDef } from '@/features/rewards/milestonesCatalog';
import { nextMilestone } from '@/features/rewards/milestonesCatalog';
import { useSettingsStore } from '@/features/rewards/settingsStore';
import { HOLO, useTokens } from '@/theme';

export type MilestoneScreenProps = {
  def: MilestoneDef;
  achievedIds: string[];
  onYay: () => void;
  onSaveCard: () => void;
  onOpenCollection: () => void;
};

export function MilestoneScreen({
  def,
  achievedIds,
  onYay,
  onSaveCard,
  onOpenCollection,
}: MilestoneScreenProps) {
  const t = useTokens();
  const { height } = useWindowDimensions();
  const compact = height < 740;
  const hapticsOn = useSettingsStore((s) => s.haptics);
  const reducedSetting = useSettingsStore((s) => s.reducedMotion);
  const unlock = def.unlock;
  const next = nextMilestone([...achievedIds, def.id]);
  const tag = unlock ? 'NEW MILESTONE + UNLOCK ✦' : 'NEW MILESTONE ✦';

  const scale = useSharedValue(reducedSetting ? 1 : 0.7);
  const glow = useSharedValue(reducedSetting ? 1 : 0);
  const slide = useSharedValue(reducedSetting ? 0 : 24);
  const fade = useSharedValue(reducedSetting ? 1 : 0);
  const buttonsOn = useSharedValue(reducedSetting ? 1 : 0);

  useEffect(() => {
    let reducedOs = false;
    void AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      reducedOs = v;
    });
    if (hapticsOn) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const reduced = reducedSetting || reducedOs;
    if (reduced) {
      scale.value = 1;
      glow.value = 1;
      slide.value = 0;
      fade.value = withTiming(1, { duration: 200 });
      buttonsOn.value = 1;
      return;
    }

    scale.value = withSpring(1, { stiffness: 220, damping: 14, mass: 1 });
    glow.value = withTiming(1, { duration: 400 });
    fade.value = withTiming(1, { duration: 300 });
    slide.value = withTiming(0, { duration: 350 });
    buttonsOn.value = withTiming(1, { duration: 200 });
  }, [buttonsOn, fade, glow, hapticsOn, reducedSetting, scale, slide]);

  const winStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: fade.value,
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value * 0.85 }));
  const bodyStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: slide.value }],
  }));
  const btnStyle = useAnimatedStyle(() => ({ opacity: buttonsOn.value }));

  return (
    <View
      style={{ flex: 1, backgroundColor: t.scrim }}
      accessibilityLabel={unlock ? 'milestone with unlock' : 'milestone'}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            left: 40,
            right: 40,
            top: compact ? 70 : 100,
            height: 220,
            borderRadius: 999,
            backgroundColor: HOLO[0],
          },
          glowStyle,
        ]}
      />

      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: compact ? 56 : 72, gap: 12 }}>
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              paddingHorizontal: 12,
              paddingVertical: 3,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.surface,
              fontFamily: 'PixelifySans_500Medium',
              fontSize: 13,
              letterSpacing: 0.78,
              color: t.text,
              overflow: 'hidden',
            }}
          >
            {tag}
          </Text>
        </View>

        <Animated.View style={winStyle}>
          <RetroWindow title="MILESTONE.EXE" titleBar="holo" accessibilityLabel="milestone window">
            <View style={{ alignItems: 'center', paddingVertical: 8, gap: 4 }}>
              <Text
                style={{
                  fontFamily: 'PixelifySans_600SemiBold',
                  fontSize: compact ? 68 : 84,
                  color: t.text,
                  lineHeight: compact ? 72 : 88,
                }}
              >
                {def.big}
              </Text>
              <Text
                style={{
                  fontFamily: 'PixelifySans_500Medium',
                  fontSize: 16,
                  letterSpacing: 1.2,
                  color: t.text,
                }}
              >
                {def.unit}
              </Text>
            </View>
          </RetroWindow>
        </Animated.View>

        <Animated.View style={[{ alignItems: 'center', gap: 4 }, bodyStyle]}>
          <ScriptText size={compact ? 28 : 32}>{def.headline}</ScriptText>
        </Animated.View>

        <Animated.View
          style={[
            {
              borderRadius: 20,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.c5,
              padding: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              shadowColor: t.shadow,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
            },
            bodyStyle,
          ]}
        >
          <View style={{ flex: 1, gap: 2 }}>
            <Text
              style={{
                fontFamily: 'PixelifySans_500Medium',
                fontSize: 12,
                letterSpacing: 0.72,
                color: t.text,
              }}
            >
              {"THAT'S LIKE"}
            </Text>
            <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 17, color: t.text }}>
              {comparisonFor(def.id)}
            </Text>
          </View>
        </Animated.View>

        {unlock ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="open collection unlock"
            onPress={onOpenCollection}
            style={{
              borderRadius: 20,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.surface,
              padding: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              shadowColor: t.shadow,
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 1,
              shadowRadius: 0,
            }}
          >
            <View
              style={{
                width: 68,
                height: 68,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: t.outline,
                backgroundColor: t.c3,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PixelIcon name="lock" size={30} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text
                style={{
                  alignSelf: 'flex-start',
                  paddingHorizontal: 8,
                  borderRadius: 999,
                  borderWidth: 2,
                  borderColor: t.outline,
                  backgroundColor: t.c4,
                  fontFamily: 'PixelifySans_500Medium',
                  fontSize: 11,
                  letterSpacing: 0.66,
                  color: t.text,
                  overflow: 'hidden',
                }}
              >
                U UNLOCKED
              </Text>
              <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 17, color: t.text }}>
                {unlock.kind === 'pack' ? unlock.label : `${unlock.label} faceplate`}
              </Text>
              <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 13, color: t.text }}>
                {unlock.kind === 'pack'
                  ? `${unlock.count} new stickers, waiting in ur album`
                  : 'waiting in settings · swap anytime'}
              </Text>
            </View>
          </Pressable>
        ) : (
          <View style={{ alignItems: 'center', gap: 6 }}>
            <Text
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
                borderWidth: 2,
                borderColor: t.outline,
                backgroundColor: t.c3,
                fontFamily: 'Nunito_800ExtraBold',
                fontSize: 14,
                color: t.text,
                overflow: 'hidden',
              }}
            >
              +1 milestone in ur collection
            </Text>
            {next ? (
              <Text
                style={{
                  fontFamily: 'Nunito_700Bold',
                  fontSize: 13,
                  color: t.text,
                  textAlign: 'center',
                }}
              >
                {`next up: ${next.big}. no rush, it'll come ♡`}
              </Text>
            ) : null}
          </View>
        )}

        <Animated.View
          style={[
            { flexDirection: 'row', gap: 10, marginTop: 'auto', paddingBottom: 28 },
            btnStyle,
          ]}
        >
          <View style={{ flex: 1 }}>
            <PillButton label="save card" variant="secondary" onPress={onSaveCard} />
          </View>
          <View style={{ flex: 1 }}>
            <PillButton label="yay ♡" onPress={onYay} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
