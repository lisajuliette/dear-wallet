import type { ItemsDb } from '@/db/transaction';
import { useSettingsStore } from '@/features/rewards/settingsStore';
import { updateProfilePrefs } from '@/features/settings/repository';
import type { AppLockMode, ProfilePrefs } from '@/features/settings/types';
import { useThemeStore } from '@/theme/store';
import { palettes, type PaletteKey } from '@/theme/theme';

function isPaletteKey(value: string): value is PaletteKey {
  return value in palettes;
}

/** Apply loaded profile prefs into zustand stores. */
export function applyPrefsToStores(prefs: ProfilePrefs): void {
  useSettingsStore.getState().hydrateFromProfile({
    haptics: prefs.haptics,
    sounds: prefs.sounds,
    reducedMotion: prefs.reducedMotion,
    displayName: prefs.displayName,
    currency: prefs.currency,
    appLock: prefs.appLock,
    checkinEnabled: prefs.checkinEnabled,
    checkinWeekday: prefs.checkinWeekday,
    checkinTime: prefs.checkinTime,
  });
  if (isPaletteKey(prefs.palette)) {
    useThemeStore.getState().setPalette(prefs.palette);
  }
}

export async function persistPrefs(db: ItemsDb, patch: Partial<ProfilePrefs>): Promise<void> {
  const next = await updateProfilePrefs(db, patch);
  applyPrefsToStores(next);
}

export async function savePalette(db: ItemsDb, palette: PaletteKey): Promise<void> {
  useThemeStore.getState().setPalette(palette);
  await updateProfilePrefs(db, { palette });
}

export async function saveAppLock(db: ItemsDb, appLock: AppLockMode): Promise<void> {
  useSettingsStore.getState().setAppLock(appLock);
  await updateProfilePrefs(db, { appLock });
}
