import { eq } from 'drizzle-orm';

import { profiles } from '@/db/schema';
import type { ItemsDb } from '@/db/transaction';
import type { AppLockMode, ProfilePrefs } from '@/features/settings/types';
import { getLocalUserId } from '@/lib/localUser';

const DEFAULTS: ProfilePrefs = {
  displayName: 'You',
  palette: 'cloud',
  currency: 'USD',
  sounds: true,
  haptics: true,
  reducedMotion: false,
  appLock: 'off',
  checkinEnabled: true,
  checkinWeekday: 0,
  checkinTime: '19:00',
};

function asAppLock(value: string): AppLockMode {
  if (value === 'diary' || value === 'app') return value;
  return 'off';
}

function rowToPrefs(row: typeof profiles.$inferSelect): ProfilePrefs {
  return {
    displayName: row.displayName ?? DEFAULTS.displayName,
    palette: row.palette,
    currency: row.currency,
    sounds: row.sounds,
    haptics: row.haptics,
    reducedMotion: row.reducedMotion,
    appLock: asAppLock(row.appLock),
    checkinEnabled: row.checkinEnabled,
    checkinWeekday: row.checkinWeekday,
    checkinTime: row.checkinTime,
  };
}

/** Ensure a local profile row exists and return prefs. */
export async function ensureProfile(
  db: ItemsDb,
  userId: string = getLocalUserId(),
): Promise<ProfilePrefs> {
  const existing = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
  if (existing[0]) return rowToPrefs(existing[0]);

  const now = new Date().toISOString();
  await db.insert(profiles).values({
    id: userId,
    displayName: DEFAULTS.displayName,
    palette: DEFAULTS.palette,
    currency: DEFAULTS.currency,
    sounds: DEFAULTS.sounds,
    haptics: DEFAULTS.haptics,
    reducedMotion: DEFAULTS.reducedMotion,
    appLock: DEFAULTS.appLock,
    checkinEnabled: DEFAULTS.checkinEnabled,
    checkinWeekday: DEFAULTS.checkinWeekday,
    checkinTime: DEFAULTS.checkinTime,
    createdAt: now,
    updatedAt: now,
    dirty: true,
  });
  return { ...DEFAULTS };
}

export async function getProfilePrefs(
  db: ItemsDb,
  userId: string = getLocalUserId(),
): Promise<ProfilePrefs> {
  return ensureProfile(db, userId);
}

export async function updateProfilePrefs(
  db: ItemsDb,
  patch: Partial<ProfilePrefs>,
  userId: string = getLocalUserId(),
): Promise<ProfilePrefs> {
  await ensureProfile(db, userId);
  const now = new Date().toISOString();
  await db
    .update(profiles)
    .set({
      ...(patch.displayName !== undefined ? { displayName: patch.displayName } : {}),
      ...(patch.palette !== undefined ? { palette: patch.palette } : {}),
      ...(patch.currency !== undefined ? { currency: patch.currency } : {}),
      ...(patch.sounds !== undefined ? { sounds: patch.sounds } : {}),
      ...(patch.haptics !== undefined ? { haptics: patch.haptics } : {}),
      ...(patch.reducedMotion !== undefined ? { reducedMotion: patch.reducedMotion } : {}),
      ...(patch.appLock !== undefined ? { appLock: patch.appLock } : {}),
      ...(patch.checkinEnabled !== undefined ? { checkinEnabled: patch.checkinEnabled } : {}),
      ...(patch.checkinWeekday !== undefined ? { checkinWeekday: patch.checkinWeekday } : {}),
      ...(patch.checkinTime !== undefined ? { checkinTime: patch.checkinTime } : {}),
      updatedAt: now,
      dirty: true,
    })
    .where(eq(profiles.id, userId));
  return getProfilePrefs(db, userId);
}
