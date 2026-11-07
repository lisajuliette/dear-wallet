import { useAuthStore } from '@/features/sync/authStore';

/**
 * Placeholder until anonymous Supabase auth lands / when offline without a session.
 * Prefer getLocalUserId() in app code so sync RLS matches auth.uid().
 */
export const FALLBACK_LOCAL_USER_ID = '00000000-0000-4000-8000-000000000001';

/** @deprecated Prefer getLocalUserId() — kept for tests and gradual migration. */
export const LOCAL_USER_ID = FALLBACK_LOCAL_USER_ID;

/** Active user id from auth store, or the offline fallback. */
export function getLocalUserId(): string {
  return useAuthStore.getState().userId ?? FALLBACK_LOCAL_USER_ID;
}
