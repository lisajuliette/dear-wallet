import { type ReactNode } from 'react';
import { View } from 'react-native';

import { useActivePalette } from '@/theme/store';
import { paletteVars, tokens, type PaletteKey } from '@/theme/theme';

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const palette = useActivePalette();

  return (
    <View style={[{ flex: 1 }, paletteVars(palette)]} className="flex-1">
      {children}
    </View>
  );
}

/** Hex + derived rgba tokens for SVG fills and Reanimated. */
export function useTokens() {
  const palette = useActivePalette();
  return tokens(palette);
}

export function usePaletteKey(): PaletteKey {
  return useActivePalette();
}
