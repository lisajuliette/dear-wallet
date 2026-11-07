import * as Crypto from 'expo-crypto';

const SALT_BYTES = 16;

/** Hash a 6-digit passcode with a random salt. Stored as `saltHex:hashHex`. */
export async function hashPasscode(
  passcode: string,
  randomBytes: (n: number) => Promise<Uint8Array> = defaultRandom,
): Promise<string> {
  if (!/^\d{6}$/.test(passcode)) {
    throw new Error('passcode must be 6 digits');
  }
  const salt = await randomBytes(SALT_BYTES);
  const saltHex = bytesToHex(salt);
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${saltHex}:${passcode}`,
  );
  return `${saltHex}:${digest}`;
}

export async function verifyPasscode(passcode: string, stored: string): Promise<boolean> {
  if (!/^\d{6}$/.test(passcode)) return false;
  const [saltHex, expected] = stored.split(':');
  if (!saltHex || !expected) return false;
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${saltHex}:${passcode}`,
  );
  return digest === expected;
}

async function defaultRandom(n: number): Promise<Uint8Array> {
  const hex = await Crypto.getRandomBytesAsync(n);
  return hex;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}
