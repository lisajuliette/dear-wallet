import { buildRecap } from '@/features/recap/buildRecap';
import { RecapCard } from '@/features/recap/RecapCard';

import { renderWithTheme } from '../../../test/render';

const at = new Date(2026, 10, 15);

describe('RecapCard', () => {
  it('renders month wanted (big)', async () => {
    const data = buildRecap({
      period: 'month',
      kind: 'wanted',
      at,
      items: Array.from({ length: 5 }, (_, i) => ({
        id: `k-${i}`,
        name: `item ${i}`,
        kind: 'kept' as const,
        amountCents: (5 - i) * 1000,
        happenedAt: '2026-11-10T12:00:00.000Z',
      })),
    });
    const { getByLabelText, getByText } = await renderWithTheme(<RecapCard data={data} />);
    expect(getByLabelText('Recap card')).toBeTruthy();
    expect(getByText("wanted but didn't")).toBeTruthy();
    expect(getByText('A DEAR WALLET MIXTAPE')).toBeTruthy();
  });

  it('renders month quiet and loved + week variants', async () => {
    const quiet = buildRecap({
      period: 'month',
      kind: 'wanted',
      at,
      items: [
        {
          id: 'a',
          name: 'tea',
          kind: 'kept',
          amountCents: 400,
          happenedAt: '2026-11-02T12:00:00.000Z',
        },
      ],
    });
    const loved = buildRecap({
      period: 'month',
      kind: 'loved',
      at,
      items: [
        {
          id: 'l',
          name: 'show',
          kind: 'loved',
          amountCents: null,
          happenedAt: '2026-11-03T12:00:00.000Z',
        },
      ],
    });
    const week = buildRecap({
      period: 'week',
      kind: 'wanted',
      at,
      items: [
        {
          id: 'w',
          name: 'shoes',
          kind: 'kept',
          amountCents: 6500,
          happenedAt: '2026-11-12T12:00:00.000Z',
        },
      ],
    });

    const quietUi = await renderWithTheme(<RecapCard data={quiet} />);
    expect(quietUi.getByText('a quiet month is still a hit')).toBeTruthy();

    const lovedUi = await renderWithTheme(<RecapCard data={loved} />);
    expect(lovedUi.getByText('THE LOVED EDITION')).toBeTruthy();
    expect(lovedUi.queryByText('$')).toBeNull();

    const weekUi = await renderWithTheme(<RecapCard data={week} />);
    expect(weekUi.getByText('KEPT THIS WEEK')).toBeTruthy();
    expect(weekUi.getByText('shoes')).toBeTruthy();
  });
});
