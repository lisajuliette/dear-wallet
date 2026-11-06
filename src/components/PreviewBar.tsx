import { Pressable, Text, View } from 'react-native';

import { useTokens, type PaletteKey, palettes } from '@/theme';

type PreviewBarProps = {
  palette: PaletteKey;
  unlockText: string;
  onRevert: () => void;
  accessibilityLabel?: string;
};

/** Settings try-on bar: shows unlock copy and a revert action. */
export function PreviewBar({
  palette,
  unlockText,
  onRevert,
  accessibilityLabel = 'palette preview',
}: PreviewBarProps) {
  const t = useTokens();
  const name = palettes[palette].name;

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={{
        borderRadius: 16,
        borderWidth: 2,
        borderColor: t.outline,
        backgroundColor: t.surface,
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 14, color: t.text }}>
          trying {name}
        </Text>
        <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 12, color: t.text }}>
          {unlockText}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Revert palette"
        onPress={onRevert}
        style={{
          minHeight: 44,
          paddingHorizontal: 12,
          borderRadius: 999,
          borderWidth: 2,
          borderColor: t.outline,
          backgroundColor: t.btn,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 13, color: t.btnText }}>
          revert
        </Text>
      </Pressable>
    </View>
  );
}
