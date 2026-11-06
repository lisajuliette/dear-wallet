import { act, waitFor } from '@testing-library/react-native';
import { Pressable, Text, View } from 'react-native';

import { useItems, useKeptTotals } from '@/features/items/hooks';
import * as repository from '@/features/items/repository';

import { fireEvent, renderWithTheme } from '../../../test/render';

jest.mock('@/features/items/repository', () => ({
  listByDay: jest.fn(async () => [{ id: 'day-1' }]),
  listByWeek: jest.fn(async () => [{ id: 'week-1' }]),
  listByMonth: jest.fn(async () => [{ id: 'month-1' }]),
  keptTotalCents: jest.fn(async (_db, _user, bounds, tag?: string) => {
    if (tag === 'savings') return 200;
    if (tag === 'debt') return 50;
    if (bounds == null) return 900;
    return 300;
  }),
}));

const AT = new Date(2026, 10, 6);

function ItemsProbe({ range }: { range: 'day' | 'week' | 'month' }) {
  const api = useItems(range, AT);
  return (
    <View>
      <Text>{api.loading ? 'loading' : 'ready'}</Text>
      <Text>{api.items.map((i) => i.id).join(',')}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="refresh"
        onPress={() => void api.refresh()}
      >
        <Text>refresh</Text>
      </Pressable>
    </View>
  );
}

function TotalsProbe() {
  const api = useKeptTotals('day', AT);
  return (
    <View>
      <Text>{api.loading ? 'loading' : 'ready'}</Text>
      <Text>{`kept:${api.totals.keptCents}`}</Text>
      <Text>{`savings:${api.totals.savingsCents}`}</Text>
      <Text>{`debt:${api.totals.debtCents}`}</Text>
      <Text>{`all:${api.totals.allTimeCents}`}</Text>
    </View>
  );
}

describe('items hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads day items and can refresh', async () => {
    const { getByText, getByLabelText } = await renderWithTheme(<ItemsProbe range="day" />);
    await waitFor(() => expect(getByText('ready')).toBeTruthy());
    expect(getByText('day-1')).toBeTruthy();
    expect(repository.listByDay).toHaveBeenCalled();

    await act(async () => {
      fireEvent.press(getByLabelText('refresh'));
    });
    await waitFor(() => expect(repository.listByDay).toHaveBeenCalledTimes(2));
  });

  it('loads week and month lists', async () => {
    const week = await renderWithTheme(<ItemsProbe range="week" />);
    await waitFor(() => expect(week.getByText('ready')).toBeTruthy());
    expect(repository.listByWeek).toHaveBeenCalled();

    const month = await renderWithTheme(<ItemsProbe range="month" />);
    await waitFor(() => expect(month.getByText('ready')).toBeTruthy());
    expect(repository.listByMonth).toHaveBeenCalled();
  });

  it('loads kept totals for the range', async () => {
    const { getByText } = await renderWithTheme(<TotalsProbe />);
    await waitFor(() => expect(getByText('ready')).toBeTruthy());
    expect(getByText('kept:300')).toBeTruthy();
    expect(getByText('savings:200')).toBeTruthy();
    expect(getByText('debt:50')).toBeTruthy();
    expect(getByText('all:900')).toBeTruthy();
  });
});
