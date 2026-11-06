import { create } from 'zustand';

type SettingsState = {
  haptics: boolean;
  sounds: boolean;
  reducedMotion: boolean;
  displayName: string;
  setHaptics: (v: boolean) => void;
  setSounds: (v: boolean) => void;
  setReducedMotion: (v: boolean) => void;
};

/** App preference flags until profiles sync lands. */
export const useSettingsStore = create<SettingsState>((set) => ({
  haptics: true,
  sounds: true,
  reducedMotion: false,
  displayName: 'Jazmine',
  setHaptics: (haptics) => set({ haptics }),
  setSounds: (sounds) => set({ sounds }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}));
