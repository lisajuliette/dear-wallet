import { TallyScreen, type TallyViewModel } from '@/features/tally/TallyScreen';

import { fireEvent, renderWithTheme } from '../../../test/render';

jest.mock('@/components/PixelIcon', () => ({
  PixelIcon: () => null,
}));

function vm(partial: Partial<TallyViewModel> = {}): TallyViewModel {
  return {
    range: 'week',
    keptCents: 650,
    allTimeCents: 81650,
    savingsCents: 0,
    debtCents: 0,
    items: [
      {
        id: '1',
        userId: 'local',
        kind: 'kept',
        name: 'bubble tea',
        amountCents: 650,
        currency: 'USD',
        category: null,
        note: null,
        photoPath: null,
        tag: null,
        happenedAt: new Date(2026, 10, 4, 15, 12).toISOString(),
        boughtAfterAllAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        dirty: true,
        syncedAt: null,
      },
    ],
    ...partial,
  };
}

describe('TallyScreen', () => {
  it('renders quiet week copy and range control', async () => {
    const onRangeChange = jest.fn();
    const { getByText, getByLabelText } = await renderWithTheme(
      <TallyScreen vm={vm()} onRangeChange={onRangeChange} />,
    );

    expect(getByLabelText('Tally')).toBeTruthy();
    expect(getByText('a quiet week. still counts ♡')).toBeTruthy();
    expect(getByText('bubble tea')).toBeTruthy();
    fireEvent.press(getByText('month'));
    expect(onRangeChange).toHaveBeenCalledWith('month');
  });

  it('renders empty chart state', async () => {
    const { getByText } = await renderWithTheme(
      <TallyScreen
        vm={vm({ range: 'month', keptCents: 0, items: [], allTimeCents: 0 })}
        onRangeChange={() => {}}
      />,
    );
    expect(getByText('ur bars grow from ur first nvm')).toBeTruthy();
  });
});
