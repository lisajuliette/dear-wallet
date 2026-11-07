import { Pressable, Text, View } from 'react-native';

import { useTokens } from '@/theme';

type Option<T extends string> = {
  label: string;
  value: T;
};

type SegmentedProps<T extends string> = {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
  /** Card fill for the selected option. Tally and Recap use c3; Quick log uses c1. */
  selectedFill?: 'c1' | 'c3';
};

/** 2–3 option segmented control. Selected option gets fill + 2 pt outline. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel = 'segmented control',
  selectedFill = 'c1',
}: SegmentedProps<T>) {
  const t = useTokens();

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      style={{
        flexDirection: 'row',
        gap: 4,
        padding: 4,
        borderRadius: 26,
        borderWidth: 2,
        borderColor: t.outline,
        backgroundColor: t.surface,
      }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={{
              flex: 1,
              height: 40,
              minHeight: 44,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: selected ? t.outline : 'transparent',
              backgroundColor: selected ? t[selectedFill] : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 8,
            }}
          >
            <Text
              style={{
                fontFamily: selected ? 'Nunito_900Black' : 'Nunito_800ExtraBold',
                fontSize: 15,
                color: t.text,
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
