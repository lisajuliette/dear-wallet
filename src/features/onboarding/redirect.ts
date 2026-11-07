/** Where to go after the in-app splash finishes. */
export function resolvePostSplashHref(onboarded: boolean): '/(onboarding)/welcome' | '/(tabs)' {
  return onboarded ? '/(tabs)' : '/(onboarding)/welcome';
}

/** Session flag so splash only plays once per cold start. */
let splashDoneThisLaunch = false;

export function hasSplashDoneThisLaunch(): boolean {
  return splashDoneThisLaunch;
}

export function markSplashDoneThisLaunch(): void {
  splashDoneThisLaunch = true;
}

/** Test helper. */
export function resetSplashDoneForTests(): void {
  splashDoneThisLaunch = false;
}
