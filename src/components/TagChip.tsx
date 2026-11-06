import { Pressable, Text } from 'react-native';

import { PixelIcon } from '@/components/PixelIcon';
import { useTokens } from '@/theme';

type TagChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/** Optional tag chip: dashed when off, solid with check when on. */
export function TagChip({ label, selected = false, onPress, accessibilityLabel }: TagChipProps) {
  const t = useTokens();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{
        height: 44,
        minHeight: 44,
        paddingHorizontal: selected ? 10 : 14,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: t.outline,
        borderStyle: selected ? 'solid' : 'dashed',
        backgroundColor: selected ? t.c4 : t.surface,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {selected ? <PixelIcon name="check" size={16} color={t.text} /> : null}
      <Text
        style={{
          fontFamily: selected ? 'Nunito_900Black' : 'Nunito_800ExtraBold',
          fontSize: 14,
          color: t.text,
        }}
      >
        {selected ? label : `+ ${label}`}
      </Text>
    </Pressable>
  );
}
