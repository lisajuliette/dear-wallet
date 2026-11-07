import { isDevOfflineForced, isOffline, setDevOffline } from '@/lib/network';

const online = { isConnected: true, isInternetReachable: true as boolean | null };
const offline = { isConnected: false, isInternetReachable: false as boolean | null };

describe('isOffline', () => {
  afterEach(() => {
    setDevOffline(false);
  });

  it('stays online when NetInfo is connected', () => {
    expect(isOffline(online)).toBe(false);
    expect(isOffline({ isConnected: true, isInternetReachable: null })).toBe(false);
  });

  it('is offline when NetInfo has no connection', () => {
    expect(isOffline(offline)).toBe(true);
    expect(isOffline({ isConnected: true, isInternetReachable: false })).toBe(true);
  });

  it('dev override forces offline even on a live connection', () => {
    setDevOffline(true);
    expect(isDevOfflineForced()).toBe(true);
    expect(isOffline(online)).toBe(true);
  });
});
