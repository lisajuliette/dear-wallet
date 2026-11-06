# Dear Wallet · Build spec

Version 1.0 · 6 Nov 2026 · iPhone first, Android supported
Stack: React Native + Expo (dev build, expo-router) · NativeWind · Supabase · TypeScript

This is the source of truth for building version 1. Screen-by-screen detail lives in `SCREENS.md`, every UI string in `COPY.md`, and the phased build plan for Cursor in `CURSOR_HANDOVER.md`. The canvas source files in `design-source/` hold the exact pixel values for every artboard.

---

## 1. Product in one paragraph

Dear Wallet makes not buying something feel like a small win. Jazmine logs a thing she wanted but didn't buy in under 10 seconds ("nvm!"), sees a tally of what she kept by day, week and month, keeps a loved list of things she bought and adored, and writes a few lines in a private money diary she can decorate with stickers. Every action gets an instant reward. Weekly and monthly recaps export as 9:16 cards for her TikToks.

### Design rules every feature follows

1. **One thumb, 10 seconds.** Logging needs only an amount and a name. Category, note and photo are optional.
2. **Reward first.** Every completed action gets a visual, sound and haptic response within 300 ms.
3. **No shame.** Nothing is lost for a missed day or for buying the thing after all. Never use "failed", "broke", "overspent", "streak", "missed" or guilt-based notifications.
4. **Out of sight is out of mind.** Home always shows the next easy thing to do.
5. **Novelty is a feature.** Stickers, packs, palettes and milestones keep it fresh.
6. **Private by default.** Diary entries are hers. Nothing is social unless she exports a card.

Wording: the app counts money **kept** (not spent), which is not the same as savings. Optional tags "moved to savings" and "paid off debt" show only as a quiet side total.

---

## 2. Stack and packages

Pin the latest stable versions at project start and keep Expo's recommended versions (`npx expo install`). Use a **development build** (not Expo Go) with the New Architecture enabled.

| Concern | Package |
|---|---|
| App framework | `expo`, `expo-router`, `expo-dev-client`, TypeScript strict |
| Styling | `nativewind` (v4 or newer) + `tailwindcss`, CSS-variable palettes (section 5) |
| Fonts | `expo-font`, `@expo-google-fonts/pacifico`, `@expo-google-fonts/nunito`, `@expo-google-fonts/pixelify-sans` |
| SVG | `react-native-svg`, `react-native-svg-transformer` (import `.svg` as components) |
| Gradients | `expo-linear-gradient` (holo and radial glows as SVG gradients or pre-rendered PNG) |
| Animation | `react-native-reanimated`, `react-native-gesture-handler` |
| Haptics / sound | `expo-haptics`, `expo-audio` |
| Local data | `expo-sqlite` + `drizzle-orm` (typed queries, migrations) |
| Backend | `@supabase/supabase-js`, `@react-native-async-storage/async-storage` (auth session), `@react-native-community/netinfo` |
| Auth | `expo-apple-authentication` (Sign in with Apple), Supabase email/password, Supabase anonymous sign-in |
| App lock | `expo-local-authentication`, `expo-secure-store` (hashed passcode) |
| Photos | `expo-image-picker`, `expo-image-manipulator` (resize to 1080 px, JPEG 0.8), `expo-image` |
| Recap export | `react-native-view-shot`, `expo-media-library`, `expo-sharing` |
| Notifications | `expo-notifications` (local, weekly check-in only) |
| Splash / icon | `expo-splash-screen` config plugin, app icon from `assets/icon` |
| State | `zustand` for UI state (palette, settings, reward queue); database is the source of truth for data |
| Dates / money | `date-fns`; store money as integer cents |

---

## 3. Project structure

```
app/                         expo-router routes (see section 4)
src/
  theme/       theme.ts, ThemeProvider.tsx, fonts.ts
  components/  ui primitives (section 7), one file each, NativeWind classes + tokens() for SVG
  features/
    items/     repository, hooks (useKeptTotals, useItems), validators
    diary/     repository, prompts.ts, hooks
    rewards/   engine.ts (stars, quests, sticker drops, milestones, unlocks), stickers.ts catalogue
    goals/
    recap/     buildRecap.ts, RecapCard.tsx, export.ts
    sync/      outbox.ts, pull.ts, supabase.ts
    lock/      useAppLock.ts
  db/          schema.ts (drizzle), migrations/, client.ts
  lib/         money.ts, dates.ts, haptics.ts, sounds.ts, uuid.ts
assets/        copied from this handover folder (icon, splash, stickers, icons, sounds)
global.css     from tokens/global.css
tailwind.config.js  from tokens/tailwind.config.js
```

---

## 4. Navigation (expo-router)

```
app/
  _layout.tsx                 fonts, ThemeProvider (palette vars), auth bootstrap, app lock gate
  index.tsx                   redirect: onboarding if not onboarded, else (tabs)
  (onboarding)/welcome.tsx · palette.tsx · first-log.tsx
  sign-in.tsx                 modal stack
  lock.tsx                    full-screen gate (Face ID / passcode)
  (tabs)/_layout.tsx          custom Taskbar (home, tally, LOG centre button, diary, collection)
  (tabs)/index.tsx            Home
  (tabs)/tally.tsx
  (tabs)/diary.tsx
  (tabs)/collection.tsx
  log.tsx                     Quick log, presentation: formSheet / transparent modal (bottom sheet)
  reward.tsx                  Reward moment, transparent full-screen modal
  milestone/[id].tsx          full-screen modal, shown once
  item/[id].tsx               Item detail (+ delete confirm sheet inside)
  loved.tsx                   Loved list
  recap.tsx                   Recap (week|month × wanted|loved params)
  goal.tsx
  diary/entry/[id].tsx        new = id "new"
  diary/decorate/[id].tsx
  settings.tsx
```

The centre LOG button opens `log`. Settings opens from the gear on Home. Loved list opens from Tally. Recap opens from the Loved list and from Tally (month menu).

---

## 5. Theming and tokens

All colour comes from `tokens/tokens.json`. There are six palettes; Cloud Candy is the default.

| Palette | Unlock | Lowest contrast: text · outline · button text |
|---|---|---|
| Cloud Candy | free | 7.98 · 3.31 · 4.93 |
| Lilac Sky | free | 6.83 · 3.44 · 5.02 |
| Peach Fuzz | free | 6.66 · 3.17 · 4.80 |
| Peach Soda | 100 nvms logged | 7.32 · 3.53 · 5.29 |
| Orchid Pop | 30 diary lines | 4.65 · 3.16 · 4.54 |
| Midnight CD | $1,000 kept | 10.01 · 5.75 · 12.79 |

"Lowest" means the worst case of `text` over bg1, bg2, c1 to c5 and surface; `outline` over the same; `btnText` over `btn`. All meet WCAG AA (4.5:1 text, 3:1 non-text). **Do not change text, outline or button colours.**

### Runtime palette switching with NativeWind

1. `global.css` declares Cloud Candy as CSS variables (RGB channels).
2. `tailwind.config.js` maps colour names to `rgb(var(--name) / <alpha-value>)`: `bg-bg1`, `bg-c3`, `bg-surface`, `border-outline`, `text-ink`, `bg-btn`, `text-btn-text`, `bg-outline/30`.
3. `ThemeProvider` wraps the app in `<View style={paletteVars(palette)} className="flex-1">`. Changing `palette` in the store recolours everything instantly.
4. For react-native-svg fills, gradients and Reanimated colour interpolation use `tokens(palette)` from `theme.ts`.
5. Settings "try on" previews a locked palette by setting a temporary `previewPalette` in the store; leaving Settings restores `palette`.

### Derived values

`grid` = outline 12%, `shadow` = outline 30%, `ring` = outline 35% (dashed separators, decorative only), `scrim` = bg1 70%, `soft` = text 75% (placeholders and hints only).

### Selected and state rules (contrast fixes)

- Selected chips (recent amounts, filters) use **`btn` fill + `btnText`**, never a pale card tint alone.
- Segmented controls: the selected option gets a card fill **and** a 2 pt outline border; unselected has no border.
- Active taskbar tab: c1 pill **with** a 2 pt outline border, label weight 900, `aria-current`.
- Optional / empty things use a **dashed** 2 pt outline; filled things use solid.
- Errors: message box (c1) with a "!" badge and words, thicker 3 pt field border. Never colour alone.

### Type

Pacifico (script) for titles 20 pt and up, Nunito 600 to 900 for everything readable, Pixelify Sans 500/600 for tallies, window titles and uppercase tags. Amounts are never in script. Respect Dynamic Type: allow scaling up to 1.3× on body text; pixel tallies cap at 1.15×.

### Surfaces and patterns

- Background: vertical gradient bg1 to bg2 with a 22 pt grid-paper overlay (`grid`, 1 pt lines). Build once as an SVG pattern component `<GridPaper/>`.
- Retro window: radius 20, 2 pt outline, surface fill, hard shadow `0 5 0 shadow` (no blur: render as an offset sibling View, see `<HardShadow>`), 36 pt title bar with a checkerboard (12 pt cells, two card colours), heart badge left, title on a surface pill.
- Cloud card: SVG path from `cloudPath(w, h)` (two bumps on the top edge), card fill, 2 pt outline, shadow copy offset 4 pt.
- Holo (`fixed.holo`) only for rare stickers, rare drops, milestones, goal reached and CDs.

---

## 6. Layout and responsiveness

- Designed at 390 × 844 pt. Must work from 375 × 667 (iPhone SE) up. Use safe-area insets, never fixed status-bar offsets.
- **Compact mode** when the window height is under 740 pt (`useWindowDimensions`). The canvas board "Small phone check · 375 × 667" shows every screen in compact mode.
- Scrolling: list screens scroll between the header and the taskbar or bottom buttons. Primary actions (nvm!, save, yay, keep it) are always visible without scrolling.
- Compact rules per screen are in `SCREENS.md` (Quick log hides field labels and merges recent amounts with optional extras into one horizontal chip row; full-screen moments scale their top illustration to 0.8 and tighten spacing).

### Hit areas (from the spec)

Any control drawn smaller than 44 × 44 pt keeps its look but gets an invisible hit area that grows it to at least 44 × 44 pt, centred on the control (`hitSlop` or a transparent `Pressable` wrapper). Hit areas never overlap; where two would, split the overlap down the middle.

| Control | Drawn | hitSlop |
|---|---|---|
| Diary month arrows | 36 pt | 4 |
| Sticker handles (remove, rotate, resize) | 34 pt | 5 |
| Small window close X | 24 pt | 10 |

---

## 7. Component set

Build these as reusable components first (phase 1). Names match the canvas boards "Component set" and "Component set 2".

| Component | Key props | Notes |
|---|---|---|
| `Screen` | `palette?`, `compact` | gradient + GridPaper + safe area |
| `RetroWindow` | `title`, `titleBar: 'pink'\|'mint'\|'butter'\|'holo'`, `right?`, `children` | title bar checker colours: pink = c1/c2, mint = c4/c5, butter = c3/c1 |
| `CloudCard` | `fill: TokenName`, `height`, `children` | width from layout, path via `cloudPath` |
| `HardShadow` | `offset=5`, `radius` | offset copy in `shadow` colour behind children |
| `PillButton` | `variant: primary\|secondary\|surface\|dashed\|link`, `size: lg\|md` | lg 56 to 60 pt, md 44 pt; primary = btn/btnText + shadow; disabled = dashed surface |
| `IconButton` | `icon`, `accessibilityLabel` | 44 × 44, radius 16, surface, 2 pt outline |
| `Segmented` | `options`, `value`, `onChange` | 2 or 3 options, see state rules |
| `Chip` / `TagChip` / `StatusChip` | `selected`, `dashed` | selected = btn fill |
| `PillToggle` | `value`, `onChange`, `label` | role switch, track btn when on / c2 when off |
| `AmountPad` | `onKey(digit\|'.'\|'back')` | 3 × 4, keys c2, Pixelify 24, height 46 (40 compact), haptic tick per key |
| `Taskbar` | `active` | 5 slots, raised LOG button centred with `left: 50% - 36` |
| `ListRow` | `fill`, `title`, `meta`, `amount`, `onPress` | sparkle bullet, radius 15 |
| `BarChart` | `bars[{label, cents}]` | pastel bars cycle c1 to c5, zero = 6 pt dashed stub |
| `SegmentBar` | `value 0..1`, `holo?` | 12 segments, filled = btn |
| `DigitCounter` | `value`, `changed[]` | boxed Pixelify digits, roll animation |
| `CalendarMonth` | `days[{date, star, mood, today}]` | 7 × 6 grid, Monday first |
| `MoodPicker` | `value`, `onChange` | 5 moods: proud, chill, meh, tempted, wobbly |
| `Sticker` | `id`, `size` | renders `assets/stickers/svg/{id}.svg` |
| `StickerCanvas` + `TransformHandles` | `stickers`, `onChange` | pan, pinch, rotate (gesture-handler), handles for one-finger and accessibility |
| `StickerTray` | `items[{id, count}]` | horizontal, count badge, placed = dashed and 55% opacity |
| `Faceplate` | `palette`, `locked`, `selected` | mini phone in its own palette (Settings, Onboarding) |
| `SparkleBurst` | `count=9`, `radius` | angles skip the bottom so text is never covered |
| `Coin` | `size` | c3 coin, dashed inner ring, pixel heart |
| `KindMessage` | `children` | cloud card c2 or c4 with sparkle |
| `BottomSheet` | `title`, `children` | radius 28 top, checker title bar, scrim behind |
| `PreviewBar` | `palette`, `unlockText`, `onRevert` | Settings try-on |
| `RecapCard` | `period`, `kind`, `size` | 1080 × 1920 export, see section 13 |
| `PixelIcon` | `name`, `fill?` | from `assets/icons`, outline = currentColor |
| `EmptyState` | `sticker`, `title`, `body` | friendly, never "nothing here" |

---

## 8. Screens

See `SCREENS.md` for every screen, its states, data and interactions. Version 1 screens: Splash, Onboarding (3), Sign in, App lock, Home, Quick log, Reward, Milestone, Tally, Item detail (+ delete sheet), Loved list, Recap, Diary, Diary entry, Decorate page, Collection, Goal, Settings.

---

## 9. Data model (Supabase)

Run `supabase/schema.sql`. Tables: `profiles`, `items`, `diary_entries`, `page_stickers`, `sticker_awards`, `stars`, `quests`, `milestones`, `unlocks`, `goals`, private storage bucket `item-photos`. Every table has row level security limiting rows to `auth.uid()`.

Key rules:
- Money is integer cents with a currency code (USD for Jazmine).
- `items.kind = 'kept'` requires an amount; loved items may have no price.
- "Bought it after all" sets `bought_after_all_at` (undo clears it). It removes the item from every kept total. Milestones already earned stay.
- Deletes are soft (`deleted_at`) so they sync; purge after 30 days with a scheduled function.

---

## 10. Offline-first and sync

Logging and diary saves must never wait on the network and never show a spinner.

1. **Local first.** All reads and writes go to SQLite (drizzle schema mirrors the Supabase tables plus `dirty` and `synced_at`).
2. **IDs.** Generate uuids on the device (`expo-crypto` `randomUUID`).
3. **Outbox.** Each write marks the row dirty and enqueues `{table, id}`. A sync worker runs on app foreground, on reconnect (NetInfo) and every 60 s while active. It upserts dirty rows to Supabase (`upsert` on primary key) and clears the flag.
4. **Pull.** After push, pull rows with `updated_at > last_pulled_at` per table and merge with last-write-wins on `updated_at`.
5. **Photos.** Saved locally first, uploaded in the background to `item-photos/{user_id}/{item_id}.jpg`, then `photo_path` is set.
6. **Auth before account.** On first launch create a Supabase **anonymous** user so RLS and sync work from day one. "Sign in" later links Apple or email to that same user (`linkIdentity` / `updateUser`), so nothing moves.
7. Quick log shows "offline · saved on ur phone ♡ it syncs when ur back online" when NetInfo reports offline.

---

## 11. Domain logic

### Totals
- Kept total (any range) = sum of `amount_cents` where `kind = 'kept'`, `bought_after_all_at is null`, `deleted_at is null`, `happened_at` in range.
- Tally ranges: day (today, hourly bars optional; v1 shows today's list), week (Mon to Sun bars), month (weekly bars, wk 1 to wk 5).
- Side totals: sums of kept items tagged savings / debt, shown only in the dashed Side totals box.
- All time total sits beside it.

### Stars
- One star per local calendar day on the first log, diary save, decorate or quest. Upsert into `stars`. Stars never reset and there is no streak count anywhere.

### Daily mini quest
- One per day, picked deterministically from the day and the user id so it is stable across devices. Never requires a temptation.
- Quest list: "write one line in ur diary", "add a sticker to a page", "log a loved thing", "peek at ur tally", "pick a mood for today". First day: "write ur first diary line".
- Completing shows the done state on Home ("+1 star on ur calendar, forever").

### Sticker drops (variable reward)
- Every completed log (kept or loved) and every diary save rolls for a sticker.
- Base chance 1 in 3. Pity rule: if 3 actions in a row dropped nothing, the 4th always drops (keeps it surprising without droughts).
- On a drop: 90% common (from unlocked packs), 10% rare holo. Moods are not dropped; they are always available in the mood picker.
- Duplicates are fine and add to the tray count.
- Insert into `sticker_awards`. The Reward moment shows the sticker window when one dropped.

### Milestones (shown once, full screen, after the normal reward)

| id | Trigger | Unlock |
|---|---|---|
| first_nvm | first kept log | none |
| kept_100 | kept total $100 | none |
| kept_250 | $250 | none |
| kept_500 | $500 | sticker pack y2k desk |
| kept_1000 | $1,000 | palette Midnight CD |
| logs_50 | 50 kept logs | sticker pack holo club |
| logs_100 | 100 kept logs | palette Peach Soda |
| diary_10 | 10 diary entries with text | none |
| diary_30 | 30 diary entries with text | palette Orchid Pop |

Real-world comparisons for money milestones (US prices, editable in `rewards/comparisons.ts`): $100 "4 cute tees", $250 "a weekend trip's worth of snacks", $500 "3 concert tickets", $1,000 "a whole new phone". Count milestones use a kind line ("50 lil wins, no streak needed").

### Goals
- One active goal. Progress = kept total since `started_at`. No deadline, no budget.
- Editing the target never reduces progress. Reaching it records `reached_at`, plays the Milestone screen, then offers "pick a new goal" or "keep counting this one".

### Sticker packs
- starter: the 12 commons and 3 rare holo stickers in `assets/stickers`, available from day one. The 5 mood stickers are always available in the mood picker and are not collectibles.
- y2k desk (6 desk stickers, art still to draw) and holo club (more rares, art still to draw) stay locked until their milestone. Locked packs show what unlocks them and progress. Nothing is ever sold.

---

## 12. Rewards, motion, haptics, sound

Full timelines are on the canvas board "Motion notes" (Foundations row). Summary:

**Reward moment (about 1.2 s, tap anywhere skips to the end state)**
0 ms success haptic and veil fade in (200 ms) · coin drops with spring overshoot (0 to 300 ms) · sparkle burst (180 to 500 ms) · tally digits roll up, one keypad blip each (200 to 700 ms) · +$ chip floats up 12 pt (300 to 700 ms) · sticker window pops in, scale 0.85 to 1 (700 to 920 ms) when one dropped · rare: one holo sweep (920 to 1500 ms).

**Milestone (about 1.5 s)**
Haptic and fanfare · window pops, scale 0.7 to 1 (0 to 400 ms) · holo glow fades in (100 to 500 ms) · number counts up from the previous milestone (300 to 900 ms) · comparison card slides up (900 to 1150 ms) · unlock card (1150 to 1400 ms) · buttons enable at 1300 ms.

**Curves:** spring stiffness 220, damping 14, mass 1 for pops; ease-out `cubic-bezier(0.2, 0.8, 0.2, 1)` for fades and slides; stepped digits for counters.

**Reduced motion** (setting and OS preference): every motion becomes one 200 ms fade; final numbers show immediately; the reward stays visible.

**Haptics:** success on log, diary save, milestone; light impact per amount-pad key and toggle; selection on faceplate tap. Respect the haptics setting.

**Sound** (setting, default on, follows silent switch): short original chiptune blips: `coin.wav` (log), `blip.wav` (digit roll, keypad), `sparkle.wav` (sticker drop), `fanfare.wav` (milestone), `rare.wav` (rare drop). Source or compose originals; none are included yet.

Performance: animate transforms and opacity on the UI thread (Reanimated). No animated blur on Android; pre-render glows as PNG and fade them.

---

## 13. Recap cards (9:16, 1080 × 1920 px)

- Variants: week or month × wanted (didn't buy, with prices and kept total) or loved (dates, never prices).
- **Monthly** cards: a holo CD sliding out of a jewel case whose cover reads "nov" with "A DEAR WALLET MIXTAPE" (wanted) or "THE LOVED EDITION" (loved), then a dotted-leader track list. Big month: top 10 by amount plus "+ N more tiny wins". Quiet month (2 or fewer): show them plus "a quiet month is still a hit".
- **Weekly** cards: a big "WEEK_NN.EXE" retro window with coloured rows. Wanted ends with the kept total in boxed digits; loved ends with three stickers.
- Uses the user's current palette. Footer "MADE WITH DEAR WALLET ♡".
- Build: render `RecapCard` off-screen at 360 × 640 pt and capture with `react-native-view-shot` at pixel ratio 3 (= 1080 × 1920 PNG). Save with `expo-media-library` (ask permission at first save), share with `expo-sharing`.
- Exact layout: `design-source/canvas/RecapCard.dc.html` (all sizes are in px for the 1080 canvas).

---

## 14. Notifications

One optional weekly check-in at the time she picks (default Sunday 19:00), scheduled locally with `expo-notifications`. Copy rotates from COPY.md (for example "psst. anything tempt u this week?"). Never guilt-based, never about inactivity. Ask for permission only when she turns it on in Settings or accepts it after the first week.

---

## 15. Auth, onboarding, app lock

- **Onboarding** (skip on every screen): welcome, choose a palette (applies immediately), log the first thing (its nvm! plays the normal reward). Mark `profiles.onboarded_at`.
- **Sign in** (optional, offered from Settings › account and after the first week for backup): Sign in with Apple using the system button from `expo-apple-authentication` (the canvas shows a placeholder), or email and password. Links to the anonymous user. Errors explain in words; loading is the one waiting state in the app.
- **App lock** (off by default, offered after the first diary entry): lock the diary or the whole app. Face ID opens automatically via `expo-local-authentication`; passcode fallback is 6 digits, stored as a salted hash in `expo-secure-store`. No lockout shaming; "forgot passcode" resets via the account.

---

## 16. Privacy and data

- No analytics SDKs in version 1. No ads. No social features.
- Settings › export my data: CSV of items and diary entries plus a zip of photos, shared via the share sheet.
- Settings › account › delete account: confirmation sheet, then Edge Function removes photos and calls `delete_my_account()`.
- Diary text never leaves Supabase except in her own export.

---

## 17. Accessibility

- Every interactive element is a real Pressable with `accessibilityRole` and label; icon-only buttons have labels (see canvas).
- 44 × 44 pt minimum hit areas (section 6).
- Dynamic Type support, reduced motion, colour never the only signal (state rules in section 5).
- VoiceOver order follows visual order; decorative sparkles and patterns are hidden from accessibility.
- Sticker transforms are reachable without gestures through the handles.

---

## 18. Assets (in `assets/`)

| Folder | Contents | Use |
|---|---|---|
| `icon/` | `app-icon-cloud.png` 1024 (default), five palette alternates, SVG sources, `android-adaptive-foreground.png` | `expo.icon`, iOS alternate icons later via a config plugin |
| `splash/` | `splash-icon.png` (transparent logo mark), `splash-reference-1170x2532.png` | native splash = icon on `#F6CDEB`; the full design (gradient, title, tagline) renders as the first in-app screen, then cross-fades to Home in 400 ms |
| `logo/` | `logo-mark.svg`, 1024 PNG | Sign in, App lock, Onboarding |
| `stickers/` | 20 stickers as SVG (with die-cut edge) and PNG @3x | `Sticker` component, recap cards |
| `icons/` | 25 interface icons, 14-unit grid, outline = `currentColor`, flat fill placeholder | convert with svg-transformer; replace the fill colour with a token prop |

`app.json` essentials:

```json
{
  "expo": {
    "name": "Dear Wallet",
    "scheme": "dearwallet",
    "icon": "./assets/icon/app-icon-cloud.png",
    "userInterfaceStyle": "light",
    "ios": { "supportsTablet": false, "usesAppleSignIn": true, "bundleIdentifier": "com.pixelwitch.dearwallet" },
    "android": { "adaptiveIcon": { "foregroundImage": "./assets/icon/android-adaptive-foreground.png", "backgroundColor": "#F6CDEB" } },
    "plugins": [
      "expo-router",
      ["expo-splash-screen", { "image": "./assets/splash/splash-icon.png", "imageWidth": 200, "backgroundColor": "#F6CDEB" }],
      "expo-apple-authentication",
      ["expo-local-authentication", { "faceIDPermission": "Dear Wallet uses Face ID to keep ur diary private." }],
      ["expo-media-library", { "savePhotosPermission": "Save ur recap cards to Photos." }],
      ["expo-image-picker", { "photosPermission": "Add a photo to a log or loved thing." }],
      "expo-secure-store", "expo-notifications", "expo-font"
    ]
  }
}
```
Bundle identifier is a placeholder; confirm it.

Fonts load from the `@expo-google-fonts` packages (no font files needed in the repo).

---

## 19. Acceptance checklist (version 1)

- [ ] A kept log (amount + name) saves in under 10 seconds from Home, offline included, and the reward starts within 300 ms.
- [ ] Every colour comes from tokens; switching palette recolours every screen instantly, including SVGs.
- [ ] All six palettes pass the contrast table; selected states follow section 5.
- [ ] Every screen works at 375 × 667 with primary actions visible; hit areas at least 44 pt.
- [ ] No banned words; no streak counters; no guilt notifications.
- [ ] Bought it after all removes from totals and can be undone; milestones stay.
- [ ] Stars, stickers, milestones, unlocks and goal progress match section 11.
- [ ] Decorated pages restore stickers at the same position, scale, rotation and order on another device.
- [ ] Recap cards export at exactly 1080 × 1920 and share.
- [ ] Reduced motion, haptics and sound settings are respected everywhere.
- [ ] RLS verified: a second test user cannot read the first user's rows or photos.
- [ ] Export data and delete account work.

---

## 20. Open questions (from the spec, still unanswered by Jazmine)

2 where she gets tempted (affects share-to-app priority) · 4 weekly check-in day and time · 7 what her first goal is · 8 what feels okay after buying it later (current: kind message, removed from total) · 10 type or voice diary (current: type) · 11 mood sticker every entry or optional (current: optional) · 14 phone usually on silent (current: haptics on, sounds optional) · 15 which palettes free (current: three free, three unlock) · 16 lock diary or whole app (current: offer after first entry) · 18 recap formats (current: both, weekly and monthly) · 19 script font (current: Pacifico) · 20 what goes on the loved list (current: anything, price optional).
