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
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Chunky pill button. Disabled state always uses dashed surface. */
export function PillButton({
  label,
  variant = 'primary',
  size = 'lg',
  fullWidth = true,
  disabled,
  accessibilityLabel,
  style,
  ...rest
}: PillButtonProps) {
  const t = useTokens();
  const height = size === 'lg' ? 60 : 44;
  const radius = height / 2;
  const fontSize = size === 'lg' ? 22 : 15;
  const padX = size === 'lg' ? 28 : 18;
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
      break;
    case 'surface':
      backgroundColor = t.surface;
      color = t.text;
      showShadow = true;
      break;
    case 'dashed':
      backgroundColor = t.surface;
      color = t.text;
      borderStyle = 'dashed';
      break;
    case 'link':
      backgroundColor = 'transparent';
      color = t.btn;
      borderStyle = 'solid';
      break;
  }

  const isLink = effectiveVariant === 'link';

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
            top: shadowOffset,
            right: 0,
            bottom: -shadowOffset,
            left: 0,
            borderRadius: radius,
            backgroundColor: t.shadow,
          }}
        />
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled: !!disabled }}
        disabled={disabled}
        style={(state) => ({
          height: isLink ? undefined : height,
          minHeight: isLink ? 44 : height,
          width: fullWidth ? '100%' : undefined,
          alignSelf: fullWidth ? 'stretch' : 'center',
          borderRadius: radius,
          borderWidth: isLink ? 0 : 2,
          borderColor: t.outline,
          borderStyle,
          backgroundColor,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: isLink ? 8 : padX,
          opacity: state.pressed && !disabled ? 0.92 : 1,
        })}
        {...rest}
      >
        <Text
          numberOfLines={1}
          style={{
            color,
            fontFamily: 'Nunito_900Black',
            fontSize,
            lineHeight: fontSize + 4,
            textAlign: 'center',
            textDecorationLine: isLink ? 'underline' : 'none',
            // Avoid Android font padding shoving glyphs into the pill curve.
            includeFontPadding: false,
            flexShrink: 1,
          }}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
}
