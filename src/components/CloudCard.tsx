import { type ReactNode, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { cloudPath, useTokens, type TokenName } from '@/theme';

type CloudCardProps = {
  fill: TokenName;
  height: number;
  children?: ReactNode;
  accessibilityLabel?: string;
};

/** Cloud-shaped card with hard shadow offset of 4 pt. */
export function CloudCard({
  fill,
  height,
  children,
  accessibilityLabel = 'cloud card',
}: CloudCardProps) {
  const t = useTokens();
  const [width, setWidth] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const path = width > 0 ? cloudPath(width, height) : '';
  const fillColor = t[fill];

  return (
    <View
      onLayout={onLayout}
      style={{ height: height + 4 }}
      accessibilityLabel={accessibilityLabel}
    >
      {width > 0 ? (
        <Svg
          width={width}
          height={height + 4}
          viewBox={`0 0 ${width} ${height + 4}`}
          style={{ position: 'absolute', left: 0, top: 0 }}
        >
          <Path d={path} fill={t.shadow} transform="translate(0 4)" />
          <Path d={path} fill={fillColor} stroke={t.outline} strokeWidth={2} />
        </Svg>
      ) : null}
      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          top: 22,
          bottom: 6,
          justifyContent: 'center',
        }}
      >
        {children}
      </View>
    </View>
  );
}
