import type { Insets } from 'react-native';

const MIN_HIT = 44;

/**
 * Returns hitSlop that grows a control to at least 44 × 44 pt, centred on the drawn size.
 */
export function hitSlopForSize(width: number, height: number, min: number = MIN_HIT): Insets {
  const horizontal = Math.max(0, (min - width) / 2);
  const vertical = Math.max(0, (min - height) / 2);
  return {
    top: vertical,
    bottom: vertical,
    left: horizontal,
    right: horizontal,
  };
}
