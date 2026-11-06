import { View } from 'react-native';

import { STICKER_ASSETS, isRareSticker, type StickerId } from '@/components/stickerAssets';

type StickerProps = {
  id: StickerId;
  size?: number;
  accessibilityLabel?: string;
};

/** Renders a sticker SVG by id. Rare stickers already include holo treatment in the art. */
export function Sticker({ id, size = 72, accessibilityLabel }: StickerProps) {
  const Asset = STICKER_ASSETS[id];
  const rare = isRareSticker(id);
  const label = accessibilityLabel ?? (rare ? `${id} rare sticker` : `${id} sticker`);

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={label}
      style={{ width: size, height: size }}
    >
      <Asset width={size} height={size} />
    </View>
  );
}
