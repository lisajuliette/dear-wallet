import { GridPaper } from '@/components/GridPaper';

import { renderWithTheme } from '../../test/render';

describe('GridPaper', () => {
  it('renders a non-interactive overlay', async () => {
    const { getByTestId } = await renderWithTheme(<GridPaper />);
    expect(getByTestId('grid-paper', { includeHiddenElements: true })).toBeTruthy();
  });
});
