import type { TextStyle } from 'react-native';

/** Extra top room Pacifico needs so ascenders (P, f, i-dots) are not clipped. */
export function scriptTextStyle(fontSize: number): TextStyle {
  return {
    fontFamily: 'Pacifico_400Regular',
    fontSize,
    // Script metrics sit high in the em box; default RN line boxes crop them.
    lineHeight: Math.ceil(fontSize * 1.55),
    paddingTop: Math.ceil(fontSize * 0.2),
    includeFontPadding: false,
  };
}
