import { DeleteConfirmSheet } from '@/features/items/DeleteConfirmSheet';

import { fireEvent, renderWithTheme } from '../../../test/render';

jest.mock('@/components/Sticker', () => ({
  Sticker: () => null,
}));

describe('DeleteConfirmSheet', () => {
  it('keep it closes without deleting', async () => {
    const onKeep = jest.fn();
    const onDelete = jest.fn();
    const { getByLabelText } = await renderWithTheme(
      <DeleteConfirmSheet visible name="platform sneakers" onKeep={onKeep} onDelete={onDelete} />,
    );

    expect(getByLabelText('Delete confirmation')).toBeTruthy();
    fireEvent.press(getByLabelText('keep it'));
    expect(onKeep).toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('yes, delete it confirms deletion', async () => {
    const onKeep = jest.fn();
    const onDelete = jest.fn();
    const { getByLabelText, getByText } = await renderWithTheme(
      <DeleteConfirmSheet visible name="platform sneakers" onKeep={onKeep} onDelete={onDelete} />,
    );

    expect(getByText('delete platform sneakers?')).toBeTruthy();
    fireEvent.press(getByLabelText('yes, delete it'));
    expect(onDelete).toHaveBeenCalled();
    expect(onKeep).not.toHaveBeenCalled();
  });
});
