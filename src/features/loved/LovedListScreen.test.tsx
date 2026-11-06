import { LovedListScreen, type LovedListViewModel } from '@/features/loved/LovedListScreen';

import { fireEvent, renderWithTheme } from '../../../test/render';

jest.mock('@/components/PixelIcon', () => ({
  PixelIcon: () => null,
}));
jest.mock('@/components/Sticker', () => ({
  Sticker: () => null,
}));

function vm(partial: Partial<LovedListViewModel> = {}): LovedListViewModel {
  return {
    monthLabel: 'NOVEMBER',
    monthName: 'november',
    count: 0,
    items: [],
    ...partial,
  };
}

describe('LovedListScreen', () => {
  it('renders empty month state', async () => {
    const onAdd = jest.fn();
    const { getByText, getByLabelText } = await renderWithTheme(
      <LovedListScreen vm={vm()} onPrevMonth={() => {}} onNextMonth={() => {}} onAdd={onAdd} />,
    );

    expect(getByLabelText('Loved list')).toBeTruthy();
    expect(getByText('nothing loved yet this month')).toBeTruthy();
    fireEvent.press(getByLabelText('add a loved thing'));
    expect(onAdd).toHaveBeenCalled();
  });

  it('renders filled cards and recap CTA', async () => {
    const { getByText } = await renderWithTheme(
      <LovedListScreen
        vm={vm({
          count: 1,
          items: [
            {
              id: 'loved-1',
              userId: 'local',
              kind: 'loved',
              name: 'lavender cardigan',
              amountCents: 3800,
              currency: 'USD',
              category: null,
              note: null,
              photoPath: null,
              tag: null,
              happenedAt: new Date(2026, 10, 2).toISOString(),
              boughtAfterAllAt: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              deletedAt: null,
              dirty: true,
              syncedAt: null,
            },
          ],
        })}
        onPrevMonth={() => {}}
        onNextMonth={() => {}}
        onAdd={() => {}}
      />,
    );

    expect(getByText('lavender cardigan')).toBeTruthy();
    expect(getByText('make my november recap')).toBeTruthy();
  });
});
