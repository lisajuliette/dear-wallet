import { usePathname } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { shouldShowLockGate } from '@/features/lock/gate';
import { useSettingsStore } from '@/features/rewards/settingsStore';

/** Tracks background time and whether the lock overlay should show. */
export function useAppLock() {
  const mode = useSettingsStore((s) => s.appLock);
  const pathname = usePathname();
  const backgroundedAt = useRef<number | null>(null);
  /** null = cold start (or never backgrounded since launch). */
  const [backgroundMs, setBackgroundMs] = useState<number | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const onChange = (next: AppStateStatus) => {
      if (next === 'background' || next === 'inactive') {
        backgroundedAt.current = Date.now();
        return;
      }
      if (next === 'active' && backgroundedAt.current != null) {
        const elapsed = Date.now() - backgroundedAt.current;
        backgroundedAt.current = null;
        setBackgroundMs(elapsed);
        setUnlocked(false);
      }
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, []);

  const wantLock = shouldShowLockGate({
    mode,
    backgroundMs,
    pathname,
  });
  const locked = wantLock && !unlocked;

  const unlock = useCallback(() => setUnlocked(true), []);

  return { locked, unlock };
}
