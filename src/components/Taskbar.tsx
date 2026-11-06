import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PixelIcon } from '@/components/PixelIcon';
import { useTokens } from '@/theme';

export type TaskbarTab = 'home' | 'tally' | 'diary' | 'collection';

type TaskbarProps = {
  active: TaskbarTab | 'none';
  onTabPress: (tab: TaskbarTab) => void;
  onLogPress: () => void;
  accessibilityLabel?: string;
};

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
  const left = TABS.slice(0, 2);
  const right = TABS.slice(2);

  const renderTab = (tab: (typeof TABS)[number]) => {
    const selected = active === tab.id;
    return (
      <Pressable
        key={tab.id}
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
      style={{ height: 96 + insets.bottom, position: 'relative' }}
    >
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 80 + insets.bottom,
          paddingBottom: insets.bottom,
          backgroundColor: t.surface,
          borderTopWidth: 2,
          borderColor: t.outline,
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
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

      <Pressable
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
