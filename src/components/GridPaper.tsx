import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Pattern, Path, Rect } from 'react-native-svg';

import { useTokens } from '@/theme';

const CELL = 22;

type GridPaperProps = {
  accessibilityLabel?: string;
};

/** 22 pt grid overlay using the palette `grid` token. */
export function GridPaper({ accessibilityLabel = 'grid paper background' }: GridPaperProps) {
  const t = useTokens();

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      accessibilityLabel={accessibilityLabel}
      testID="grid-paper"
      style={StyleSheet.absoluteFill}
    >
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id="gridPaper" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
            <Path d={`M ${CELL} 0 L 0 0 0 ${CELL}`} fill="none" stroke={t.grid} strokeWidth={1} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#gridPaper)" />
      </Svg>
    </View>
  );
}
