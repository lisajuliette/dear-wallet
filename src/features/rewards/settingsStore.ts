import { create } from 'zustand';

import type { AppLockMode } from '@/features/settings/types';

export type SettingsState = {
  hydrated: boolean;
  haptics: boolean;
  sounds: boolean;
  reducedMotion: boolean;
  displayName: string;
  currency: string;
  appLock: AppLockMode;
  checkinEnabled: boolean;
  checkinWeekday: number;
  checkinTime: string;
  /** Diary prompt card and the prompt on an entry. */
  prompts: boolean;
  /** Home daily quest card. */
  dailyQuests: boolean;
  setHydrated: (v: boolean) => void;
  hydrateFromProfile: (prefs: {
    haptics: boolean;
    sounds: boolean;
    reducedMotion: boolean;
    displayName: string;
    currency: string;
    appLock: AppLockMode;
    checkinEnabled: boolean;
    checkinWeekday: number;
    checkinTime: string;
  }) => void;
  setHaptics: (v: boolean) => void;
  setSounds: (v: boolean) => void;
  setReducedMotion: (v: boolean) => void;
  setDisplayName: (v: string) => void;
  setCurrency: (v: string) => void;
  setAppLock: (v: AppLockMode) => void;
  setCheckinEnabled: (v: boolean) => void;
  setCheckinWeekday: (v: number) => void;
  setCheckinTime: (v: string) => void;
  setPrompts: (v: boolean) => void;
  setDailyQuests: (v: boolean) => void;
};

/** App preference flags (hydrated from profiles). */
export const useSettingsStore = create<SettingsState>((set) => ({
  hydrated: false,
  haptics: true,
  sounds: true,
  reducedMotion: false,
  displayName: 'You',
  currency: 'USD',
  appLock: 'off',
  checkinEnabled: true,
  checkinWeekday: 0,
  checkinTime: '19:00',
  prompts: true,
  dailyQuests: true,
  setHydrated: (hydrated) => set({ hydrated }),
  hydrateFromProfile: (prefs) => set({ ...prefs, hydrated: true }),
  setHaptics: (haptics) => set({ haptics }),
  setSounds: (sounds) => set({ sounds }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setDisplayName: (displayName) => set({ displayName }),
  setCurrency: (currency) => set({ currency }),
  setAppLock: (appLock) => set({ appLock }),
  setCheckinEnabled: (checkinEnabled) => set({ checkinEnabled }),
  setCheckinWeekday: (checkinWeekday) => set({ checkinWeekday }),
  setCheckinTime: (checkinTime) => set({ checkinTime }),
  setPrompts: (prompts) => set({ prompts }),
  setDailyQuests: (dailyQuests) => set({ dailyQuests }),
}));
