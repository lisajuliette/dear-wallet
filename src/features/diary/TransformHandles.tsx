import { Pressable, View, type Insets } from 'react-native';

import { PixelIcon } from '@/components/PixelIcon';
import { hitSlopForSize } from '@/lib/hitSlop';
import { useTokens } from '@/theme';

import type { ReactNode } from 'react';

const HANDLE = 34;

type TransformHandlesProps = {
  onRemove: () => void;
  onRotatePress?: () => void;
  onResizePress?: () => void;
};

/** Dashed selection chrome with remove / rotate / resize handles (34 pt + hitSlop 5). */
export function TransformHandles({
  onRemove,
  onRotatePress,
  onResizePress,
}: TransformHandlesProps) {
  const t = useTokens();
  const hitSlop = hitSlopForSize(HANDLE, HANDLE);

  return (
    <View
      pointerEvents="box-none"
      style={{
        ...({ position: 'absolute', top: -8, right: -8, bottom: -8, left: -8 } as const),
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: t.outline,
        borderRadius: 12,
      }}
    >
      <Handle
        accessibilityLabel="Remove sticker"
        hitSlop={hitSlop}
        onPress={onRemove}
        style={{ position: 'absolute', top: -HANDLE / 2, left: -HANDLE / 2 }}
      >
        <PixelIcon name="trash" size={16} />
      </Handle>
      <Handle
        accessibilityLabel="Rotate sticker"
        hitSlop={hitSlop}
        onPress={onRotatePress}
        style={{ position: 'absolute', top: -HANDLE / 2, right: -HANDLE / 2 }}
      >
        <PixelIcon name="shuffle" size={16} />
      </Handle>
      <Handle
        accessibilityLabel="Resize sticker"
        hitSlop={hitSlop}
        onPress={onResizePress}
        style={{ position: 'absolute', bottom: -HANDLE / 2, right: -HANDLE / 2 }}
      >
        <PixelIcon name="resize" size={16} />
      </Handle>
    </View>
  );
}

function Handle({
  children,
  onPress,
  accessibilityLabel,
  hitSlop,
  style,
}: {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel: string;
  hitSlop: Insets;
  style: object;
}) {
  const t = useTokens();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={hitSlop}
      onPress={onPress}
      style={[
        {
          width: HANDLE,
          height: HANDLE,
          borderRadius: HANDLE / 2,
          borderWidth: 2,
          borderColor: t.outline,
          backgroundColor: t.surface,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}
