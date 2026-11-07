import { type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Screen } from '@/components';
import { useTokens } from '@/theme';

type OnboardingChromeProps = {
  step: 0 | 1 | 2;
  onSkip: () => void;
  children: ReactNode;
  accessibilityLabel: string;
};

export function OnboardingChrome({
  step,
  onSkip,
  children,
  accessibilityLabel,
}: OnboardingChromeProps) {
  const t = useTokens();

  return (
    <Screen accessibilityLabel={accessibilityLabel}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingTop: 8,
            gap: 6,
            minHeight: 44,
          }}
        >
          <View
            accessibilityLabel={`Step ${step + 1} of 3`}
            style={{ flexDirection: 'row', gap: 6, flex: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={{
                  width: i === step ? 40 : 18,
                  height: 10,
                  borderRadius: 5,
                  borderWidth: 2,
                  borderColor: t.outline,
                  backgroundColor: i <= step ? t.btn : t.surface,
                }}
              />
            ))}
          </View>
          <Pressable
            testID="onboarding-skip"
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
            onPress={onSkip}
            hitSlop={8}
            style={{ minHeight: 44, minWidth: 44, justifyContent: 'center', paddingHorizontal: 14 }}
          >
            <Text
              style={{
                fontFamily: 'Nunito_900Black',
                fontSize: 15,
                color: t.text,
                textDecorationLine: 'underline',
              }}
            >
              skip
            </Text>
          </Pressable>
        </View>
        {children}
      </View>
    </Screen>
  );
}
