import { type ReactNode } from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useTokens } from '@/theme';

type Variant = 'primary' | 'secondary' | 'surface' | 'dashed' | 'link';
type Size = 'lg' | 'md';

type PillButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: Variant;
  size?: Size;
  /** Stretch to parent width (Quick log, Milestone row, forms). Default true. */
  fullWidth?: boolean;
  icon?: ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Chunky pill button. Disabled state always uses dashed surface. */
export function PillButton({
  label,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  icon,
  disabled,
  accessibilityLabel,
  style,
  ...rest
}: PillButtonProps) {
  const t = useTokens();
  // Same box as the home "go" and decorate "done" buttons: 44 tall, 18 of side padding.
  // lg is the wider action (nvm, yay) at the canvas 56.
  const height = size === 'lg' ? 56 : 44;
  const radius = height / 2;
  const fontSize = size === 'lg' ? 18 : 15;
  const padX = 18;
  const effectiveVariant = disabled ? 'dashed' : variant;

  let backgroundColor = t.btn;
  let color = t.btnText;
  let borderStyle: 'solid' | 'dashed' = 'solid';
  let showShadow = false;
  const shadowOffset = size === 'lg' ? 4 : 3;

  switch (effectiveVariant) {
    case 'primary':
      backgroundColor = t.btn;
      color = t.btnText;
      showShadow = true;
      break;
    case 'secondary':
      backgroundColor = t.c3;
      color = t.text;
      showShadow = true;
      break;
    case 'surface':
      backgroundColor = t.surface;
      color = t.text;
      showShadow = true;
      break;
    case 'dashed':
      backgroundColor = t.surface;
      color = t.text;
      // iOS drops dashed borders, which left these pills looking like bare text.
      borderStyle = 'solid';
      break;
    case 'link':
      backgroundColor = 'transparent';
      color = t.btn;
      borderStyle = 'solid';
      break;
  }

  const isLink = effectiveVariant === 'link';

  const box = {
    height: isLink ? undefined : height,
    minHeight: isLink ? 44 : height,
    width: fullWidth ? ('100%' as const) : undefined,
    alignSelf: fullWidth ? ('stretch' as const) : ('center' as const),
    borderRadius: radius,
    borderWidth: isLink ? 0 : 2,
    borderColor: t.outline,
    borderStyle,
    backgroundColor,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: isLink ? 8 : padX,
    zIndex: 1,
  };

  return (
    <View
      style={[
        {
          marginBottom: showShadow ? shadowOffset : 0,
          alignSelf: fullWidth ? 'stretch' : 'center',
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
    >
      {showShadow ? (
        <View
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{
            position: 'absolute',
            zIndex: -1,
            top: shadowOffset,
            right: 0,
            bottom: -shadowOffset,
            left: 0,
            borderRadius: radius,
            backgroundColor: t.shadow,
          }}
        />
      ) : null}
      <View style={box}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityState={{ disabled: !!disabled }}
          disabled={disabled}
          {...rest}
          style={({ pressed }) => [
            {
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed && !disabled ? 0.92 : 1,
            },
          ]}
        >
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {icon}
            <Text
              numberOfLines={1}
              style={{
                color,
                fontFamily: 'Nunito_900Black',
                fontSize,
                textAlign: 'center',
                textAlignVertical: 'center',
                textDecorationLine: isLink ? 'underline' : 'none',
                includeFontPadding: false,
              }}
            >
              {label}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
