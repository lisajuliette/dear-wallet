import { Pressable, ScrollView, Text, View } from 'react-native';

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

/** Horizontal tray with count badges; placed stickers are dashed at 55% opacity. */
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
      {items.map((item) => {
        const placed = !!item.placed || item.count <= 0;
        return (
          <Pressable
            key={item.id}
            testID={`tray-sticker-${item.id}`}
            accessibilityRole="button"
            accessibilityLabel={`${item.id}, ${item.count} left`}
            disabled={placed}
            onPress={() => onSelect?.(item.id)}
            style={{
              width: 76,
              height: 84,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: t.outline,
              borderStyle: placed ? 'dashed' : 'solid',
              backgroundColor: t.surface,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: placed ? 0.55 : 1,
            }}
          >
            <Sticker id={item.id} size={58} />
            {!placed && item.count > 0 ? (
              <View
                style={{
                  position: 'absolute',
                  right: -6,
                  top: -8,
                  paddingHorizontal: 6,
                  borderRadius: 999,
                  borderWidth: 2,
                  borderColor: t.outline,
                  backgroundColor: t.c3,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'PixelifySans_600SemiBold',
                    fontSize: 12,
                    color: t.text,
                  }}
                >
                  x{item.count}
                </Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
