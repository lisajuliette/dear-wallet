import { isDiaryPath, shouldShowLockGate } from '@/features/lock/gate';

describe('lock gate', () => {
  it('never locks when mode is off', () => {
    expect(shouldShowLockGate({ mode: 'off', backgroundMs: null, pathname: '/diary' })).toBe(false);
  });

  it('locks whole app on cold start and after 60s', () => {
    expect(shouldShowLockGate({ mode: 'app', backgroundMs: null, pathname: '/' })).toBe(true);
    expect(shouldShowLockGate({ mode: 'app', backgroundMs: 60_000, pathname: '/home' })).toBe(true);
    expect(shouldShowLockGate({ mode: 'app', backgroundMs: 59_999, pathname: '/home' })).toBe(
      false,
    );
  });

  it('locks diary mode only on diary routes', () => {
    expect(shouldShowLockGate({ mode: 'diary', backgroundMs: null, pathname: '/diary' })).toBe(
      true,
    );
    expect(
      shouldShowLockGate({
        mode: 'diary',
        backgroundMs: null,
        pathname: '/diary/entry/1',
      }),
    ).toBe(true);
    expect(
      shouldShowLockGate({ mode: 'diary', backgroundMs: null, pathname: '/(tabs)/home' }),
    ).toBe(false);
  });

  it('detects diary paths', () => {
    expect(isDiaryPath('/diary')).toBe(true);
    expect(isDiaryPath('/diary/decorate/x')).toBe(true);
    expect(isDiaryPath('/settings')).toBe(false);
  });
});
