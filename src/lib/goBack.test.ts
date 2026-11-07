import { router } from 'expo-router';

import { goBack } from '@/lib/goBack';

jest.mock('expo-router', () => ({
  router: {
    canGoBack: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  },
}));

const mocked = router as unknown as {
  canGoBack: jest.Mock;
  back: jest.Mock;
  replace: jest.Mock;
};

describe('goBack', () => {
  beforeEach(() => {
    mocked.canGoBack.mockReset();
    mocked.back.mockReset();
    mocked.replace.mockReset();
  });

  it('pops when a screen is underneath', () => {
    mocked.canGoBack.mockReturnValue(true);
    goBack('/(tabs)/diary');
    expect(mocked.back).toHaveBeenCalledTimes(1);
    expect(mocked.replace).not.toHaveBeenCalled();
  });

  it('replaces when this screen is the whole stack', () => {
    mocked.canGoBack.mockReturnValue(false);
    goBack('/(tabs)/diary');
    expect(mocked.back).not.toHaveBeenCalled();
    expect(mocked.replace).toHaveBeenCalledWith('/(tabs)/diary');
  });
});
