import { createTestDatabase } from '@/db/testClient';
import { ensureProfile, updateProfilePrefs } from '@/features/settings/repository';

describe('settings repository', () => {
  it('creates a default profile and updates prefs', async () => {
    const db = createTestDatabase();
    const first = await ensureProfile(db, 'user-a');
    expect(first.palette).toBe('cloud');
    expect(first.appLock).toBe('off');
    expect(first.checkinTime).toBe('19:00');

    const next = await updateProfilePrefs(
      db,
      { haptics: false, appLock: 'diary', checkinWeekday: 3 },
      'user-a',
    );
    expect(next.haptics).toBe(false);
    expect(next.appLock).toBe('diary');
    expect(next.checkinWeekday).toBe(3);

    const again = await ensureProfile(db, 'user-a');
    expect(again.appLock).toBe('diary');
  });
});
