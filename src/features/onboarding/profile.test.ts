import { eq } from 'drizzle-orm';

import { profiles } from '@/db/schema';
import { createTestDatabase } from '@/db/testClient';
import { isOnboarded, markOnboarded } from '@/features/onboarding/profile';
import { savePalette } from '@/features/settings/prefs';
import { useThemeStore } from '@/theme/store';

const USER = '00000000-0000-4000-8000-000000000001';

describe('onboarding profile', () => {
  beforeEach(() => {
    useThemeStore.setState({ palette: 'cloud', previewPalette: null });
  });

  it('starts not onboarded and marks done once', async () => {
    const db = createTestDatabase();
    expect(await isOnboarded(db, USER)).toBe(false);
    await markOnboarded(db, USER);
    expect(await isOnboarded(db, USER)).toBe(true);
    const first = (await db.select().from(profiles).where(eq(profiles.id, USER)).limit(1))[0]
      ?.onboardedAt;
    await markOnboarded(db, USER);
    const second = (await db.select().from(profiles).where(eq(profiles.id, USER)).limit(1))[0]
      ?.onboardedAt;
    expect(second).toBe(first);
  });

  it('persists palette choice on the profile', async () => {
    const db = createTestDatabase();
    await savePalette(db, 'lilac');
    const row = (await db.select().from(profiles).where(eq(profiles.id, USER)).limit(1))[0];
    expect(row?.palette).toBe('lilac');
    expect(useThemeStore.getState().palette).toBe('lilac');
  });
});
