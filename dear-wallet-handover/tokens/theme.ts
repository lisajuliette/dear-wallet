// Dear Wallet theme. Drop into src/theme/theme.ts.
// NativeWind v4+: apply a palette by spreading paletteVars(key) into `vars()` on the root View.
import { vars } from 'nativewind';

export type PaletteKey = 'cloud' | 'lilac' | 'peachfuzz' | 'peachsoda' | 'orchid' | 'midnight';
export type TokenName =
  | 'bg1' | 'bg2' | 'c1' | 'c2' | 'c3' | 'c4' | 'c5'
  | 'surface' | 'outline' | 'text' | 'btn' | 'btnText';

export type Unlock =
  | null
  | { type: 'logs'; kind: 'kept'; count: number }
  | { type: 'diary_lines'; count: number }
  | { type: 'kept_total_cents'; amount: number };

export const palettes: Record<PaletteKey, { name: string; unlock: Unlock; colors: Record<TokenName, string> }> = {
  cloud: { name: 'Cloud Candy', unlock: null, colors: { bg1: '#F6CDEB', bg2: '#C6EFDD', c1: '#FDD2EE', c2: '#E1D5FD', c3: '#FDEFC0', c4: '#B4F2DD', c5: '#ADD9FE', surface: '#FFFFFF', outline: '#4A72A8', text: '#2E2F73', btn: '#4A72A8', btnText: '#FFFFFF' } },
  lilac: { name: 'Lilac Sky', unlock: null, colors: { bg1: '#E1CBF2', bg2: '#B9E6EC', c1: '#FAD6EE', c2: '#DBCEF8', c3: '#CBC3F6', c4: '#88C8F6', c5: '#DBCEF8', surface: '#FFFFFF', outline: '#5F52B8', text: '#3A2A66', btn: '#6F60C8', btnText: '#FFFFFF' } },
  peachfuzz: { name: 'Peach Fuzz', unlock: null, colors: { bg1: '#B8B8FF', bg2: '#FFD8BE', c1: '#FFD8BE', c2: '#B8B8FF', c3: '#FFEEDD', c4: '#FFD8BE', c5: '#B8B8FF', surface: '#F8F7FF', outline: '#5F4FD6', text: '#3A2A66', btn: '#6F5CE8', btnText: '#FFFFFF' } },
  peachsoda: { name: 'Peach Soda', unlock: { type: 'logs', kind: 'kept', count: 100 }, colors: { bg1: '#F9D2CC', bg2: '#FAC7C3', c1: '#FAC7C3', c2: '#E4D6F2', c3: '#FFEEDD', c4: '#E4D6F2', c5: '#FAC7C3', surface: '#FFF6F2', outline: '#835AA5', text: '#4B2A7B', btn: '#835AA5', btnText: '#FFFFFF' } },
  orchid: { name: 'Orchid Pop', unlock: { type: 'diary_lines', count: 30 }, colors: { bg1: '#FFEAFC', bg2: '#BEDA62', c1: '#FFEAFC', c2: '#9D96FF', c3: '#FAC75A', c4: '#BEDA62', c5: '#9D96FF', surface: '#FFFFFF', outline: '#8E1E78', text: '#5B1E58', btn: '#C936AE', btnText: '#FFFFFF' } },
  midnight: { name: 'Midnight CD', unlock: { type: 'kept_total_cents', amount: 100000 }, colors: { bg1: '#1C1838', bg2: '#2A2350', c1: '#332B60', c2: '#3F3574', c3: '#332B60', c4: '#3F3574', c5: '#332B60', surface: '#2A2350', outline: '#B8B8FF', text: '#F8F7FF', btn: '#FFD8BE', btnText: '#1C1838' } },
};

export const DERIVED = { grid: ['outline', 0.12], shadow: ['outline', 0.3], ring: ['outline', 0.35], scrim: ['bg1', 0.7], soft: ['text', 0.75] } as const;

const channels = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

/** CSS variables for NativeWind, as space-separated RGB channels so `/opacity` utilities work. */
export function paletteVars(key: PaletteKey) {
  const c = palettes[key].colors;
  const v: Record<string, string> = {};
  (Object.keys(c) as TokenName[]).forEach((k) => (v[`--${k}`] = channels(c[k])));
  return vars(v);
}

/** Plain hex + derived rgba values for places NativeWind can't reach (react-native-svg fills, gradients, Reanimated). */
export function tokens(key: PaletteKey) {
  const c = palettes[key].colors;
  const rgba = (hex: string, a: number) => `rgba(${channels(hex).split(' ').join(',')},${a})`;
  return {
    ...c,
    grid: rgba(c.outline, 0.12),
    shadow: rgba(c.outline, 0.3),
    ring: rgba(c.outline, 0.35),
    scrim: rgba(c.bg1, 0.7),
    soft: rgba(c.text, 0.75),
  };
}

export const HOLO = ['#FFC4E6', '#BDEBFF', '#DCCBFF', '#BFF5D8', '#FFEFA8'];

/** Cloud-card outline path (two bumps on the top edge), as drawn on the canvas. w/h in pt, stroke 2. */
export function cloudPath(w: number, h: number) {
  const T = 18, r = 22, W = w - 1, H = h - 1;
  return `M${r + 1} ${T} L28 ${T} A16 16 0 0 1 60 ${T} L64 ${T} A11 11 0 0 1 86 ${T} L${W - r} ${T} A${r} ${r} 0 0 1 ${W} ${T + r} L${W} ${H - r} A${r} ${r} 0 0 1 ${W - r} ${H} L${r + 1} ${H} A${r} ${r} 0 0 1 1 ${H - r} L1 ${T + r} A${r} ${r} 0 0 1 ${r + 1} ${T} Z`;
}
