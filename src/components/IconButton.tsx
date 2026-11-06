import { type ReactNode } from 'react';
import { Pressable, View, type PressableProps } from 'react-native';

import { hitSlopForSize } from '@/lib/hitSlop';
import { useTokens } from '@/theme';

const SIZE = 44;

type IconButtonProps = Omit<PressableProps, 'children'> & {
  icon: ReactNode;
  accessibilityLabel: string;
  size?: number;
};

/** 44 × 44 icon button with surface fill and outline. Always meets the 44 pt hit area. */
export function IconButton({
  icon,
  accessibilityLabel,
  size = SIZE,
  disabled,
  style,
  ...rest
}: IconButtonProps) {
  const t = useTokens();
  const hitSlop = hitSlopForSize(size, size);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      hitSlop={hitSlop}
      style={(state) => [
        {
          width: size,
          height: size,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: t.outline,
          backgroundColor: t.surface,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : state.pressed ? 0.9 : 1,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      <View pointerEvents="none">{icon}</View>
    </Pressable>
  );
}
