import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { PixelIcon } from '@/components/PixelIcon';
import { useTokens } from '@/theme';

export type TaskbarTab = 'home' | 'tally' | 'diary' | 'collection';

type TaskbarProps = {
  active: TaskbarTab | 'none';
  onTabPress: (tab: TaskbarTab) => void;
  onLogPress: () => void;
  accessibilityLabel?: string;
};

const BAR_HEIGHT = 80;
const BAR_RADIUS = 26;
const BAR_STROKE = 2;

/** Top edge plus both corners. Side edges stay open, matching the canvas bar. */
function barPaths(width: number): { outline: string; fill: string } {
  const r = BAR_RADIUS;
  const s = BAR_STROKE;
  const ir = r - s;
  const h = BAR_HEIGHT;
  // Sweep 1 is clockwise. The left corner must bulge out to (0, 0).
  // Sweep 0 bites a semicircle out of the bar and shows the paper through it.
  const outline = `M0 ${r} A ${r} ${r} 0 0 1 ${r} 0 H ${width - r} A ${r} ${r} 0 0 1 ${width} ${r} V ${h} H 0 Z`;
  const fill = `M0 ${r} L ${s} ${r} A ${ir} ${ir} 0 0 1 ${r} ${s} H ${width - r} A ${ir} ${ir} 0 0 1 ${width - s} ${r} L ${width} ${r} V ${h} H 0 Z`;
  return { outline, fill };
}

const TABS: { id: TaskbarTab; label: string; icon: 'home' | 'tally' | 'diary' | 'collection' }[] = [
  { id: 'home', label: 'home', icon: 'home' },
  { id: 'tally', label: 'tally', icon: 'tally' },
  { id: 'diary', label: 'diary', icon: 'diary' },
  { id: 'collection', label: 'collection', icon: 'collection' },
];

/** Custom tab bar with a raised centre LOG button (`left: 50% - 36`). */
export function Taskbar({
  active,
  onTabPress,
  onLogPress,
  accessibilityLabel = 'Main',
}: TaskbarProps) {
  const t = useTokens();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const bar = barPaths(width);
  const left = TABS.slice(0, 2);
  const right = TABS.slice(2);

  const renderTab = (tab: (typeof TABS)[number]) => {
    const selected = active === tab.id;
    return (
      <Pressable
        key={tab.id}
        testID={`tab-${tab.id}`}
        accessibilityRole="tab"
        accessibilityLabel={tab.label}
        accessibilityState={{ selected }}
        onPress={() => onTabPress(tab.id)}
        style={{
          flex: 1,
          minHeight: 52,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <View
          style={{
            width: 46,
            height: 28,
            borderRadius: 14,
            borderWidth: 2,
            borderColor: selected ? t.outline : 'transparent',
            backgroundColor: selected ? t.c1 : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PixelIcon name={tab.icon} size={24} color={t.text} />
        </View>
        <Text
          style={{
            fontFamily: selected ? 'Nunito_900Black' : 'Nunito_700Bold',
            fontSize: 11,
            color: t.text,
          }}
        >
          {tab.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      pointerEvents="box-none"
      style={{ height: 96, position: 'relative' }}
    >
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: BAR_HEIGHT,
        }}
      >
        <Svg width={width} height={BAR_HEIGHT} style={{ position: 'absolute', left: 0, top: 0 }}>
          <Path d={bar.outline} fill={t.outline} />
          <Path d={bar.fill} fill={t.surface} />
        </Svg>
        <View
          style={{
            flex: 1,
            paddingBottom: insets.bottom > 0 ? 12 : 4,
            paddingTop: 6,
            paddingHorizontal: 6,
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          {left.map(renderTab)}
          <View style={{ flex: 1 }} accessibilityElementsHidden />
          {right.map(renderTab)}
        </View>
      </View>

      <Pressable
        testID="tab-log"
        accessibilityRole="button"
        accessibilityLabel="Quick log"
        onPress={onLogPress}
        style={{
          position: 'absolute',
          left: '50%',
          marginLeft: -36,
          top: 0,
          width: 72,
          height: 72,
          borderRadius: 36,
          borderWidth: 2,
          borderColor: t.outline,
          backgroundColor: t.btn,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 4,
            right: 0,
            bottom: -4,
            left: 0,
            borderRadius: 36,
            backgroundColor: t.shadow,
            zIndex: -1,
          }}
        />
        <PixelIcon name="plus" size={26} color={t.btnText} />
        <Text
          style={{
            fontFamily: 'PixelifySans_600SemiBold',
            fontSize: 12,
            letterSpacing: 0.72,
            color: t.btnText,
          }}
        >
          LOG
        </Text>
      </Pressable>
    </View>
  );
}
