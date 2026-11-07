import { Pressable, ScrollView } from 'react-native';

import { Sticker } from '@/components/Sticker';
import type { StickerId } from '@/components/stickerAssets';
import { useTokens } from '@/theme';

type TrayItem = {
  id: StickerId;
  count: number;
  placed?: boolean;
};

type StickerTrayProps = {
  items: TrayItem[];
  onSelect?: (id: StickerId) => void;
  accessibilityLabel?: string;
};

/** Horizontal tray. Owned stickers can be placed as many times as you like. */
export function StickerTray({
  items,
  onSelect,
  accessibilityLabel = 'sticker tray',
}: StickerTrayProps) {
  const t = useTokens();

  return (
    <ScrollView
      horizontal
      accessibilityLabel={accessibilityLabel}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10, paddingVertical: 8 }}
    >
      {items.map((item) => (
        <Pressable
          key={item.id}
          testID={`tray-sticker-${item.id}`}
          accessibilityRole="button"
          accessibilityLabel={item.id.replace(/-/g, ' ')}
          onPress={() => onSelect?.(item.id)}
          style={{
            width: 76,
            height: 84,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: t.outline,
            backgroundColor: t.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Sticker id={item.id} size={58} />
        </Pressable>
      ))}
    </ScrollView>
  );
}
