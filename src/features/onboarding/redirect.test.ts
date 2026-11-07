import {
  hasSplashDoneThisLaunch,
  markSplashDoneThisLaunch,
  resetSplashDoneForTests,
  resolvePostSplashHref,
} from '@/features/onboarding/redirect';

describe('onboarding redirect', () => {
  beforeEach(() => {
    resetSplashDoneForTests();
  });

  it('sends new users to welcome', () => {
    expect(resolvePostSplashHref(false)).toBe('/(onboarding)/welcome');
  });

  it('sends returning users to tabs', () => {
    expect(resolvePostSplashHref(true)).toBe('/(tabs)');
  });

  it('tracks splash completion for this launch', () => {
    expect(hasSplashDoneThisLaunch()).toBe(false);
    markSplashDoneThisLaunch();
    expect(hasSplashDoneThisLaunch()).toBe(true);
  });
});
