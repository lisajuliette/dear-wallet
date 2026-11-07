import type { ItemsDb } from '@/db/transaction';
import { syncWeeklyCheckin } from '@/features/settings/notifications';
import { applyPrefsToStores } from '@/features/settings/prefs';
import { ensureProfile } from '@/features/settings/repository';

/** Load profiles into stores and (re)schedule weekly check-in if enabled. */
export async function hydratePrefs(db: ItemsDb): Promise<void> {
  const prefs = await ensureProfile(db);
  applyPrefsToStores(prefs);
  if (prefs.checkinEnabled) {
    await syncWeeklyCheckin({
      enabled: true,
      weekday: prefs.checkinWeekday,
      time: prefs.checkinTime,
    }).catch(() => undefined);
  }
}
