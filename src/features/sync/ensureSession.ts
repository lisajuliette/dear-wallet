import { useAuthStore } from '@/features/sync/authStore';
import { supabase, supabaseConfigured } from '@/features/sync/supabase';
import { FALLBACK_LOCAL_USER_ID } from '@/lib/localUser';

function applyUser(
  user: {
    id: string;
    is_anonymous?: boolean | null;
    email?: string | null;
  } | null,
) {
  if (!user) {
    useAuthStore.getState().setSession({
      userId: FALLBACK_LOCAL_USER_ID,
      isAnonymous: true,
      email: null,
    });
    return;
  }
  useAuthStore.getState().setSession({
    userId: user.id,
    isAnonymous: !!user.is_anonymous,
    email: user.email ?? null,
  });
}

/**
 * Restore session or create an anonymous user (silent, no UI).
 * Offline / missing env falls back to the local placeholder id.
 */
export async function ensureSession(): Promise<string> {
  if (!supabaseConfigured) {
    applyUser(null);
    useAuthStore.getState().setReady(true);
    return FALLBACK_LOCAL_USER_ID;
  }

  try {
    const existing = await supabase.auth.getSession();
    let user = existing.data.session?.user ?? null;

    if (!user) {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      user = data.user;
    }

    applyUser(user ?? null);
    useAuthStore.getState().setReady(true);
    return useAuthStore.getState().userId ?? FALLBACK_LOCAL_USER_ID;
  } catch {
    applyUser(null);
    useAuthStore.getState().setReady(true);
    return FALLBACK_LOCAL_USER_ID;
  }
}
