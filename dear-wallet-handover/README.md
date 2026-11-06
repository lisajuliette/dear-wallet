# Dear Wallet · build handover

Everything needed to build version 1 of Dear Wallet in Cursor with React Native, Expo, NativeWind and Supabase.

## Start here
1. Read `docs/CURSOR_HANDOVER.md` for the build phases and acceptance checks, then work through `docs/CURSOR_PROMPTS.md`, pasting one step per Cursor chat.
2. Copy `.cursor/rules/dear-wallet.mdc` into the repo so Cursor follows the project rules in every chat.
3. Keep `docs/BUILD_SPEC.md` and `docs/SCREENS.md` open as context while building.

## Folder map
| Path | What it is |
|---|---|
| `.cursor/rules/dear-wallet.mdc` | Always-on Cursor rules: stack, tokens, design, product and copy rules |
| `docs/BUILD_SPEC.md` | The build spec: stack, structure, routes, theming, components, data model, sync, domain logic, motion, export, auth, privacy, accessibility, acceptance checklist |
| `docs/SCREENS.md` | Every screen: route, states, behaviour and small-phone rules |
| `docs/COPY.md` | All UI strings, voice rules, prompts, quests and notifications |
| `docs/CURSOR_HANDOVER.md` | Phased build plan for Cursor with acceptance checks |
| `docs/CURSOR_PROMPTS.md` | The prompts to paste into Cursor, step by step, with lint, test and commit loops |
| `docs/reference/` | The original draft design spec (PDF) |
| `tokens/tokens.json` | All design tokens: six palettes with unlock rules, type, radius, shadow, spacing, motion |
| `tokens/theme.ts` | Palette helpers: `paletteVars()` for NativeWind, `tokens()` for SVG and Reanimated, `HOLO`, `cloudPath()` |
| `tokens/tailwind.config.js`, `tokens/global.css` | NativeWind setup with palette CSS variables |
| `supabase/schema.sql` | Tables, RLS, triggers, storage bucket and account deletion RPC |
| `assets/icon/` | App icon in all six palettes (SVG + 1024 PNG) and the Android adaptive foreground |
| `assets/logo/`, `assets/splash/` | Logo mark, native splash icon, full splash reference |
| `assets/stickers/` | 20 starter stickers (12 common, 5 mood, 3 rare holo) as SVG and @3x PNG |
| `assets/icons/` | 25 pixel UI icons (SVG, `currentColor`) |
| `design-source/canvas/` | The design canvas source files, one per artboard, used as the pixel spec |

## Design canvas
All screens, states, the six-palette matrix, the 375 × 667 check, motion notes and the component set:
https://claude.ai/artifact/MgLbtHTz191yCqEy7FZwZc
It's private to the owner. Share it from the artifact page before sending this folder to anyone else.

## Known gaps
- Sounds (chiptune blips, keypad tones) are not included. Source or commission them; the slots are listed in BUILD_SPEC.
- The y2k desk and holo club sticker pack art is not drawn yet; only their locked silhouettes exist.
- The bundle id `com.pixelwitch.dearwallet` is a placeholder.
- "Dear Wallet" is a placeholder name.
- The small-phone layouts were set from the layout numbers; check them on an iPhone SE simulator in phase 10.
