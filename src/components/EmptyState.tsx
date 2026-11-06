import { Text, View } from 'react-native';

import { Sticker } from '@/components/Sticker';
import type { StickerId } from '@/components/stickerAssets';
import { useTokens } from '@/theme';

type EmptyStateProps = {
  sticker: StickerId;
  title: string;
  body: string;
  accessibilityLabel?: string;
};

/** Friendly empty state — never “nothing here”. */
export function EmptyState({ sticker, title, body, accessibilityLabel }: EmptyStateProps) {
  const t = useTokens();

  return (
    <View
      accessibilityLabel={accessibilityLabel ?? title}
      style={{ alignItems: 'center', gap: 12, paddingVertical: 24, paddingHorizontal: 20 }}
    >
      <Sticker id={sticker} size={96} />
      <Text
        style={{
          fontFamily: 'Nunito_900Black',
          fontSize: 18,
          color: t.text,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontFamily: 'Nunito_700Bold',
          fontSize: 14,
          color: t.text,
          textAlign: 'center',
          lineHeight: 20,
        }}
      >
        {body}
      </Text>
    </View>
  );
}
