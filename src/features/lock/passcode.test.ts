import { hashPasscode, verifyPasscode } from '@/features/lock/passcode';

describe('passcode hash', () => {
  it('hashes and verifies a 6-digit code', async () => {
    const salt = new Uint8Array(16).fill(7);
    const stored = await hashPasscode('246810', async () => salt);
    expect(stored).toContain(':');
    expect(await verifyPasscode('246810', stored)).toBe(true);
    expect(await verifyPasscode('000000', stored)).toBe(false);
  });

  it('rejects non-6-digit input', async () => {
    await expect(hashPasscode('123')).rejects.toThrow(/6 digits/);
    expect(await verifyPasscode('123', 'ab:cd')).toBe(false);
  });
});
