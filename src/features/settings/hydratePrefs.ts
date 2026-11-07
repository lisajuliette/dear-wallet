import type { ItemsDb } from '@/db/transaction';
import { useSettingsStore } from '@/features/rewards/settingsStore';
import { loadDailyQuestsEnabled } from '@/features/settings/dailyQuestSetting';
import { resolveDisplayName } from '@/features/settings/displayName';
import { syncWeeklyCheckin } from '@/features/settings/notifications';
import { applyPrefsToStores } from '@/features/settings/prefs';
import { loadPromptsEnabled } from '@/features/settings/promptSetting';
import { ensureProfile } from '@/features/settings/repository';

/** Load profiles into stores and (re)schedule weekly check-in if enabled. */
export async function hydratePrefs(db: ItemsDb): Promise<void> {
  const prefs = await ensureProfile(db);
  const displayName = await resolveDisplayName(db, prefs.displayName);
  applyPrefsToStores({ ...prefs, displayName });
  useSettingsStore.getState().setPrompts(await loadPromptsEnabled());
  useSettingsStore.getState().setDailyQuests(await loadDailyQuestsEnabled());
  if (prefs.checkinEnabled) {
    await syncWeeklyCheckin({
      enabled: true,
      weekday: prefs.checkinWeekday,
      time: prefs.checkinTime,
    }).catch(() => undefined);
  }
}
