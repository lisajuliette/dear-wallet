import AsyncStorage from '@react-native-async-storage/async-storage';

import type { TallyRange } from '@/features/tally/buildTallyBars';

const KEY = 'dear-wallet.tally-range';

export function parseTallyRange(raw: string | null): TallyRange {
  if (raw === 'day' || raw === 'week' || raw === 'month') return raw;
  return 'month';
}

export async function loadTallyRange(): Promise<TallyRange> {
  return parseTallyRange(await AsyncStorage.getItem(KEY));
}

export async function saveTallyRange(range: TallyRange): Promise<void> {
  await AsyncStorage.setItem(KEY, range);
}
