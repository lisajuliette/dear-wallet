# Dear Wallet · Cursor prompts, start to finish

Paste these into Cursor's Agent chat, in order. Each step builds one slice, proves it with lint, types and tests, then commits. The phase checklists in `CURSOR_HANDOVER.md` are the acceptance checks for the simulator; this file holds the prompts you send.

## How to use this file

- Start a **new chat for each step**, so Cursor's context stays small and focused.
- Each step's prompt already @-mentions the docs it needs. Add the matching `@design-source/canvas/<Screen>.dc.html` file when a step names a screen.
- Cursor plans first, waits for your "go", then builds. Read the plan; it's the cheapest moment to catch a wrong turn.
- Every step ends with the **Check** prompt and then the **Commit** prompt (below). Don't move on while checks are red.
- One branch per step (`step/05-core-loop`), merged into `main` when the step's acceptance checks pass in the simulator.

## Reusable prompts

**Check** (end of every step)
```
Run `npm run check` (typecheck, lint, format check, unit tests). Fix every failure properly: no `any`, no `eslint-disable`, no skipped or deleted tests, no weakened assertions. If a test reveals the spec and the code disagree, stop and tell me instead of changing the test. Re-run until it's green, then list what you changed.
```

**Commit** (after Check is green)
```
Show me `git status` and a short summary of the diff. Then stage only the files that belong to this step and commit with a Conventional Commit message (type(scope): summary, body with bullet points of what changed and why). Split into several commits if the work covers clearly separate concerns. Don't commit .env, build output or generated native folders. Then push the branch.
```

**Merge** (after you've ticked the step's simulator checks)
```
Open a pull request from this branch into main with `gh pr create`, titled after the step, with a body listing what was built and the acceptance checks I confirmed. Wait for CI to pass, then squash-merge it, delete the branch, pull main and create the next branch: step/<NN>-<name>.
```

**Stuck**
```
Stop changing code. Explain in plain words what's failing, what you've tried and the two most likely causes. Suggest one next step and wait for me.
```

**Drift check** (use any time the UI looks off)
```
Compare this screen against @design-source/canvas/<File>.dc.html and @docs/SCREENS.md. List every difference in size, spacing, colour token, font, copy or state. Fix them, using tokens and COPY.md strings only.
```

---

## Step 00 · Repo and scaffold

```
We're starting Dear Wallet, an iPhone-first Expo app. Read @README.md, @docs/BUILD_SPEC.md sections 2 to 4 and @.cursor/rules/dear-wallet.mdc.

1. Scaffold with `npx create-expo-app@latest . -t default` in this folder (TypeScript, expo-router). Remove the template's example screens and components.
2. Set TypeScript to strict with `noUncheckedIndexedAccess`, and add the `@/*` path alias pointing to `src/*`.
3. Add expo-dev-client and enable the New Architecture. Set the iOS bundle id to com.pixelwitch.dearwallet (placeholder) and the name to Dear Wallet.
4. Create the folders from BUILD_SPEC section 3 with an index.ts placeholder where needed.
5. Add a .gitignore covering node_modules, .expo, ios, android, dist, coverage, .env*.
6. `git init` with `main` as the default branch, add a remote if I give you one.

Plan first and wait for my go.
```
Then: run `npx expo run:ios`, confirm a blank app opens, run **Commit** (`chore: scaffold expo app`). Create the GitHub repo (`gh repo create dear-wallet --private --source . --push`) if you haven't already.

## Step 01 · Linting, formatting, testing, hooks and CI

```
Set up the quality tooling before any features. Use the versions `npx expo install` recommends where Expo has an opinion.

1. ESLint: `npx expo lint` to create the flat config with eslint-config-expo. Add eslint-plugin-react-hooks rules as errors, @typescript-eslint/no-explicit-any as error, no-console as warn, and import ordering. Ignore design-source/ and supabase/.
2. Prettier with eslint-config-prettier and prettier-plugin-tailwindcss (so NativeWind classes are sorted). 2 spaces, single quotes, trailing commas, print width 100.
3. Jest with jest-expo preset and @testing-library/react-native. Add a jest.setup.ts that mocks reanimated, expo-haptics, expo-audio and expo-sqlite. Set a coverage threshold of 80% lines for src/features and src/lib only.
4. package.json scripts: typecheck (tsc --noEmit), lint, lint:fix, format, format:check, test, test:watch, test:coverage, and `check` that runs typecheck, lint, format:check and test in that order.
5. Husky + lint-staged: pre-commit runs eslint --fix and prettier on staged files; pre-push runs `npm run check`.
6. commitlint with @commitlint/config-conventional on the commit-msg hook. Allowed scopes: theme, ui, db, items, diary, rewards, goals, recap, settings, lock, auth, sync, onboarding, supabase, ci, deps, docs.
7. GitHub Actions workflow .github/workflows/ci.yml: on push and pull_request, Node LTS, npm ci, npm run check, upload coverage.
8. Add one trivial test (src/lib/money.test.ts testing a placeholder) so the pipeline proves itself.

Plan first and wait for my go.
```
Then: **Check**, **Commit** (`chore(ci): add lint, format, test, hooks and ci`), push and confirm the CI run goes green on GitHub. Make a deliberately bad commit message once to see commitlint reject it.

## Step 02 · Handover files, theme and fonts

```
Read @docs/CURSOR_HANDOVER.md "Before you start" step 2 and @docs/BUILD_SPEC.md section 5.

1. Move the handover files into place exactly as listed there (tokens, assets, docs, design-source, supabase/schema.sql as supabase/migrations/0001_init.sql).
2. Install and configure NativeWind (babel, metro, global.css, nativewind-env.d.ts) using our tailwind.config.js and global.css unchanged.
3. Configure react-native-svg-transformer so .svg files import as components, with a typed declaration.
4. Load Pacifico, Nunito 600/700/800/900 and Pixelify Sans 500/600 in src/theme/fonts.ts; keep the splash up until they're ready.
5. Build src/theme/ThemeProvider.tsx: a zustand store holding the current palette key (and an optional try-on key), applying paletteVars() on the root View, and a useTokens() hook returning tokens(palette) for SVG and Reanimated.
6. Add app/dev/theme.tsx (only in __DEV__): swatch grid for all six palettes, a palette switcher, and a type specimen.
7. Unit tests for theme.ts: every palette has all keys, paletteVars returns RGB channel strings, cloudPath returns a valid path for several sizes.

Plan first and wait for my go.
```
Then: **Check**, open the dev theme screen and switch palettes, **Commit**, **Merge**.

## Step 03 · UI primitives, part 1

```
Build the first half of the component set from @docs/BUILD_SPEC.md section 7, matching @design-source/canvas/Components.dc.html. One file per component in src/components, presentational only, tokens only.

Screen + GridPaper, HardShadow, RetroWindow, CloudCard, PillButton, IconButton (with a hitSlop helper that guarantees 44 x 44 pt), Segmented, Chip, PillToggle.

For each: typed props, accessibilityRole and accessibilityLabel, the selected and disabled states from section 5, and a render test with @testing-library/react-native covering its states and its accessibility props. Add each to app/dev/components.tsx with all its states.

Plan first and wait for my go.
```
Then: **Check**, compare the dev screen with the canvas Components board, **Commit**.

## Step 04 · UI primitives, part 2

```
Build the rest of the shared components from @docs/BUILD_SPEC.md section 7, matching @design-source/canvas/Components.dc.html, @design-source/canvas/Components_More.dc.html and @design-source/canvas/Taskbar.dc.html and @design-source/canvas/Sticker.dc.html.

AmountPad, Taskbar (custom tab bar for expo-router with the centre LOG button), ListRow, Sticker (renders an SVG from assets/stickers by id, with rare holo treatment), PixelIcon (assets/icons via currentColor), BottomSheet, EmptyState, plus anything else section 7 lists as shared.

Same rules as before: tokens only, accessibility props, hit areas, render tests, added to the dev components screen. Add a unit test for AmountPad's input logic (max digits, decimal handling, delete) and a test that fails if any file in src/components contains a hex colour outside the sticker files.

Plan first and wait for my go.
```
Then: **Check**, **Commit**, **Merge**.

## Step 05 · Local database and core libraries

```
Read @docs/BUILD_SPEC.md sections 9, 10 and 11 and @supabase/migrations/0001_init.sql.

1. src/db/schema.ts: drizzle tables mirroring the Supabase schema (same names and columns, money in integer cents, uuid text ids, updated_at, deleted_at), plus a local `outbox` table for sync.
2. src/db/client.ts and drizzle migrations for expo-sqlite, run on app start before the splash hides.
3. src/lib: money.ts (cents to display string by currency, parse from pad input), dates.ts (local day keys, week starting Monday, month ranges), uuid.ts.
4. src/features/items: repository (create, update, softDelete, markBoughtAfterAll, undoBoughtAfterAll, listByDay/Week/Month) that writes the row and an outbox entry in one transaction, plus hooks useItems and useKeptTotals.
5. Unit tests: money formatting and parsing edge cases; week and month boundaries including Monday start and month ends; repository tests against an in-memory sqlite (or a faithful mock) for every total rule in section 11, especially bought-after-all leaving and re-entering totals and loved items never counting.

Plan first and wait for my go.
```
Then: **Check**, **Commit** (probably two commits: `feat(db)` and `feat(items)`), **Merge**.

## Step 06 · Home, Quick log and the Reward

```
Build the core loop. Read @docs/SCREENS.md (Home, Quick log, Reward moment), @docs/BUILD_SPEC.md sections 11 (stars, sticker drops, quests) and 12, @docs/COPY.md, and the files @design-source/canvas/Home.dc.html, QuickLog.dc.html and Reward.dc.html.

1. src/features/rewards/engine.ts, pure functions first: awardStar (one per local day, never resets), rollSticker (1 in 3 with the pity rule on the 4th empty action; 90% common, 10% rare; injectable random source), pickDailyQuest.
2. app/(tabs)/index.tsx Home with all four states.
3. app/log.tsx Quick log as a bottom sheet: segmented didn't buy / loved it, AmountPad, name, recent amounts, optional extras, offline tag. Saves locally with no spinner, then opens the Reward.
4. app/reward.tsx Reward with plain, sticker and rare variants, Reanimated motion from section 12, haptics and sound behind the settings flags, reduced-motion fallback, tap anywhere to close. It must start within 300 ms of tapping nvm!.
5. Tests: engine unit tests with a seeded random (pity rule, rarity split over 10,000 rolls within tolerance, one star per day across midnight); Quick log component test for the enable rules (kept needs amount and name, loved needs name); Home render tests for each state.

Plan first and wait for my go.
```
Then: **Check**, log an item in airplane mode on the simulator, **Commit**, **Merge**.

## Step 07 · Tally, Item detail and Loved list

```
Read @docs/SCREENS.md (Tally, Item detail, Loved list), @docs/BUILD_SPEC.md section 11 totals, @docs/COPY.md, and @design-source/canvas/Tally.dc.html, ItemDetail.dc.html and LovedList.dc.html.

1. Tally with day / week / month, bar chart (react-native-svg), all-time and side totals, list rows to Item detail, and all three states.
2. Item detail with photo (expo-image-picker, resized to 1080 px JPEG 0.8 with expo-image-manipulator, stored locally), tags (one at a time), bought it after all with undo, and the delete confirmation sheet.
3. Loved list with month switcher, two-column cards, empty state, and "add" opening Quick log in loved mode.
4. Tests: chart data builder unit tests; Item detail tests for bought-after-all and undo updating totals; delete sheet test (keep it does nothing, yes deletes and navigates back).

Plan first and wait for my go.
```
Then: **Check**, **Commit**, **Merge**.

## Step 08 · Diary, Diary entry and Decorate

```
Read @docs/SCREENS.md (Diary, Diary entry, Decorate page), @docs/COPY.md prompts and diary copy, and @design-source/canvas/Diary.dc.html, DiaryEntry.dc.html and Decorate.dc.html.

1. src/features/diary: repository, prompts.ts (rotation with no repeats within 7 days, testable with an injected date), hooks.
2. Diary tab: month calendar (Monday first) with star, mood and today cells, month arrows with hitSlop, recent entries, empty state.
3. Diary entry: prompt with shuffle, optional mood, 280-character lined text box with counter, save rules (mood or one line), saved reward reusing the reward engine.
4. Decorate: StickerCanvas with gesture-handler pan, pinch (0.4 to 2.5) and rotation, selected state with three handles, tray bottom sheet with counts, remove back to tray. Store x and y as page fractions and z order.
5. Tests: prompt rotation; save enable rules; a pure function converting between page fractions and pixels for several page sizes, including the compact layout; tray counts after placing and removing.

Plan first and wait for my go.
```
Then: **Check**, decorate a page on iPhone 15, reopen it on the iPhone SE simulator to confirm positions, **Commit**, **Merge**.

## Step 09 · Milestones, Collection and Goal

```
Read @docs/BUILD_SPEC.md section 11 (milestones, goals, sticker packs), @docs/SCREENS.md (Milestone, Collection, Goal), @docs/COPY.md, and @design-source/canvas/Milestone.dc.html, Collection.dc.html and Goal.dc.html.

1. Extend rewards/engine.ts: evaluateMilestones (all nine, shown once, never revoked), unlocks (packs and palettes from tokens.json), and a reward queue so a milestone plays after the normal reward.
2. app/milestone/[id].tsx with both variants and the motion notes from section 12.
3. Collection with milestones, album (owned and "?" slots), packs and the locked pack sheet with progress.
4. Goal with no goal, set-up flow (name then amount pad), in progress and reached; one active goal; progress counts kept money since the goal started and never drops when something is bought after all.
5. Tests: every milestone threshold at, below and above its value; milestones survive items being deleted or bought after all; unlock of Midnight CD at $1,000; goal progress rules.

Plan first and wait for my go.
```
Then: **Check**, **Commit**, **Merge**.

## Step 10 · Recap cards and export

```
Read @docs/BUILD_SPEC.md section 13, @docs/SCREENS.md (Recap, Recap cards) and @design-source/canvas/RecapCard.dc.html and Recap.dc.html.

1. src/features/recap/buildRecap.ts: pure function returning the card data for week or month and wanted or loved, including the quiet variant and "+ N more".
2. RecapCard.tsx: month CD with track list and week window variants, drawn at 1080 x 1920 and scaled for preview.
3. Recap screen with the two segmented controls, live preview and track list window.
4. export.ts: capture the full-size card offscreen with react-native-view-shot, save with expo-media-library (ask permission only on save), share with expo-sharing.
5. Tests: buildRecap for big, quiet and empty periods; loved data never includes prices; a snapshot test of each card variant.

Plan first and wait for my go.
```
Then: **Check**, export a card and confirm it's 1080 x 1920 in Photos, **Commit**, **Merge**.

## Step 11 · Settings, palettes, notifications and app lock

```
Read @docs/SCREENS.md (Settings, App lock), @docs/BUILD_SPEC.md sections 14 and 15, @docs/COPY.md, and @design-source/canvas/Settings.dc.html, Faceplate.dc.html and AppLock.dc.html.

1. Settings: Faceplate row (free ones apply and save, locked ones are a try-on with the preview bar, leaving Settings reverts a try-on), toggles for sounds, haptics and reduced motion wired to the existing flags, weekly check-in day and time, currency, app lock, export my data (JSON via expo-sharing), account.
2. Weekly check-in with expo-notifications: one local repeating notification, copy rotating from COPY.md, rescheduled when changed, permission asked only when switched on.
3. App lock with expo-local-authentication and a six-digit passcode hashed in expo-secure-store; mode diary only or whole app; lock on cold start and after 60 s in background.
4. Tests: try-on revert logic; notification scheduling called with the right trigger; passcode hash and verify; lock gate decides correctly for each mode and background duration.

Plan first and wait for my go.
```
Then: **Check**, **Commit**, **Merge**.

## Step 12 · Supabase project and database tests

```
Read @supabase/migrations/0001_init.sql and @docs/BUILD_SPEC.md sections 9 and 16.

1. Initialise the Supabase CLI in this repo (`supabase init`), keep our migration as the first one, and make `supabase start` and `supabase db reset` work locally.
2. Add pgTAP tests in supabase/tests: RLS lets a user read and write only their own rows on every table; a second user sees nothing; the storage policy blocks other users' photo folders; only one active goal per user; delete_my_account removes everything for that user.
3. Add npm scripts db:start, db:reset, db:test, and a CI job that runs `supabase db start` and `supabase test db`.
4. Generate types with `supabase gen types typescript` into src/features/sync/database.types.ts and add a script for it.
5. Write .env.example with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.

Plan first and wait for my go.
```
Then: **Check**, `npm run db:test`, **Commit** (`feat(supabase)` and `test(supabase)`), **Merge**. Link the hosted project and push the migration (`supabase link`, `supabase db push`) when you're ready.

## Step 13 · Auth and sync

```
Read @docs/BUILD_SPEC.md sections 10 and 15, @docs/SCREENS.md (Sign in) and @design-source/canvas/SignIn.dc.html.

1. src/features/sync/supabase.ts client with AsyncStorage session storage and AppState-based token refresh.
2. Anonymous sign-in on first launch, silently, with no UI.
3. Sign in screen: Sign in with Apple and email/password, both linking to the existing anonymous user so no data is lost; error and loading states; forgot password.
4. Sync: outbox push in order with retry and backoff, pull since the last cursor, last write wins on updated_at, soft deletes, photo upload to the item-photos bucket in the background. Trigger on app foreground, reconnect (netinfo) and after each local write, debounced.
5. Tests: outbox ordering and retry; conflict resolution (newer local wins, newer remote wins, delete vs edit); pull applies remote rows without creating outbox entries; mock the Supabase client.

Plan first and wait for my go.
```
Then: **Check**, test on two simulators with the same account, **Commit**, **Merge**.

## Step 14 · Onboarding, splash and icon

```
Read @docs/SCREENS.md (Splash, Onboarding), @docs/BUILD_SPEC.md section 18 and @design-source/canvas/Onboarding.dc.html and Splash.dc.html.

1. app.json: icon, splash (expo-splash-screen plugin with assets/splash/splash-icon.png on #F6CDEB), Android adaptive icon.
2. In-app splash hand-off with the coin settling into the cloud, then cross-fade to Home; reduced-motion fallback.
3. Onboarding: welcome, choose a palette (instant recolour, saves to the profile), first log (saves a kept item and opens the Reward), skip on every screen, shown once.
4. app/index.tsx redirect logic.
5. Tests: redirect for new and returning users; palette choice persists; skip marks onboarding done.

Plan first and wait for my go.
```
Then: **Check**, delete the app and do a fresh first launch, **Commit**, **Merge**.

## Step 15 · Accessibility, small phones and palettes

```
Do a full QA pass with @docs/BUILD_SPEC.md sections 6, 17 and 19.

1. Every screen at 375 x 667 against @design-source/canvas/SmallPhone.dc.html: fix overflow, clipped text and anything under the taskbar.
2. Home, Tally, Diary entry and Settings in all six palettes against @design-source/canvas/PaletteMatrix.dc.html.
3. Accessibility: labels and roles on every control, VoiceOver order on Home, Quick log, Diary entry and Decorate, Dynamic Type up to the largest size without breaking layouts, reduced motion everywhere, an accessible alternative to drag for Decorate (move and resize actions).
4. Add a test helper that renders each screen and fails if any Pressable lacks an accessibilityLabel.
5. Go through the section 19 acceptance checklist and report each item as pass or fail with what you changed.

Plan first and wait for my go.
```
Then: **Check**, **Commit** (`fix(ui)` and `feat(a11y)` commits), **Merge**.

## Step 16 · End-to-end tests with Maestro

```
Add Maestro end-to-end tests in .maestro/ for the iOS simulator, using testID props (add them where missing):

1. First launch: onboarding, choose a palette, first log, reward closes, Home shows the total.
2. Log an item offline, see it in Tally, mark it bought after all, see the total drop, undo it.
3. Write a diary entry with a mood, save, decorate with one sticker, reopen the page.
4. Switch palettes in Settings, try on a locked one, leave Settings and see it revert.
5. Export a recap card.

Add an npm script e2e and document how to run it in README. Keep them out of the pre-push hook; run them before each release.

Plan first and wait for my go.
```
Then: run `npm run e2e`, **Commit** (`test(e2e)`), **Merge**.

## Step 17 · Release build

```
Prepare the first TestFlight build with EAS.

1. eas.json with development, preview and production profiles; production uses the hosted Supabase env vars as EAS secrets.
2. Version 1.0.0, build number auto-increment, app.json privacy manifest and permission strings in Dear Wallet's voice (photos, media library, Face ID, notifications).
3. Confirm no analytics or tracking SDKs are present and no console logs ship in production.
4. Update CHANGELOG.md from the commit history since the first commit.
5. Tell me the exact commands to build and submit, and what I need in App Store Connect.

Plan first and wait for my go.
```
Then: **Check**, **Commit** (`chore(release): 1.0.0`), **Merge**, tag it (`git tag v1.0.0 && git push --tags`), run `eas build -p ios --profile production` and `eas submit -p ios`.
