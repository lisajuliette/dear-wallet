import { router } from 'expo-router';

import type { HomeViewModel } from '@/features/home/homeModel';
import { HomeScreen } from '@/features/home/HomeScreen';
import { useSettingsStore } from '@/features/rewards/settingsStore';

import { fireEvent, renderWithTheme } from '../../../test/render';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

jest.mock('@/components/PixelIcon', () => ({
  PixelIcon: () => null,
}));
jest.mock('@/components/Sticker', () => ({
  Sticker: () => null,
}));

function vm(partial: Partial<HomeViewModel>): HomeViewModel {
  return {
    state: 'first_day',
    greeting: 'HI JAZMINE ♡ DAY ONE',
    starCount: 0,
    todayCents: 0,
    monthCents: 0,
    todayCaption: 'ur kept total starts here ♡',
    questId: 'first_diary_line',
    questText: 'write ur first diary line',
    questDone: false,
    todayItems: [],
    hasGoal: false,
    goalLabel: '',
    goalProgressCents: 0,
    goalTargetCents: 0,
    ...partial,
  };
}

describe('HomeScreen', () => {
  it('renders first day empty state', async () => {
    const { getByLabelText, getByText } = await renderWithTheme(
      <HomeScreen vm={vm({ state: 'first_day' })} />,
    );
    expect(getByLabelText('Home')).toBeTruthy();
    expect(getByText(/DAY ONE/)).toBeTruthy();
    expect(getByText('ur first nvm lands here')).toBeTruthy();
  });

  it('renders empty today copy', async () => {
    const { getByText } = await renderWithTheme(
      <HomeScreen
        vm={vm({
          state: 'empty_today',
          greeting: 'HI JAZMINE ♡',
          todayCaption: "nothing yet, and that's totally fine",
        })}
      />,
    );
    expect(getByText('no temptations today? iconic.')).toBeTruthy();
  });

  it('renders quest done chip', async () => {
    const { getByText } = await renderWithTheme(
      <HomeScreen
        vm={vm({
          state: 'quest_done',
          questDone: true,
          greeting: 'HI JAZMINE ♡',
        })}
      />,
    );
    expect(getByText('QUEST DONE')).toBeTruthy();
    expect(getByText('+1 star on ur calendar, forever')).toBeTruthy();
  });

  it('renders today rows when active', async () => {
    const { getByText } = await renderWithTheme(
      <HomeScreen
        vm={vm({
          state: 'active',
          greeting: 'HI JAZMINE ♡',
          todayCents: 620,
          todayCaption: "1 thing u didn't buy ♡",
          todayItems: [
            {
              id: '1',
              userId: 'u',
              kind: 'kept',
              name: 'matcha latte',
              amountCents: 620,
              currency: 'USD',
              category: null,
              note: null,
              link: null,
              photoPath: null,
              tag: null,
              boughtAfterAllAt: null,
              happenedAt: new Date(2026, 10, 7, 15, 12).toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              deletedAt: null,
              dirty: true,
              syncedAt: null,
            },
          ],
        })}
      />,
    );
    expect(getByText('matcha latte')).toBeTruthy();
    expect(getByText('3:12 pm')).toBeTruthy();
  });

  it('opens item detail from a today row', async () => {
    const { getByTestId } = await renderWithTheme(
      <HomeScreen
        vm={vm({
          state: 'active',
          todayItems: [
            {
              id: 'item-1',
              userId: 'u',
              kind: 'kept',
              name: 'matcha latte',
              amountCents: 620,
              currency: 'USD',
              category: null,
              note: null,
              link: null,
              photoPath: null,
              tag: null,
              boughtAfterAllAt: null,
              happenedAt: new Date(2026, 10, 7, 15, 12).toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              deletedAt: null,
              dirty: true,
              syncedAt: null,
            },
          ],
        })}
      />,
    );
    fireEvent.press(getByTestId('home-item-item-1'));
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/item/[id]',
      params: { id: 'item-1' },
    });
  });

  it('hides the daily quest card when the setting is off', async () => {
    useSettingsStore.setState({ dailyQuests: false });
    const { queryByText } = await renderWithTheme(<HomeScreen vm={vm({ greeting: 'HI YOU ♡' })} />);
    expect(queryByText('DAILY QUEST')).toBeNull();
    expect(queryByText('write ur first diary line')).toBeNull();
    useSettingsStore.setState({ dailyQuests: true });
  });
});
