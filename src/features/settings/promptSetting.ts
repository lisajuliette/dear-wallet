import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'dear-wallet.prompts';

/** Stored value is "0" when prompts are off. Missing means on. */
export function promptsFromStored(raw: string | null): boolean {
  return raw !== '0';
}

export async function loadPromptsEnabled(): Promise<boolean> {
  return promptsFromStored(await AsyncStorage.getItem(KEY));
}

export async function savePromptsEnabled(on: boolean): Promise<void> {
  await AsyncStorage.setItem(KEY, on ? '1' : '0');
}
