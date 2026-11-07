import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Defs, Pattern, Rect } from 'react-native-svg';

type CheckerBarProps = {
  a: string;
  b: string;
  /** Unique within the screen. SVG pattern ids are document-global. */
  patternId: string;
  height?: number;
};

/** Full-width checker. Percentage SVG widths collapse, so the bar measures itself. */
export function CheckerBar({ a, b, patternId, height = 44 }: CheckerBarProps) {
  const [width, setWidth] = useState(0);

  return (
    <View
      pointerEvents="none"
      onLayout={(event) => {
        const next = Math.round(event.nativeEvent.layout.width);
        if (next > 0 && next !== width) setWidth(next);
      }}
      style={{ position: 'absolute', left: 0, right: 0, top: 0, height }}
    >
      {width > 0 ? (
        <Svg width={width} height={height}>
          <Defs>
            <Pattern id={patternId} width={12} height={12} patternUnits="userSpaceOnUse">
              <Rect width={6} height={6} fill={a} />
              <Rect x={6} y={6} width={6} height={6} fill={a} />
              <Rect x={6} width={6} height={6} fill={b} />
              <Rect y={6} width={6} height={6} fill={b} />
            </Pattern>
          </Defs>
          <Rect width={width} height={height} fill={`url(#${patternId})`} />
        </Svg>
      ) : null}
    </View>
  );
}
