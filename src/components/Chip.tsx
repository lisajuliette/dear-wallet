import { Pressable, Text, type PressableProps } from 'react-native';

import { useTokens } from '@/theme';

type ChipProps = Omit<PressableProps, 'children'> & {
  label: string;
  selected?: boolean;
  dashed?: boolean;
  accessibilityLabel?: string;
};

/** Filter / amount chip. Selected uses btn fill + btnText. */
export function Chip({
  label,
  selected = false,
  dashed = false,
  disabled,
  accessibilityLabel,
  style,
  ...rest
}: ChipProps) {
  const t = useTokens();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected, disabled: !!disabled }}
      disabled={disabled}
      style={(state) => [
        {
          minHeight: 44,
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 999,
          borderWidth: 2,
          borderColor: t.outline,
          borderStyle: dashed && !selected ? 'dashed' : 'solid',
          backgroundColor: selected ? t.btn : t.surface,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : state.pressed ? 0.92 : 1,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      <Text
        style={{
          fontFamily: 'Nunito_800ExtraBold',
          fontSize: 14,
          color: selected ? t.btnText : t.text,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
