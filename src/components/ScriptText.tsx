import { Text, type TextProps } from 'react-native';

import { scriptTextStyle, useTokens } from '@/theme';

type ScriptTextProps = TextProps & {
  size?: number;
};

/**
 * Pacifico titles with metrics that keep ascenders visible.
 * Prefer this over `className="font-script"` for display type.
 */
/** Caps Dynamic Type so Pacifico titles stay on one line at the largest size. */
const TITLE_MAX_SCALE = 1.35;

export function ScriptText({ size = 30, style, maxFontSizeMultiplier, ...rest }: ScriptTextProps) {
  const t = useTokens();
  return (
    <Text
      maxFontSizeMultiplier={maxFontSizeMultiplier ?? TITLE_MAX_SCALE}
      style={[scriptTextStyle(size), { color: t.text }, style]}
      {...rest}
    />
  );
}
