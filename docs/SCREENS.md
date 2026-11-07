# Dear Wallet · Screens and states

Each screen lists its route, what it shows, its states (all drawn on the canvas), behaviour and compact rules (window height under 740 pt). Canvas artboard names are in brackets; the matching source file is in `design-source/canvas/`.

Base size 390 × 844 pt. Gutter 16 pt. Header at top inset + 10 pt: screen title in Pacifico 30 left, actions right.

---

## Splash  [Splash screen]
- Native splash: `splash-icon.png` centred on `#F6CDEB`.
- First in-app frame: gradient + grid paper, coin-in-cloud logo, "Dear Wallet" (Pacifico 46), tagline, "PRIVATE BY DEFAULT" pill. Holds until fonts and the local database are ready (target under 600 ms), then the coin settles into the cloud with a small bounce and cross-fades to Home (400 ms). Reduced motion: straight cross-fade.
- Compact: logo 200 pt, content top 150.

## Onboarding  [Onboarding 1 · welcome / 2 · choose a palette / 3 · log the first thing]
Three screens max, progress dots and "skip" (to Home) on each.
1. Welcome: logo, "hi, i'm Dear Wallet", three promise rows, "let's go ♡".
2. Choose a palette: the three free faceplates (Faceplate component, scale 1.2). Tapping one recolours the screen immediately and saves `profiles.palette`. Dashed card teases the three locked palettes. "this one ♡".
3. First log: FIRST_NVM.EXE window with name and amount fields and three tap-to-fill chips (horizontal scroll). "nvm!" saves a kept item and opens the Reward. "nothing comes to mind? i'll log later" goes Home.
- Compact: logo 150, faceplates at scale 1, smaller top offsets (values in `Onboarding.dc.html` renderVals `o`).

## Sign in  [Sign in / · error / · loading]
- Logo, title, "back up ur tally + diary, and pick up on any phone". SIGN_IN.EXE window: Sign in with Apple (system button), "or", email, password, primary "sign in", "forgot password?". Footer: "new here? make an account" and the privacy line.
- Error: password field 3 pt border on c1, message box with "!" and words. Button reads "try again".
- Loading: fields fade to 60% and disable, button "signing u in" with three pixel dots.
- Compact: logo hidden, privacy line hidden, 8 pt gaps.

## App lock  [App lock · Face ID / · passcode fallback]
- Face ID: logo, "ur diary is locked ♡", face-scan frame (original drawing, not Apple's glyph), "looking for u…", "use passcode instead".
- Passcode: six dots (filled = btn), round keypad (74 pt, 64 compact) with a Face ID key and delete, "forgot passcode? reset with ur account".

## Home  [Home · first day / nothing logged today / active day / quest completed]
- Header: greeting tag ("HI JAZMINE ♡"), "Dear Wallet", stars chip ("12 stars"), Settings icon button.
- KEPT TODAY window: today's total (Pixelify 48), caption, dashed divider, "this month" total.
- Daily quest cloud card (c2; done = c4 with check and "+1").
- Goal cloud card (c3) with 12-segment bar and "$450 of $600". First day: dashed "i'm keeping money for ___" card with "pick one".
- TODAY'S NVMS window: rows (tap opens Item detail) or a friendly empty state.
- Taskbar, home active.
- States: first day (zero totals, first quest, no goal), nothing logged today ("no temptations today? iconic."), active day (2 rows), quest completed.
- Compact: content scrolls above the taskbar.

## Quick log  [Quick log · empty / filled / photo added / offline]
Bottom sheet over a dimmed Home, checker title bar "QUICK LOG", close X.
- Segmented "didn't buy | loved it" (loved hides nothing but makes amount optional).
- Amount display (Pixelify 52, 44 compact) driven by the amount pad.
- Name field ("bubble tea, shoes, a phone case…" hint).
- Recent amounts: four chips; selected = btn fill.
- Optional extras: category, note, photo (dashed until set).
- Amount pad, then the big "nvm!" button (disabled dashed until amount and name exist; loved needs only a name).
- Offline: "OFFLINE" tag in the title bar and "saved on ur phone ♡ it syncs when ur back online". No spinner ever.
- Save: write locally, dismiss sheet, push the Reward modal.
- Compact: sheet top 40, labels hidden, recent amounts and extras merge into one horizontal chip row, keys 40 pt, nvm! 52 pt.

## Reward moment  [Reward · plain / sticker / rare sticker]
Transparent full-screen modal; the whole screen is one Pressable "tap anywhere to close".
- Coin with pixel heart, two rings, sparkle burst, "+$24.00" chip.
- "nvm!" (Pacifico 46) and "$24 stays with u ♡".
- KEPT THIS MONTH digit counter; changed digits on c1.
- Plain: "+1 star on ur calendar" (first action of the day) and the star count.
- Sticker: NEW STICKER! window with the sticker, name and "added to ur album".
- Rare: holo title bar, holo glow behind the coin, RARE · HOLO tag.
- For a diary save the same family plays (see Diary entry · saved).
- Compact: top cluster scaled 0.8 and moved up 66 pt; text blocks tightened.

## Milestone  [Milestone · unlocks a sticker pack / no unlock]
Shown once per milestone, after the normal reward.
- Tag pill, MILESTONE.EXE window with holo title bar and big number ("$500", unit "KEPT"), headline ("that's actually huge."), comparison cloud card ("3 concert tickets"), unlock card (links to Collection) or a "+1 milestone in ur collection" chip, buttons "save card" and "yay ♡".
- Compact: number 68 pt, tighter offsets.

## Tally  [Tally · no logs yet / quiet week / busy month]
- Header with "loved list" button.
- Day | week | month segmented.
- KEPT THIS MONTH/WEEK window: total, caption, bar chart (week = Mon to Sun, month = weeks).
- All time box and dashed Side totals box (savings, debt paid).
- List window (rows open Item detail).
- No logs yet: dashed empty chart "ur bars grow from ur first nvm". Quiet week: one bar, "a quiet week. still counts ♡".
- Compact: scrolls above the taskbar.

## Item detail  [Item detail · kept / tagged / bought after all / no photo / delete confirmation]
- Back, ITEM title pill, edit.
- Photo window (or dashed "+ add a photo · optional").
- Name, status chip (KEPT ♡ or BOUGHT AFTER ALL), amount.
- Bought after all: amount struck through, "not in ur tally anymore", kind message card "all good. u still paused, and that counts.", button "undo, i didn't buy it". Tags hidden.
- DETAILS window: when, category, note.
- Tags: "moved to savings" / "paid off debt" (dashed off, solid c4 with check when on; one at a time).
- "i bought it after all" and "delete item".
- Delete confirmation sheet: wobbly sticker, "delete platform sneakers?", "this one can't be undone", dashed hint pointing to bought it after all, primary "keep it", outline "yes, delete it".

## Loved list  [Loved list · empty / filled month]
- Back to Tally, "Loved", "add" (opens Quick log in loved mode), month switcher with count.
- Two-column photo-led cards; without a photo the card shows a sticker. Price optional.
- "make my november recap" opens Recap (loved).
- Empty: pixel heart sticker, "nothing loved yet this month", "+ add a loved thing", note that loved things never change the kept total.

## Recap  [Recap · monthly wanted, big month / monthly loved / weekly wanted / quiet month]
- Week | month and wanted | loved segmented side by side.
- Live preview of the real RecapCard (216 × 384, scale 0.196; compact 146 × 259) with a 9:16 badge.
- Track list window: top 3 rows (2 compact) and "+ N more".
- "save" (to Photos) and "share" (share sheet).

## Recap cards  [Recap card · month · wanted · big / month · loved / month · quiet / week · wanted / week · loved]
1080 × 1920 px. See BUILD_SPEC section 13.

## Diary  [Diary · today with logs / today empty / a past day / last month]
- Header: "Diary" in the text colour, stars chip ("1 star", "12 stars"), lock settings. The header sits on a solid background that fades out, so the page never shows above it.
- TODAY'S PROMPT cloud. A 44 pt shuffle button swaps the prompt. No prompt repeats within 7 days. VoiceOver hears the new line. Hidden when daily prompts are off.
- Month window: month arrows (36 pt, hit area 44). Next is off on the current month. Previous stops at the month of the first log or diary page. A "today" chip shows when another month is open.
- Calendar, Monday first. 36 pt cells, 3 pt row gaps, 4 pt column gaps. Tapping a day selects it and scrolls that day's card into view. Future days are faded and do nothing. Selected = button fill and button text; today keeps a button-coloured outline. A mood sticker means a page. A butter tile with a star means showed up. Legend: "wrote a page", "showed up".
- Day card: "FRI 6 NOV", a today chip, "+1 star" when that day earned one. Kept total in pixel type and a "{n} nvm · {n} loved" chip. Bought-after-all logs are left out. Loved logs show ♡. Tap a log for its detail. The page is a lined preview; tap it to open. Quiet today: "nothing logged today, and that's fine" / "one line or just a mood counts". Quiet past day: "a quiet day. that's allowed ♡" / "no nvms and no page on this day".
- Write lives on the day card. No page: the filled button, pencil, "write today's page", and a heart icon. It opens a new page dated to that day, and sits under the total, or under the quiet line when the day is empty. A day that already has a page uses the ghost button: "open today's page" or "open this page".
- Compact: scrolls above the taskbar. The today's-page button stays in the first screen on iPhone SE.

## Diary entry  [Diary entry · new / editing / saved reward]
- Retro window filling the screen (12 pt side margins): title "NOV 6 · NEW ENTRY", close.
- Prompt box (c2) with shuffle (no repeats within a week).
- Mood picker (optional).
- "Dear Wallet," heading (Pacifico 24) and a lined text box, 280 characters, counter, "only u can see this".
- New: save disabled until a mood or text exists; "a mood or one line is enough to save. stickers come after."
- Editing: "decorate" (opens Decorate page) and "save ♡".
- Saved reward: big star with burst and "+1 ✦", "saved!" and "u showed up today ♡", the entry as a tilted card, a NEW STICKER card when one dropped, tap anywhere to close.
- Compact: text box min height 110; saved reward cluster scaled 0.8.

## Decorate page  [Decorate · blank page / decorated page / tray empty]
- Back to entry, title pill "NOV 5 · DECORATE", "done".
- Diary page: lined grid paper with a pink margin line, date, mood sticker, "Dear Wallet," and the text.
- Placed stickers: drag to move, pinch to resize (0.4 to 2.5), twist to rotate. Selected sticker shows a dashed box and three handles (remove back to tray, rotate, resize; 34 pt + hitSlop 5). Positions save as fractions of the page so they restore on any phone.
- Hint pill: "drag · pinch to resize · twist to rotate" (blank: "drag up · drop anywhere").
- Sticker tray (bottom sheet, 168 pt; 150 compact): earned stickers with count badges, rare tiles on a dark ground, placed ones dashed at 55%.
- Blank page: dashed drop area "this page is all urs". Tray empty: "all stuck! ur page looks cute" and how to earn more.
- Compact: page height = screen height minus header, tray and hint; sticker y positions scale with it.

## Collection  [Collection · mostly empty / partly filled / locked pack]
- Header with stars chip.
- MILESTONES window: four badges (done = c3 with star, next = dashed with percentage, locked = dashed with lock) and "3 of 9".
- STICKER ALBUM window: 6-column grid of owned stickers and dashed "?" slots, "9 / 24", hint line.
- STICKER PACKS: starter, y2k desk (locked), holo club (locked). Tapping a locked pack opens a sheet: silhouettes, what's inside, "it opens on its own when ur kept total hits $500", progress bar, "$25.50 to go ♡", "cute, got it".
- Compact: scrolls above the taskbar.

## Goal  [Goal · no goal / in progress / reached]
- No goal: star sticker, "no goal right now, and that's okay", idea chips, "or name ur own", "next: how much?" (then an amount pad step, same as Quick log).
- In progress: KEEPING MONEY FOR window with tickets drawing, name, "$450 of $600", 12-segment bar, "75% · $150 to go", Since and "nvms that helped" boxes, dashed explainer, "edit goal", "swap for a different goal".
- Reached: holo title bar and bar, "u did it!!", "$600 kept for concert tickets. go enjoy it, or don't. ur call ♡", stickers, "pick a new goal", "keep counting this one".

## Settings  [Settings · tap a faceplate to preview / · previewing a locked palette]
- FACEPLATES window: horizontal row of six Faceplates with names and status ("on", "free", unlock condition). Selected = btn ring + check badge; locked = lock badge.
- Tapping any faceplate recolours the whole app immediately. Free ones apply and save. Locked ones are a try-on: a preview bar shows "trying on Midnight CD", "unlocks at $1,000 kept · $525.50 to go" and "back to Cloud Candy". Leaving Settings reverts a try-on.
- SETTINGS.EXE list: sounds, haptics, reduced motion (toggles), weekly check-in (day and time picker), currency, app lock (toggle plus diary or whole app), export my data, account (sign in / out, delete account).
- Compact: the list window scrolls inside itself.
