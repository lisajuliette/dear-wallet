import { render, type RenderOptions } from '@testing-library/react-native';
import { type ReactElement } from 'react';

import { ThemeProvider } from '@/theme';

export async function renderWithTheme(ui: ReactElement, options?: RenderOptions) {
  return render(ui, {
    ...options,
    wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
  });
}

export { fireEvent, screen } from '@testing-library/react-native';
