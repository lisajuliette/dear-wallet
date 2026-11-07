import { router } from 'expo-router';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';

import { Faceplate, PillButton, PixelIcon } from '@/components';
import { db } from '@/db/client';
import { OnboardingChrome, markOnboarded } from '@/features/onboarding';
import { savePalette } from '@/features/settings/prefs';
import { palettes, useTokens, type PaletteKey } from '@/theme';
import { useThemeStore } from '@/theme/store';

const FREE: PaletteKey[] = ['cloud', 'lilac', 'peachfuzz'];
const LOCKED: PaletteKey[] = ['peachsoda', 'orchid', 'midnight'];

export default function PaletteScreen() {
  const t = useTokens();
  const { height } = useWindowDimensions();
  const compact = height < 740;
  const selected = useThemeStore((s) => s.palette);
  const scale = compact ? 1 : 1.2;

  const skip = async () => {
    await markOnboarded(db);
    router.replace('/(tabs)');
  };

  const pick = async (key: PaletteKey) => {
    await savePalette(db, key);
  };

  return (
    <OnboardingChrome step={1} onSkip={() => void skip()} accessibilityLabel="Choose a palette">
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <View style={{ alignItems: 'center', marginTop: compact ? 12 : 24, gap: 2 }}>
          <Text
            style={{
              fontFamily: 'Pacifico_400Regular',
              fontSize: 34,
              color: t.text,
              lineHeight: 46,
            }}
          >
            pick ur faceplate
          </Text>
          <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: t.text }}>
            tap one to try it. swap anytime in settings
          </Text>
        </View>

        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 6,
          }}
        >
          {FREE.map((key) => {
            const on = key === selected;
            return (
              <Pressable
                key={key}
                testID={`palette-${key}`}
                accessibilityRole="button"
                accessibilityLabel={palettes[key].name}
                accessibilityState={{ selected: on }}
                onPress={() => void pick(key)}
                style={{ flex: 1, alignItems: 'center', gap: 8 }}
              >
                <View
                  style={{
                    padding: 3,
                    borderRadius: 30,
                    borderWidth: 3,
                    borderColor: on ? t.btn : 'transparent',
                  }}
                >
                  <View style={{ width: 84 * scale, height: 150 * scale }}>
                    <View
                      style={{
                        transform: [{ scale }],
                        transformOrigin: 'top left',
                        width: 84,
                        height: 150,
                      }}
                    >
                      <Faceplate palette={key} selected={on} />
                    </View>
                  </View>
                  {on ? (
                    <View
                      style={{
                        position: 'absolute',
                        right: -4,
                        bottom: -4,
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        borderWidth: 2,
                        borderColor: t.outline,
                        backgroundColor: t.btn,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PixelIcon name="check" size={14} color={t.btnText} />
                    </View>
                  ) : null}
                </View>
                <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 14, color: t.text }}>
                  {palettes[key].name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View
          style={{
            marginTop: 20,
            borderRadius: 20,
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: t.outline,
            backgroundColor: t.surface,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {LOCKED.map((key) => (
              <View key={key} style={{ width: 42, height: 75, transform: [{ scale: 0.5 }] }}>
                <Faceplate palette={key} locked />
              </View>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: 'PixelifySans_500Medium',
                fontSize: 12,
                letterSpacing: 0.72,
                color: t.text,
              }}
            >
              3 MORE TO UNLOCK
            </Text>
            <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: t.text }}>
              they pop open as u log + write. lil surprises ✦
            </Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />
        <PillButton
          testID="onboarding-this-one"
          label="this one ♡"
          onPress={() => router.push('/(onboarding)/first-log')}
          style={{ marginBottom: 24 }}
        />
      </View>
    </OnboardingChrome>
  );
}
