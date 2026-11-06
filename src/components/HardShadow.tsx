import { type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { useTokens } from '@/theme';

type HardShadowProps = ViewProps & {
  children: ReactNode;
  offset?: number;
  radius?: number;
  accessibilityLabel?: string;
};

/** Offset sibling shadow with no blur (outline colour at 30%). */
export function HardShadow({
  children,
  offset = 5,
  radius = 20,
  style,
  accessibilityLabel,
  ...rest
}: HardShadowProps) {
  const t = useTokens();

  return (
    <View style={style} accessibilityLabel={accessibilityLabel} {...rest}>
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{
          position: 'absolute',
          top: offset,
          right: 0,
          bottom: -offset,
          left: 0,
          borderRadius: radius,
          backgroundColor: t.shadow,
        }}
      />
      <View style={{ borderRadius: radius, overflow: 'hidden' }}>{children}</View>
    </View>
  );
}
