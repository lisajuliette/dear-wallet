import type { Item } from '@/db/schema';
import { ItemDetailScreen } from '@/features/items/ItemDetailScreen';

import { fireEvent, renderWithTheme } from '../../../test/render';

jest.mock('@/components/PixelIcon', () => ({
  PixelIcon: () => null,
}));

function item(partial: Partial<Item> = {}): Item {
  return {
    id: 'item-1',
    userId: 'local',
    kind: 'kept',
    name: 'platform sneakers',
    amountCents: 2400,
    currency: 'USD',
    category: 'shoes',
    note: 'cute but not needed',
    photoPath: null,
    tag: null,
    happenedAt: new Date(2026, 10, 6, 15, 12).toISOString(),
    boughtAfterAllAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    dirty: true,
    syncedAt: null,
    ...partial,
  };
}

describe('ItemDetailScreen', () => {
  it('marks bought after all and can undo', async () => {
    const onBoughtAfterAll = jest.fn();
    const onUndoBought = jest.fn();
    const kept = await renderWithTheme(
      <ItemDetailScreen
        item={item()}
        onAddPhoto={() => {}}
        onToggleTag={() => {}}
        onBoughtAfterAll={onBoughtAfterAll}
        onUndoBought={onUndoBought}
        onRequestDelete={() => {}}
      />,
    );

    fireEvent.press(kept.getByLabelText('i bought it after all'));
    expect(onBoughtAfterAll).toHaveBeenCalled();

    const bought = await renderWithTheme(
      <ItemDetailScreen
        item={item({ boughtAfterAllAt: new Date().toISOString() })}
        onAddPhoto={() => {}}
        onToggleTag={() => {}}
        onBoughtAfterAll={onBoughtAfterAll}
        onUndoBought={onUndoBought}
        onRequestDelete={() => {}}
      />,
    );

    expect(bought.getByText('not in ur tally anymore')).toBeTruthy();
    expect(bought.getByText('all good. u still paused, and that counts.')).toBeTruthy();
    fireEvent.press(bought.getByLabelText("undo, i didn't buy it"));
    expect(onUndoBought).toHaveBeenCalled();
  });
});
