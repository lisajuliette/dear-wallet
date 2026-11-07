# Changelog

All notable changes to Dear Wallet are listed here.

## 1.0.0 — 2026-11-07

First TestFlight release. Soft Y2K money diary for iPhone.

### Added

- Theme system with six faceplate palettes, NativeWind tokens, Pacifico / Nunito / Pixelify Sans
- UI primitives: windows, pills, pads, stickers, taskbar, hard shadows
- Local-first SQLite + Drizzle store (money in integer cents, client uuids, outbox)
- Home, Quick log, and reward moments (offline-first, no shame copy)
- Tally, item detail, loved list, bought-after-all with undo
- Diary calendar, lined entry, Decorate with sticker tray and gestures
- Milestones, Collection album, and one active Goal (progress never drops)
- Recap cards (week/month × wanted/loved) at 1080×1920, save to Photos and share
- Settings: faceplates + try-on, sounds/haptics/reduced motion, weekly check-in, currency, Face ID / passcode app lock, export, account
- Splash hand-off and three-step onboarding (welcome → palette → first log)
- Anonymous Supabase auth, Sign in with Apple / email linking, offline outbox sync
- Accessibility pass for small phones (375×667), labels, and Decorate without drag
- Maestro e2e flows for first launch, offline log, diary decorate, palette try-on, recap export

### Privacy

- No analytics or tracking SDKs
- Diary stays private; sync is optional backup to the user's own Supabase project
