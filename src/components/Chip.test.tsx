import { Chip } from '@/components/Chip';

import { renderWithTheme } from '../../test/render';

describe('Chip', () => {
  it('exposes selected state for filters', async () => {
    const { getByRole } = await renderWithTheme(<Chip label="$12" selected />);
    expect(getByRole('button', { name: '$12' }).props.accessibilityState).toMatchObject({
      selected: true,
    });
  });

  it('supports a dashed empty state', async () => {
    const { getByRole } = await renderWithTheme(<Chip label="add tag" dashed />);
    expect(getByRole('button', { name: 'add tag' })).toBeTruthy();
  });
});
