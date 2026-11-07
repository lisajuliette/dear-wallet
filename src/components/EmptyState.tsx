import { Text, View } from 'react-native';

import { Sticker } from '@/components/Sticker';
import type { StickerId } from '@/components/stickerAssets';
import { useTokens } from '@/theme';

type EmptyStateProps = {
  sticker: StickerId;
  title: string;
  body: string;
  accessibilityLabel?: string;
  /** Diary's empty month is a 40 pt sticker in a short window. */
  stickerSize?: number;
  dense?: boolean;
};

/** Friendly empty state — never “nothing here”. */
export function EmptyState({
  sticker,
  title,
  body,
  accessibilityLabel,
  stickerSize = 96,
  dense = false,
}: EmptyStateProps) {
  const t = useTokens();

  return (
    <View
      accessibilityLabel={accessibilityLabel ?? title}
      style={{
        alignItems: 'center',
        gap: dense ? 4 : 12,
        paddingVertical: dense ? 8 : 24,
        paddingHorizontal: 20,
      }}
    >
      <Sticker id={sticker} size={stickerSize} />
      <Text
        style={{
          fontFamily: 'Nunito_900Black',
          fontSize: dense ? 15 : 18,
          color: t.text,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontFamily: 'Nunito_700Bold',
          fontSize: dense ? 13 : 14,
          color: t.text,
          textAlign: 'center',
          lineHeight: dense ? 18 : 20,
        }}
      >
        {body}
      </Text>
    </View>
  );
}
