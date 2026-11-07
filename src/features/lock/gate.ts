import type { AppLockMode } from '@/features/settings/types';

export const LOCK_BACKGROUND_MS = 60_000;

export type LockGateInput = {
  mode: AppLockMode;
  /** Milliseconds spent in background; null = cold start. */
  backgroundMs: number | null;
  pathname: string;
};

/**
 * Decide whether the lock screen should cover the app.
 * - off: never
 * - app: cold start or background ≥ 60s
 * - diary: same timing, but only when the route is diary-related
 */
export function shouldShowLockGate(input: LockGateInput): boolean {
  const { mode, backgroundMs, pathname } = input;
  if (mode === 'off') return false;

  const timedOut = backgroundMs === null || backgroundMs >= LOCK_BACKGROUND_MS;
  if (!timedOut) return false;

  if (mode === 'app') return true;
  return isDiaryPath(pathname);
}

export function isDiaryPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/';
  return path === '/diary' || path.startsWith('/diary/') || path.includes('(tabs)/diary');
}
