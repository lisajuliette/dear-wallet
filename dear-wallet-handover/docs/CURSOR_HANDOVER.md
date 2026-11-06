# Dear Wallet · Cursor handover

How to build version 1 with Cursor, phase by phase. The exact prompts, including linting, testing and commits, are in `CURSOR_PROMPTS.md`. Each phase is one or a few Cursor sessions. Do them in order; each ends with acceptance checks you can tick off in the simulator.

## Before you start

1. Create the app: `npx create-expo-app@latest dear-wallet -t default` (TypeScript, expo-router). Switch to a development build (`npx expo install expo-dev-client`, then `npx expo run:ios`).
2. Copy from this folder into the repo:
   - `.cursor/rules/dear-wallet.mdc` → repo `.cursor/rules/`
   - `docs/` → repo `docs/` (Cursor reads these as context)
   - `tokens/global.css` → repo root, `tokens/tailwind.config.js` → repo root, `tokens/theme.ts` → `src/theme/theme.ts`, `tokens/tokens.json` → `src/theme/tokens.json`
   - `assets/` → repo `assets/`
   - `design-source/` → repo `design-source/` (reference only, not bundled)
   - `supabase/schema.sql` → repo `supabase/migrations/0001_init.sql`
3. Create a Supabase project, run the migration, enable Anonymous sign-ins, Apple and Email providers. Put the URL and anon key in `.env` as `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
4. In every Cursor chat, reference `@docs/BUILD_SPEC.md` and the screen you're on in `@docs/SCREENS.md`. For exact sizes, point Cursor at the artboard file, for example `@design-source/canvas/Home.dc.html` (inline styles are the exact values in pt; `renderVals()` holds the state data and copy).

## How to read the design-source files

Each `.dc.html` file is one canvas artboard. Treat them as a pixel spec, not code to port:
- `{{t.c3}}` style holes are token names (map to NativeWind classes like `bg-c3`).
- `<sc-if>` blocks are states; `<sc-for>` blocks are lists; `<dc-import name="Taskbar">` is a shared component.
- `data-props` at the bottom lists each screen's states (for example `"state":{"options":["first","empty","active","quest"]}`).
- Sizes are for 390 × 844; compact values (height under 740) are in the same file's `renderVals()`.

---

## Phase 0 · Project foundation
**Ask Cursor:** "Set up NativeWind, fonts and the theme provider exactly as BUILD_SPEC sections 2, 3 and 5. Use theme.ts paletteVars on the root View. Add a dev screen that renders a swatch grid for all six palettes and a palette switcher."
**Done when**
- [ ] `bg-c3`, `text-ink`, `bg-btn text-btn-text`, `border-outline` work and switch instantly with the palette.
- [ ] Pacifico, Nunito (600 to 900) and Pixelify Sans (500, 600) render.
- [ ] Expo dev build runs on iPhone 15 and iPhone SE simulators.

## Phase 1 · Component set
**Ask Cursor:** "Build the components in BUILD_SPEC section 7 in src/components, using design-source/canvas/Components.dc.html and Components_More.dc.html for sizes. Add a /dev/components screen showing each with its states."
Order: Screen + GridPaper, HardShadow, RetroWindow, CloudCard, PillButton, IconButton (with hitSlop helper), Segmented, Chip, PillToggle, AmountPad, Taskbar, ListRow, Sticker, PixelIcon, BottomSheet, EmptyState. The rest come with their screens.
**Done when**
- [ ] Every component uses tokens only (grep for `#` hex colours in src/components returns nothing except `fixed` sticker colours).
- [ ] Selected states follow BUILD_SPEC section 5 (btn fill chips, bordered segments, outlined active tab).
- [ ] Hit areas: every control is at least 44 × 44 pt including hitSlop.

## Phase 2 · Local data and the core loop
**Ask Cursor:** "Create the drizzle schema mirroring supabase/schema.sql in expo-sqlite, plus repositories for items. Build Home, Quick log and Reward per SCREENS.md. Save locally first. Implement the reward engine stub: star per day and the 1 in 3 sticker drop with the pity rule."
**Done when**
- [ ] Logging amount + name from Home takes under 10 seconds and works in airplane mode.
- [ ] The Reward plays within 300 ms of tapping nvm!, tap anywhere skips.
- [ ] Home states match the canvas: first day, nothing today, active, quest completed.

## Phase 3 · Tally, Item detail, Loved list
**Ask Cursor:** "Build Tally (day/week/month, bar chart, all-time, side totals), Item detail with tags, bought it after all (undoable) and the delete sheet, and the Loved list, per SCREENS.md."
**Done when**
- [ ] Totals follow BUILD_SPEC section 11; bought after all drops out of every total and comes back on undo.
- [ ] Loved items never change kept totals.

## Phase 4 · Diary
**Ask Cursor:** "Build Diary (calendar with stars and moods, recent entries), Diary entry (prompt with shuffle, mood picker, 280-char lined box, save rules, saved reward) and Decorate page (StickerCanvas with pan/pinch/rotate, handles, tray) per SCREENS.md. Store sticker positions as page fractions."
**Done when**
- [ ] Saving needs only a mood or one line, plays the diary reward and can drop a sticker.
- [ ] Decorated pages look identical after reinstall and on a second device.
- [ ] Removing a sticker returns it to the tray.

## Phase 5 · Gamification
**Ask Cursor:** "Finish rewards/engine.ts: quests, milestones and unlocks from BUILD_SPEC section 11, the Milestone screen, Collection (album, packs, locked pack sheet) and Goal (none, in progress, reached)."
**Done when**
- [ ] Each milestone shows once, after the normal reward, and stays earned.
- [ ] Unlocking Midnight CD at $1,000 makes it selectable in Settings.
- [ ] Goal progress counts only kept money since the goal started.

## Phase 6 · Recap cards
**Ask Cursor:** "Build RecapCard (month CD and week window variants, wanted and loved, quiet and big) from design-source/canvas/RecapCard.dc.html, the Recap screen with live preview, and export at 1080 × 1920 with view-shot, media library and sharing."
**Done when**
- [ ] Saved PNG is exactly 1080 × 1920 and matches the canvas cards.
- [ ] Loved cards never show prices.

## Phase 7 · Settings, palettes, notifications, app lock
**Ask Cursor:** "Build Settings with the Faceplate row (instant apply, locked try-on with PreviewBar), toggles, weekly check-in scheduling, currency, app lock (diary or app, Face ID with passcode fallback), export data. Build the App lock screens."
**Done when**
- [ ] Tapping a faceplate recolours the app in the same frame; a try-on reverts when leaving Settings.
- [ ] Reduced motion, haptics and sound toggles take effect immediately.

## Phase 8 · Auth and sync
**Ask Cursor:** "Implement anonymous Supabase auth on first launch, Sign in (Apple + email, linking to the anonymous user) with error and loading states, and the outbox/pull sync from BUILD_SPEC section 10, including background photo upload."
**Done when**
- [ ] Two devices signed in to the same account converge within a minute of reconnecting.
- [ ] A second test user cannot read the first user's rows or photos (RLS test).

## Phase 9 · Onboarding, splash, icon
**Ask Cursor:** "Add the three onboarding screens with skip, the native splash plus the in-app splash hand-off, app icon and Android adaptive icon from assets."
**Done when**
- [ ] First launch to first logged nvm works without an account.

## Phase 10 · Polish and QA
- [ ] Walk every screen at 375 × 667 against the canvas board "Small phone check".
- [ ] Walk Home, Tally, Diary entry and Settings in all six palettes against "six palettes".
- [ ] Run the acceptance checklist in BUILD_SPEC section 19.
- [ ] VoiceOver pass on Home, Quick log, Diary entry and Decorate.

---

## Prompting tips for this project

- Paste the state name from the canvas ("Home · quest completed") so Cursor builds the right variant.
- Ask for one screen or component per request; review in the simulator before moving on.
- When Cursor invents a colour, size or string, point it back to tokens.json, the .dc.html file or COPY.md.
- Keep copy lowercase and warm as in COPY.md; never let it add streaks, warnings or "you missed" language.
