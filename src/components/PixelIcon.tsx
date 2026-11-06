import { View } from 'react-native';

import { PIXEL_ICONS, type PixelIconName } from '@/components/pixelIcons';
import { useTokens } from '@/theme';

type PixelIconProps = {
  name: PixelIconName;
  size?: number;
  /** Outline stroke uses currentColor; optional card-token fill is left to the SVG art. */
  color?: string;
  accessibilityLabel?: string;
};

export function PixelIcon({ name, size = 24, color, accessibilityLabel }: PixelIconProps) {
  const t = useTokens();
  const Icon = PIXEL_ICONS[name];
  const stroke = color ?? t.text;

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? name}
      style={{ width: size, height: size }}
    >
      <Icon width={size} height={size} color={stroke} />
    </View>
  );
}
