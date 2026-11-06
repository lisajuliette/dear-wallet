import { View } from 'react-native';

import { HOLO, useTokens } from '@/theme';

type SegmentBarProps = {
  value: number;
  holo?: boolean;
  accessibilityLabel?: string;
};

/** 12-segment progress bar. Filled segments use btn (or holo colours). */
export function SegmentBar({
  value,
  holo = false,
  accessibilityLabel = 'progress',
}: SegmentBarProps) {
  const t = useTokens();
  const clamped = Math.max(0, Math.min(1, value));
  const filled = Math.round(clamped * 12);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={{ flexDirection: 'row', gap: 4 }}
    >
      {Array.from({ length: 12 }, (_, i) => {
        const on = i < filled;
        const fill = holo ? (HOLO[i % HOLO.length] ?? t.btn) : t.btn;
        return (
          <View
            key={i}
            style={{
              flex: 1,
              height: 14,
              borderRadius: 4,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: on ? fill : t.surface,
            }}
          />
        );
      })}
    </View>
  );
}
