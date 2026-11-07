import { Pressable, Text, View } from 'react-native';

import { CloudCard, PixelIcon } from '@/components';
import { useTokens } from '@/theme';

type PromptCardProps = {
  text: string;
  height?: number;
  onShuffle: () => void;
};

/** Today's prompt, with a round control that asks for a different one. */
export function PromptCard({ text, height = 86, onShuffle }: PromptCardProps) {
  const t = useTokens();

  return (
    <CloudCard fill="c2" height={height} accessibilityLabel="Today's prompt">
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text
            style={{
              fontFamily: 'PixelifySans_500Medium',
              fontSize: 12,
              letterSpacing: 0.72,
              color: t.text,
            }}
          >
            {"TODAY'S PROMPT"}
          </Text>
          <Text
            accessibilityLiveRegion="polite"
            style={{
              fontFamily: 'Nunito_900Black',
              fontSize: 16,
              lineHeight: 21,
              color: t.text,
            }}
          >
            {text}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Show a different prompt"
          onPress={onShuffle}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            borderWidth: 2,
            borderColor: t.outline,
            backgroundColor: t.surface,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 3,
          }}
        >
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 3,
              height: 44,
              borderRadius: 22,
              backgroundColor: t.shadow,
            }}
          />
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PixelIcon name="shuffle" size={20} />
          </View>
        </Pressable>
      </View>
    </CloudCard>
  );
}
