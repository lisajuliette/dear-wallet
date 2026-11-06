import { act } from '@testing-library/react-native';

import { QuickLogForm } from '@/features/log/QuickLogForm';

import { fireEvent, renderWithTheme } from '../../../test/render';

describe('QuickLogForm enable rules', () => {
  it('keeps nvm disabled until amount and name exist for kept', async () => {
    const onSave = jest.fn();
    const { getByRole, getByLabelText } = await renderWithTheme(
      <QuickLogForm onSave={onSave} onClose={() => {}} />,
    );

    expect(getByRole('button', { name: 'nvm!' })).toBeDisabled();

    await act(async () => {
      fireEvent.changeText(getByLabelText('What was it'), 'matcha');
    });
    expect(getByRole('button', { name: 'nvm!' })).toBeDisabled();

    await act(async () => {
      fireEvent.press(getByRole('button', { name: '$12.00' }));
    });
    expect(getByRole('button', { name: 'nvm!' })).not.toBeDisabled();

    await act(async () => {
      fireEvent.press(getByRole('button', { name: 'nvm!' }));
    });
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ kind: 'kept', name: 'matcha', amountCents: 1200 }),
    );
  });

  it('enables nvm for loved with only a name', async () => {
    const onSave = jest.fn();
    const { getByRole, getByLabelText } = await renderWithTheme(
      <QuickLogForm initialKind="loved" onSave={onSave} onClose={() => {}} />,
    );

    await act(async () => {
      fireEvent.changeText(getByLabelText('What was it'), 'thrift coat');
    });
    expect(getByRole('button', { name: 'nvm!' })).not.toBeDisabled();

    await act(async () => {
      fireEvent.press(getByRole('button', { name: 'nvm!' }));
    });
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ kind: 'loved', name: 'thrift coat' }),
    );
  });
});
