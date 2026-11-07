import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { PillButton, RetroWindow } from '@/components';
import { db } from '@/db/client';
import { completeLog } from '@/features/log/completeLog';
import { OnboardingChrome, markOnboarded } from '@/features/onboarding';
import { parsePadInput } from '@/lib/money';
import { useTokens } from '@/theme';

const CHIPS = [
  { name: 'bubble tea', cents: 600, fill: 'c5' as const },
  { name: 'phone case', cents: 2400, fill: 'c3' as const },
  { name: 'lip gloss', cents: 1400, fill: 'c4' as const },
];

function dollarsFromCents(cents: number): string {
  return (cents / 100).toFixed(cents % 100 === 0 ? 0 : 2);
}

export default function FirstLogScreen() {
  const t = useTokens();
  const { height } = useWindowDimensions();
  const compact = height < 740;
  const [name, setName] = useState('');
  const [amountText, setAmountText] = useState('');
  const [saving, setSaving] = useState(false);

  const amountCents = parsePadInput(amountText.replace(/^\$/, ''));
  const canSave = name.trim().length > 0 && amountCents != null && amountCents > 0 && !saving;

  const finishHome = async () => {
    await markOnboarded(db);
    router.replace('/(tabs)');
  };

  const save = async () => {
    if (!canSave || amountCents == null) return;
    setSaving(true);
    try {
      const result = await completeLog({
        kind: 'kept',
        name: name.trim(),
        amountCents,
        note: null,
        category: null,
      });
      await markOnboarded(db);
      router.replace({
        pathname: '/reward',
        params: {
          itemId: result.itemId,
          kind: result.kind,
          amountCents: String(result.amountCents ?? 0),
          monthCents: String(result.monthCents),
          starAwarded: result.starAwarded ? '1' : '0',
          starCount: String(result.starCount),
          stickerId: result.stickerId ?? '',
          rare: result.rare ? '1' : '0',
        },
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <OnboardingChrome step={2} onSkip={() => void finishHome()} accessibilityLabel="First log">
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <View style={{ alignItems: 'center', marginTop: compact ? 12 : 24, gap: 4 }}>
          <Text
            style={{
              fontFamily: 'Pacifico_400Regular',
              fontSize: 34,
              color: t.text,
              lineHeight: 46,
            }}
          >
            log ur first nvm
          </Text>
          <Text
            style={{
              fontFamily: 'Nunito_800ExtraBold',
              fontSize: 15,
              color: t.text,
              textAlign: 'center',
            }}
          >
            something u wanted lately but didn&apos;t get?
          </Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <RetroWindow title="FIRST_NVM.EXE" titleBar="pink">
            <View style={{ gap: 12, paddingVertical: 4 }}>
              <Text
                style={{
                  fontFamily: 'PixelifySans_500Medium',
                  fontSize: 12,
                  letterSpacing: 0.72,
                  color: t.text,
                }}
              >
                WHAT WAS IT?
              </Text>
              <TextInput
                accessibilityLabel="What was it"
                value={name}
                onChangeText={setName}
                placeholder="a cropped hoodie"
                placeholderTextColor={t.soft}
                style={{
                  height: 48,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: t.outline,
                  backgroundColor: t.surface,
                  paddingHorizontal: 14,
                  fontFamily: 'Nunito_800ExtraBold',
                  fontSize: 16,
                  color: t.text,
                }}
              />
              <Text
                style={{
                  fontFamily: 'PixelifySans_500Medium',
                  fontSize: 12,
                  letterSpacing: 0.72,
                  color: t.text,
                }}
              >
                HOW MUCH?
              </Text>
              <TextInput
                accessibilityLabel="How much"
                value={amountText}
                onChangeText={setAmountText}
                keyboardType="decimal-pad"
                placeholder="$40"
                placeholderTextColor={t.soft}
                style={{
                  height: 60,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: t.outline,
                  backgroundColor: t.surface,
                  paddingHorizontal: 14,
                  fontFamily: 'PixelifySans_600SemiBold',
                  fontSize: 34,
                  color: t.text,
                }}
              />
              <Text
                style={{
                  fontFamily: 'PixelifySans_500Medium',
                  fontSize: 12,
                  letterSpacing: 0.72,
                  color: t.text,
                }}
              >
                OR TAP ONE
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {CHIPS.map((chip) => (
                    <Pressable
                      key={chip.name}
                      accessibilityRole="button"
                      accessibilityLabel={`${chip.name} ${dollarsFromCents(chip.cents)} dollars`}
                      onPress={() => {
                        setName(chip.name);
                        setAmountText(dollarsFromCents(chip.cents));
                      }}
                      style={{
                        height: 44,
                        paddingHorizontal: 14,
                        borderRadius: 22,
                        borderWidth: 2,
                        borderColor: t.outline,
                        backgroundColor: t[chip.fill],
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: t.text }}
                      >
                        {chip.name} · ${dollarsFromCents(chip.cents)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          </RetroWindow>
        </View>

        <View style={{ flex: 1 }} />
        <View style={{ gap: 4, marginBottom: 20 }}>
          <PillButton label="nvm!" disabled={!canSave} onPress={() => void save()} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="I'll log later"
            onPress={() => void finishHome()}
            style={{ minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text
              style={{
                fontFamily: 'Nunito_800ExtraBold',
                fontSize: 14,
                color: t.text,
                textDecorationLine: 'underline',
              }}
            >
              nothing comes to mind? i&apos;ll log later
            </Text>
          </Pressable>
        </View>
      </View>
    </OnboardingChrome>
  );
}
