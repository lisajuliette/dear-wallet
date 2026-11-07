import { pickWinnerByUpdatedAt, remoteIsNewer } from '@/features/sync/merge';

describe('sync merge', () => {
  it('picks the newer updatedAt', () => {
    const older = { updatedAt: '2026-01-01T00:00:00.000Z', id: 'a' };
    const newer = { updatedAt: '2026-01-02T00:00:00.000Z', id: 'b' };
    expect(pickWinnerByUpdatedAt(older, newer).id).toBe('b');
    expect(pickWinnerByUpdatedAt(newer, older).id).toBe('b');
  });

  it('keeps local on equal timestamps', () => {
    const a = { updatedAt: '2026-01-01T00:00:00.000Z', id: 'local' };
    const b = { updatedAt: '2026-01-01T00:00:00.000Z', id: 'remote' };
    expect(pickWinnerByUpdatedAt(a, b).id).toBe('local');
  });

  it('detects remote newer', () => {
    expect(remoteIsNewer('2026-01-01T00:00:00.000Z', '2026-01-02T00:00:00.000Z')).toBe(true);
    expect(remoteIsNewer('2026-01-02T00:00:00.000Z', '2026-01-01T00:00:00.000Z')).toBe(false);
  });
});
