import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';

type NetSnapshot = Pick<NetInfoState, 'isConnected' | 'isInternetReachable'>;

let devForceOffline = false;
let lastState: NetSnapshot = { isConnected: true, isInternetReachable: true };
const listeners = new Set<(offline: boolean) => void>();

/** Dev-only override. Production builds never call this. */
export function setDevOffline(forced: boolean): void {
  devForceOffline = forced;
  const offline = isOffline(lastState);
  for (const listener of listeners) listener(offline);
}

export function isDevOfflineForced(): boolean {
  return devForceOffline;
}

/**
 * Offline when the dev override is on, or when NetInfo says there is no
 * connection. `isInternetReachable === null` still counts as online, matching
 * the Quick log sheet.
 */
export function isOffline(state: NetSnapshot): boolean {
  if (devForceOffline) return true;
  return !(state.isConnected && state.isInternetReachable !== false);
}

export function subscribeOffline(listener: (offline: boolean) => void): () => void {
  listeners.add(listener);
  const unsubscribe = NetInfo.addEventListener((state) => {
    lastState = state;
    listener(isOffline(state));
  });
  return () => {
    listeners.delete(listener);
    unsubscribe();
  };
}
