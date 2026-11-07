import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ItemsDb } from '@/db/transaction';
import { persistPrefs } from '@/features/settings/prefs';
import { updateProfilePrefs } from '@/features/settings/repository';

const CHOSEN_KEY = 'dear-wallet.display-name-set';

/** Shown until onboarding (or settings) stores a name. */
export const FALLBACK_DISPLAY_NAME = 'You';

export function normalizeDisplayName(raw: string | null | undefined): string {
  const trimmed = raw?.trim().replace(/\s+/g, ' ') ?? '';
  return trimmed || FALLBACK_DISPLAY_NAME;
}

/** The old seeded persona. A name the user typed is kept, including this one. */
export function isPlaceholderName(raw: string | null | undefined): boolean {
  const trimmed = raw?.trim().toLowerCase() ?? '';
  return !trimmed || trimmed === 'jazmine';
}

/**
 * First launch replaces the seeded "Jazmine" with You.
 * Once the user saves a name, that value stays.
 */
export async function resolveDisplayName(db: ItemsDb, stored: string): Promise<string> {
  const chosen = await AsyncStorage.getItem(CHOSEN_KEY);
  if (chosen === '1') return normalizeDisplayName(stored);
  if (!isPlaceholderName(stored)) {
    await AsyncStorage.setItem(CHOSEN_KEY, '1');
    return stored.trim();
  }
  if (stored.trim() !== FALLBACK_DISPLAY_NAME) {
    await updateProfilePrefs(db, { displayName: FALLBACK_DISPLAY_NAME });
  }
  return FALLBACK_DISPLAY_NAME;
}

export async function saveChosenDisplayName(db: ItemsDb, raw: string): Promise<void> {
  await AsyncStorage.setItem(CHOSEN_KEY, '1');
  await persistPrefs(db, { displayName: normalizeDisplayName(raw) });
}
