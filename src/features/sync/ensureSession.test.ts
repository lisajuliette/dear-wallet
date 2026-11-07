import { useAuthStore } from '@/features/sync/authStore';
import { ensureSession } from '@/features/sync/ensureSession';

jest.mock('@/features/sync/supabase', () => ({
  supabaseConfigured: false,
  supabase: {
    auth: {
      getSession: jest.fn(),
      signInAnonymously: jest.fn(),
    },
  },
}));

describe('ensureSession', () => {
  beforeEach(() => {
    useAuthStore.setState({
      ready: false,
      userId: null,
      isAnonymous: true,
      email: null,
    });
  });

  it('falls back offline when supabase is not configured', async () => {
    const id = await ensureSession();
    expect(id).toBe('00000000-0000-4000-8000-000000000001');
    expect(useAuthStore.getState().ready).toBe(true);
  });
});
