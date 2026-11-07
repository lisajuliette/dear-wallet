import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'dear-wallet.categories';

export type CategoryPref = {
  name: string;
  shown: boolean;
};

export const DEFAULT_CATEGORY_NAMES = ['treats', 'food', 'clothes', 'home', 'other'] as const;

export function defaultCategories(): CategoryPref[] {
  return DEFAULT_CATEGORY_NAMES.map((name) => ({ name, shown: true }));
}

export function normalizeCategoryName(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ').slice(0, 24);
}

export function categoriesFromStored(raw: string | null): CategoryPref[] {
  if (!raw) return defaultCategories();
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return defaultCategories();
    const next: CategoryPref[] = [];
    for (const row of parsed) {
      if (!row || typeof row !== 'object') continue;
      const name = normalizeCategoryName(String((row as { name?: unknown }).name ?? ''));
      if (!name) continue;
      if (next.some((c) => c.name.toLowerCase() === name.toLowerCase())) continue;
      next.push({ name, shown: (row as { shown?: unknown }).shown !== false });
    }
    return next.length > 0 ? next : defaultCategories();
  } catch {
    return defaultCategories();
  }
}

export function shownCategoryNames(prefs: CategoryPref[]): string[] {
  return prefs.filter((c) => c.shown).map((c) => c.name);
}

export function addCategory(prefs: CategoryPref[], raw: string): CategoryPref[] {
  const name = normalizeCategoryName(raw);
  if (!name) return prefs;
  const existing = prefs.find((c) => c.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    return prefs.map((c) => (c === existing ? { ...c, shown: true } : c));
  }
  return [...prefs, { name, shown: true }];
}

export function setCategoryShown(
  prefs: CategoryPref[],
  name: string,
  shown: boolean,
): CategoryPref[] {
  return prefs.map((c) => (c.name === name ? { ...c, shown } : c));
}

export function removeCategory(prefs: CategoryPref[], name: string): CategoryPref[] {
  return prefs.filter((c) => c.name !== name);
}

/** Rename one category. A blank name is ignored. A name already in the list stays put. */
export function renameCategory(prefs: CategoryPref[], from: string, raw: string): CategoryPref[] {
  const name = normalizeCategoryName(raw);
  if (!name) return prefs;
  const taken = prefs.some((c) => c.name !== from && c.name.toLowerCase() === name.toLowerCase());
  if (taken) return prefs;
  return prefs.map((c) => (c.name === from ? { ...c, name } : c));
}

export async function loadCategories(): Promise<CategoryPref[]> {
  return categoriesFromStored(await AsyncStorage.getItem(KEY));
}

export async function saveCategories(prefs: CategoryPref[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(prefs));
}
