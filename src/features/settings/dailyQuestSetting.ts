import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'dear-wallet.daily-quests';

/** Stored value is "0" when daily quests are off. Missing means on. */
export function dailyQuestsFromStored(raw: string | null): boolean {
  return raw !== '0';
}

export async function loadDailyQuestsEnabled(): Promise<boolean> {
  return dailyQuestsFromStored(await AsyncStorage.getItem(KEY));
}

export async function saveDailyQuestsEnabled(on: boolean): Promise<void> {
  await AsyncStorage.setItem(KEY, on ? '1' : '0');
}
