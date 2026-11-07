import { router, type Href } from 'expo-router';

/** Leave the screen. A reloaded route has no history, so fall back instead of firing GO_BACK. */
export function goBack(fallback: Href): void {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace(fallback);
}
