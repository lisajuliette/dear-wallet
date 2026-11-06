import { Text, type TextProps } from 'react-native';

import { scriptTextStyle } from '@/theme/scriptText';

type ScriptTextProps = TextProps & {
  size?: number;
};

/**
 * Pacifico titles with metrics that keep ascenders visible.
 * Prefer this over `className="font-script"` for display type.
 */
export function ScriptText({ size = 30, style, ...rest }: ScriptTextProps) {
  return <Text style={[scriptTextStyle(size), style]} {...rest} />;
}
