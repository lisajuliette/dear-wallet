import { type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useTokens } from '@/theme';

type PillToggleProps = {
  label: string;
  hint?: string;
  icon?: ReactNode;
  value: boolean;
  onChange: (value: boolean) => void;
  accessibilityLabel?: string;
  disabled?: boolean;
};

/** Settings-style switch row. Track is btn when on, c2 when off. */
export function PillToggle({
  label,
  hint,
  icon,
  value,
  onChange,
  accessibilityLabel,
  disabled,
}: PillToggleProps) {
  const t = useTokens();

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ checked: value, disabled: !!disabled }}
      disabled={disabled}
      onPress={() => onChange(!value)}
      style={{
        minHeight: hint ? 56 : 52,
        paddingVertical: hint ? 8 : 0,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: t.outline,
        backgroundColor: t.surface,
        paddingLeft: icon ? 10 : 14,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon}
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: t.text }}>
          {label}
        </Text>
        {hint ? (
          <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 11, color: t.text }}>{hint}</Text>
        ) : null}
      </View>
      <View
        style={{
          width: 52,
          height: 30,
          borderRadius: 15,
          borderWidth: 2,
          borderColor: t.outline,
          backgroundColor: value ? t.btn : t.c2,
          padding: 2,
          justifyContent: 'center',
          alignItems: value ? 'flex-end' : 'flex-start',
        }}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            borderWidth: 2,
            borderColor: t.outline,
            backgroundColor: t.surface,
          }}
        />
      </View>
    </Pressable>
  );
}
