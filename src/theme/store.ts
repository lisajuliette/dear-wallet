import { create } from 'zustand';

import type { PaletteKey } from '@/theme/theme';

type ThemeState = {
  palette: PaletteKey;
  previewPalette: PaletteKey | null;
  setPalette: (palette: PaletteKey) => void;
  setPreviewPalette: (palette: PaletteKey | null) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  palette: 'cloud',
  previewPalette: null,
  setPalette: (palette) => set({ palette, previewPalette: null }),
  setPreviewPalette: (previewPalette) => set({ previewPalette }),
}));

export function useActivePalette(): PaletteKey {
  return useThemeStore((state) => state.previewPalette ?? state.palette);
}
