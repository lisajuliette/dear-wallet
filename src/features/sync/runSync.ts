import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ItemsDb } from '@/db/transaction';
import { pushOutbox } from '@/features/sync/outboxWorker';
import { uploadPendingPhotos } from '@/features/sync/photos';
import { pullItems } from '@/features/sync/pull';
import { supabaseConfigured } from '@/features/sync/supabase';

const CURSOR_KEY = 'dear_wallet_pull_cursor_items';

let syncing = false;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export async function runSync(db: ItemsDb): Promise<void> {
  if (!supabaseConfigured || syncing) return;
  syncing = true;
  try {
    await pushOutbox(db);
    await uploadPendingPhotos(db);
    const cursor = await AsyncStorage.getItem(CURSOR_KEY);
    const next = await pullItems(db, cursor);
    if (next) await AsyncStorage.setItem(CURSOR_KEY, next);
  } catch {
    // Offline-first: swallow sync errors; next trigger retries.
  } finally {
    syncing = false;
  }
}

/** Debounced sync after local writes (300ms). */
export function scheduleSync(db: ItemsDb): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    void runSync(db);
  }, 300);
}
