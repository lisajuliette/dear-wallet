import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

/** Jest SVG mocks sometimes land as `{ default: Component }`; unwrap for render. */
export function resolveSvg(mod: FC<SvgProps> | { default: FC<SvgProps> }): FC<SvgProps> {
  if (typeof mod === 'function') return mod;
  return mod.default;
}
