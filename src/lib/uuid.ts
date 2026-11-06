import * as Crypto from 'expo-crypto';

/** Client-generated uuid for local-first rows. */
export function createId(): string {
  return Crypto.randomUUID();
}
