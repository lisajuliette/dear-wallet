import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GridPaper } from '@/components/GridPaper';
import { useActivePalette } from '@/theme/store';
import { paletteVars, tokens, type PaletteKey } from '@/theme/theme';

type ScreenProps = {
  children: ReactNode;
  palette?: PaletteKey;
  compact?: boolean;
  accessibilityLabel?: string;
  testID?: string;
};

/** Full-screen gradient + grid paper + safe area shell. */
export function Screen({
  children,
  palette,
  compact: compactProp,
  accessibilityLabel = 'screen',
  testID,
}: ScreenProps) {
  const { height } = useWindowDimensions();
  const active = useActivePalette();
  const key = palette ?? active;
  const compact = compactProp ?? height < 740;
  const colors = tokens(key);

  return (
    <View
      style={[{ flex: 1 }, palette ? paletteVars(palette) : null]}
      className="flex-1"
      accessibilityLabel={accessibilityLabel}
      testID={testID ?? (compact ? 'screen-compact' : 'screen-regular')}
    >
      <LinearGradient
        colors={[colors.bg1, colors.bg2]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      />
      <GridPaper />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {children}
      </SafeAreaView>
    </View>
  );
}
