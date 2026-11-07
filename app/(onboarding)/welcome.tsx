import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { PillButton } from '@/components';
import { db } from '@/db/client';
import { CoinCloudLogo, OnboardingChrome, markOnboarded } from '@/features/onboarding';
import { saveChosenDisplayName } from '@/features/settings/displayName';
import { useTokens } from '@/theme';

const PROMISES = [
  { text: 'log a nvm in under 10 seconds', colorKey: 'c3' as const },
  { text: 'no streaks, no shame, ever', colorKey: 'c1' as const },
  { text: 'private by default ♡', colorKey: 'c5' as const },
];

export default function WelcomeScreen() {
  const t = useTokens();
  const { height } = useWindowDimensions();
  const compact = height < 740;
  const [name, setName] = useState('');

  const keepName = () => saveChosenDisplayName(db, name);

  const skip = async () => {
    await keepName();
    await markOnboarded(db);
    router.replace('/(tabs)');
  };

  return (
    <OnboardingChrome step={0} onSkip={() => void skip()} accessibilityLabel="Welcome">
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <View style={{ alignItems: 'center', marginTop: compact ? 24 : 40 }}>
          <CoinCloudLogo size={compact ? 150 : 220} />
        </View>
        <View style={{ alignItems: 'center', gap: 4, marginTop: 12 }}>
          <Text
            style={{
              fontFamily: 'Pacifico_400Regular',
              fontSize: 36,
              color: t.text,
              textAlign: 'center',
              lineHeight: 48,
            }}
          >
            hi, i&apos;m Dear Wallet
          </Text>
          <Text
            style={{
              fontFamily: 'Nunito_800ExtraBold',
              fontSize: 16,
              color: t.text,
              textAlign: 'center',
              lineHeight: 23,
            }}
          >
            a lil diary for the money u kept, and how it all feels
          </Text>
        </View>

        <View
          style={{
            marginTop: 20,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: t.outline,
            backgroundColor: t.surface,
            shadowColor: t.shadow,
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 1,
            shadowRadius: 0,
            paddingHorizontal: 14,
            paddingVertical: 4,
          }}
        >
          {PROMISES.map((p, i) => (
            <View
              key={p.text}
              style={{
                minHeight: 48,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                borderBottomWidth: i < 2 ? 2 : 0,
                borderStyle: i < 2 ? 'dashed' : 'solid',
                borderBottomColor: t.ring,
              }}
            >
              <Svg width={24} height={24} viewBox="0 0 24 24">
                <Path
                  d="M12 1C12.9 7.6 16.4 11.1 23 12C16.4 12.9 12.9 16.4 12 23C11.1 16.4 7.6 12.9 1 12C7.6 11.1 11.1 7.6 12 1Z"
                  fill={t[p.colorKey]}
                  stroke={t.outline}
                  strokeWidth={2}
                />
              </Svg>
              <Text
                style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: t.text, flex: 1 }}
              >
                {p.text}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ flex: 1, minHeight: 12 }} />
        <TextInput
          testID="onboarding-name"
          accessibilityLabel="Your name"
          value={name}
          onChangeText={setName}
          placeholder="what should i call u?"
          placeholderTextColor={t.text}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          maxLength={24}
          style={{
            height: 48,
            marginBottom: 12,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: t.outline,
            backgroundColor: t.surface,
            paddingHorizontal: 16,
            fontFamily: 'Nunito_800ExtraBold',
            fontSize: 16,
            color: t.text,
          }}
        />
        <PillButton
          testID="onboarding-lets-go"
          label="let's go ♡"
          onPress={() => {
            void keepName().then(() => router.push('/(onboarding)/palette'));
          }}
          style={{ marginBottom: 24 }}
        />
      </View>
    </OnboardingChrome>
  );
}
