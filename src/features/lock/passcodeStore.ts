import * as SecureStore from 'expo-secure-store';

import { hashPasscode, verifyPasscode } from '@/features/lock/passcode';

const PASSCODE_KEY = 'dear_wallet_passcode_hash';

export async function hasPasscode(
  getItem: typeof SecureStore.getItemAsync = SecureStore.getItemAsync,
): Promise<boolean> {
  const value = await getItem(PASSCODE_KEY);
  return !!value;
}

export async function setPasscode(
  passcode: string,
  setItem: typeof SecureStore.setItemAsync = SecureStore.setItemAsync,
): Promise<void> {
  const hashed = await hashPasscode(passcode);
  await setItem(PASSCODE_KEY, hashed);
}

export async function clearPasscode(
  deleteItem: typeof SecureStore.deleteItemAsync = SecureStore.deleteItemAsync,
): Promise<void> {
  await deleteItem(PASSCODE_KEY);
}

export async function checkPasscode(
  passcode: string,
  getItem: typeof SecureStore.getItemAsync = SecureStore.getItemAsync,
): Promise<boolean> {
  const stored = await getItem(PASSCODE_KEY);
  if (!stored) return false;
  return verifyPasscode(passcode, stored);
}
