import { usePityStore } from '@/features/rewards/pityStore';
import { useSettingsStore } from '@/features/rewards/settingsStore';

describe('reward stores', () => {
  beforeEach(() => {
    usePityStore.setState({ emptyStreak: 0 });
    useSettingsStore.setState({
      hydrated: false,
      haptics: true,
      sounds: true,
      reducedMotion: false,
      displayName: 'Jazmine',
      currency: 'USD',
      appLock: 'off',
      checkinEnabled: true,
      checkinWeekday: 0,
      checkinTime: '19:00',
    });
  });

  it('tracks empty sticker streak', () => {
    usePityStore.getState().setEmptyStreak(3);
    expect(usePityStore.getState().emptyStreak).toBe(3);
  });

  it('updates preference flags', () => {
    useSettingsStore.getState().setHaptics(false);
    useSettingsStore.getState().setSounds(false);
    useSettingsStore.getState().setReducedMotion(true);
    useSettingsStore.getState().setAppLock('diary');
    expect(useSettingsStore.getState()).toMatchObject({
      haptics: false,
      sounds: false,
      reducedMotion: true,
      appLock: 'diary',
    });
  });
});
