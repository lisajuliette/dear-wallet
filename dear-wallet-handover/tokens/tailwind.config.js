// Dear Wallet NativeWind config. Colours point at CSS variables set by paletteVars() in theme.ts,
// so changing the palette at runtime recolours every class without re-rendering styles by hand.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg1: token('bg1'), bg2: token('bg2'),
        c1: token('c1'), c2: token('c2'), c3: token('c3'), c4: token('c4'), c5: token('c5'),
        surface: token('surface'), outline: token('outline'), ink: token('text'),
        btn: token('btn'), 'btn-text': token('btnText'),
      },
      fontFamily: {
        script: ['Pacifico_400Regular'],
        sans: ['Nunito_700Bold'],
        'sans-semibold': ['Nunito_600SemiBold'],
        'sans-extrabold': ['Nunito_800ExtraBold'],
        'sans-black': ['Nunito_900Black'],
        pixel: ['PixelifySans_500Medium'],
        'pixel-semibold': ['PixelifySans_600SemiBold'],
      },
      borderWidth: { DEFAULT: '2px', 3: '3px' },
      borderRadius: { key: '16px', row: '15px', card: '20px', window: '20px', sheet: '28px' },
      letterSpacing: { tag: '0.06em' },
      spacing: { gutter: '16px', tap: '44px', titlebar: '36px' },
    },
  },
  plugins: [],
};
// Usage: text-ink, bg-surface, border-outline, bg-btn text-btn-text, bg-outline/30 (shadow), font-pixel uppercase tracking-tag.
// Hard shadows (0 5 0) are not a Tailwind default in RN: use the <HardShadow> wrapper from the component spec.
