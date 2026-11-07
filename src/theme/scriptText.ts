import type { TextStyle } from 'react-native';

/** Room above and below Pacifico so ascenders and descenders (y, g) stay visible. */
export function scriptTextStyle(fontSize: number): TextStyle {
  return {
    fontFamily: 'Pacifico_400Regular',
    fontSize,
    // Script metrics spill past the em box; the line box has to be taller than the size.
    // Pacifico draws the tail of y below a normal em box. The line has to be
    // tall enough that iOS keeps that tail inside the text, not under the next view.
    lineHeight: Math.ceil(fontSize * 2.15),
    paddingTop: Math.ceil(fontSize * 0.08),
    paddingBottom: Math.ceil(fontSize * 0.5),
    includeFontPadding: false,
  };
}
