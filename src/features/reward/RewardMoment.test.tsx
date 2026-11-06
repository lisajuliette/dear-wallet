import { AccessibilityInfo } from 'react-native';

import { RewardMoment } from '@/features/reward/RewardMoment';
import { useSettingsStore } from '@/features/rewards/settingsStore';

import { fireEvent, renderWithTheme } from '../../../test/render';

jest.mock('@/components/PixelIcon', () => ({
  PixelIcon: () => null,
}));
jest.mock('@/components/Sticker', () => ({
  Sticker: () => null,
}));
jest.mock('@/components/Coin', () => ({
  Coin: () => null,
}));
jest.mock('@/components/SparkleBurst', () => ({
  SparkleBurst: () => null,
}));

describe('RewardMoment', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      haptics: true,
      sounds: true,
      reducedMotion: false,
      displayName: 'Jazmine',
    });
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
  });

  it('shows kept amount copy and closes on tap', async () => {
    const onClose = jest.fn();
    const { getByLabelText, getByText } = await renderWithTheme(
      <RewardMoment
        amountCents={620}
        monthCents={1840}
        starAwarded
        starCount={3}
        stickerId={null}
        rare={false}
        onClose={onClose}
      />,
    );

    expect(getByText('$6.20 stays with u ♡')).toBeTruthy();
    expect(getByText('$18.40')).toBeTruthy();
    expect(getByText('+1 star on ur calendar')).toBeTruthy();
    fireEvent.press(getByLabelText('Reward. Tap anywhere to close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('shows sticker window for a common drop', async () => {
    const { getByText } = await renderWithTheme(
      <RewardMoment
        amountCents={null}
        monthCents={0}
        starAwarded={false}
        starCount={1}
        stickerId="common-gold-star"
        rare={false}
        onClose={() => {}}
      />,
    );

    expect(getByText('u showed up today ♡')).toBeTruthy();
    expect(getByText('NEW STICKER!')).toBeTruthy();
    expect(getByText('COMMON')).toBeTruthy();
  });

  it('shows rare holo chrome', async () => {
    useSettingsStore.getState().setReducedMotion(true);
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);

    const { getByText } = await renderWithTheme(
      <RewardMoment
        amountCents={100}
        monthCents={100}
        starAwarded
        starCount={2}
        stickerId="rare-holo-cd"
        rare
        onClose={() => {}}
      />,
    );

    expect(getByText('RARE DROP!!')).toBeTruthy();
    expect(getByText('RARE · HOLO')).toBeTruthy();
  });
});
