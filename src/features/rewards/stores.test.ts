import { usePityStore } from '@/features/rewards/pityStore';
import { useSettingsStore } from '@/features/rewards/settingsStore';

describe('reward stores', () => {
  beforeEach(() => {
    usePityStore.setState({ emptyStreak: 0 });
    useSettingsStore.setState({
      haptics: true,
      sounds: true,
      reducedMotion: false,
      displayName: 'Jazmine',
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
    expect(useSettingsStore.getState()).toMatchObject({
      haptics: false,
      sounds: false,
      reducedMotion: true,
    });
  });
});
