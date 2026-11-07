# Dear Wallet review

Batches 1–9 are in the app. Checked on an iPhone 16 simulator (393×852) after the changes, with the goal-in-progress seed. Shots are in `review/screens/after-*.png`. Unit tests: 245 passed. `tsc --noEmit` is clean.

iPhone SE shows Home with the pinned header. The Pixel 8 shows Home behind the Expo dev menu; the rest of Android was not walked.

## What changed

1. **Collection counts.** `RetroWindow` renders a string `right` as text. MILESTONES shows “0 of 9” and the album shows “0 / 24”. The red toast is gone, so the tab bar accepts taps. `review/screens/after-collection-iphone16.png`.
2. **Home rows open the item.** A today row calls the same item route Tally already uses. The row also shows a clock time (“1:46 pm”) and the window shows the count. The header stays put while the list scrolls, and the goal amount sits on the title row, so the first row clears the tab bar at 852 pt. `review/screens/after-home-iphone16.png`.
3. **Diary.** The star chip says “1 stars”. Calendar days are 40 pt and the empty state uses the short sticker, so “no entries yet. one line is plenty” sits above the tab bar. `review/screens/after-diary-iphone16.png`.
4. **Tally and Recap segments.** The selected option uses `c3`. Quick log stays on `c1`, which is what `QuickLog.dc.html` draws for “didn’t buy”. `review/screens/after-tally-iphone16.png`.
5. **Settings.** Sounds, reduced motion, and app lock have the helper lines from `docs/COPY.md`, and each row has an icon. App lock is a toggle (“face ID on the diary”); turning it on offers diary or the whole app. Export reads “csv + photos” and shares a zip of `items.csv`, `diary.csv`, and any saved photos. `review/screens/after-settings-2-iphone16.png`.
6. **Quick log at 852 pt.** The header is the checker bar with the heart badge. RECENT is its own row; category, note, and photo sit on the next row. Under 740 pt they still share one scrolling row. `review/screens/after-log-iphone16.png`.
7. **Item photo.** Left as the 72 pt dashed bar. `ItemDetail.dc.html` uses that bar for the no-photo state. The large “her photo goes here” window is the stand-in for a photo that exists. Home times are the part of this batch that changed.
8. **Goal.** The explainer is a dashed card. The date is “nov 7”, without the year. `review/screens/after-goal-iphone16.png`.
9. **Collection packs.** Three tiles: starter art, a butter checker with a lock, and a holo tile with a lock. Album slots are 50 pt tall, matching the canvas, so the tiles sit higher.

## Still open

These were not part of the fixes, or were only glanced at.

- The “1 nvms” badge can still read 100% after a seed, because the seed inserts logs without `applyMilestones`. A real log does record the milestone.
- “swap for a different goal” truncates on one line next to “edit goal”.
- Pack labels sit close to the tab bar; a short scroll shows them.
- iPhone SE Home still scrolls to reach TODAY’S NVMS. That matches the small-phone board, which scrolls. `review/screens/after-home-iphone-se.png`.
- Pixel 8 Home rendered (`$6.00`, the stars chip) under the Expo dev menu. Tabs, log, and settings were not opened there.
- Not opened this pass: onboarding, sign in, app lock screens, reward, milestone, loved list, recap, diary entry, decorate, the locked-pack sheet, goal with no goal, goal reached, all six palettes, Reduce Motion, largest Dynamic Type, VoiceOver, offline save, and two-device sync.

## Checks

- `npx jest` — 69 suites, 245 tests, all passed.
- `npx tsc --noEmit` — clean.
- No new hex colours in components. The holo pack uses the `HOLO` tokens.
