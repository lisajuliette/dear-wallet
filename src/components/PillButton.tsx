import { Pressable, Text, View, type PressableProps } from 'react-native';

import { useTokens } from '@/theme';

type Variant = 'primary' | 'secondary' | 'surface' | 'dashed' | 'link';
type Size = 'lg' | 'md';

type PillButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: Variant;
  size?: Size;
  accessibilityLabel?: string;
};

/** Chunky pill button. Disabled state always uses dashed surface. */
export function PillButton({
  label,
  variant = 'primary',
  size = 'lg',
  disabled,
  accessibilityLabel,
  style,
  ...rest
}: PillButtonProps) {
  const t = useTokens();
  const height = size === 'lg' ? 60 : 44;
  const radius = height / 2;
  const fontSize = size === 'lg' ? 22 : 15;
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
    <View style={{ marginBottom: showShadow ? shadowOffset : 0 }}>
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
        style={(state) => [
          {
            height: isLink ? undefined : height,
            minHeight: isLink ? 44 : height,
            borderRadius: radius,
            borderWidth: isLink ? 0 : 2,
            borderColor: t.outline,
            borderStyle,
            backgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: size === 'lg' ? 24 : 18,
            opacity: state.pressed && !disabled ? 0.92 : 1,
          },
          typeof style === 'function' ? style(state) : style,
        ]}
        {...rest}
      >
        <Text
          style={{
            color,
            fontFamily: 'Nunito_900Black',
            fontSize,
            textDecorationLine: isLink ? 'underline' : 'none',
          }}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
}
