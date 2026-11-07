# Testing Dear Wallet

How to boot the simulators, drive the app, shoot screenshots, record motion, and load review data. Commands were checked on this machine (Xcode 26.6, iOS 26.5 runtime, Maestro 2.12.1).

`design/reference/` holds the exported artboards. Compare screens to those images and to `design-source/canvas/*.dc.html`.

## Devices

Only the iOS 26.5 runtime is installed. iPhone 16 and iPhone SE (3rd generation) were not in the default device list, so create them once:

```bash
xcrun simctl create "iPhone 16" \
  com.apple.CoreSimulator.SimDeviceType.iPhone-16 \
  com.apple.CoreSimulator.SimRuntime.iOS-26-5

xcrun simctl create "iPhone SE (3rd generation)" \
  com.apple.CoreSimulator.SimDeviceType.iPhone-SE-3rd-generation \
  com.apple.CoreSimulator.SimRuntime.iOS-26-5
```

Confirmed point sizes from screenshots: iPhone 16 is 1179×2556 px (393×852 @3x). iPhone SE is 750×1334 px (375×667 @2x).

Android uses a Pixel 8 AVD (1080×2400, density 420) named `Pixel_8`, on the installed `android-37.1` system image and the `pixel_8` skin. `emulator -list-avds` should include `Pixel_8`.

## Boot and install

Metro has to be on port 8081. The Maestro helpers open `exp+dear-wallet://expo-development-client/?url=http://127.0.0.1:8081`.

```bash
npx expo start
```

iOS dev client (native build, then install). Pass the device name. The binary can be installed on the other simulator without a second compile:

```bash
xcrun simctl boot "iPhone 16"
open -a Simulator
npx expo run:ios --device "iPhone 16"

# second phone, same .app
xcrun simctl boot "iPhone SE (3rd generation)"
xcrun simctl install booted \
  ~/Library/Developer/Xcode/DerivedData/DearWallet-*/Build/Products/Debug-iphonesimulator/DearWallet.app
```

`booted` is ambiguous when two simulators are running. Pass the UDID from `xcrun simctl list devices` to `simctl` and to Maestro (`maestro --udid <udid>`).

Android, with the Pixel 8 emulator already running (`emulator -avd Pixel_8`):

```bash
npx expo run:android
```

The first Android run generates `android/` (gitignored). Do not edit it by hand.

## Driving the app

Maestro CLI: `brew tap mobile-dev-inc/tap && brew trust mobile-dev-inc/tap && brew install --formula mobile-dev-inc/tap/maestro`

```bash
maestro --udid <udid> test .maestro/helpers/land-on-home.yaml
npm run e2e
```

`land-on-home` dismisses the iOS “Open in Dear Wallet?” prompt, the notification sheet (`Don’t Allow`), and the Expo dev-menu intro, then skips onboarding. The dev-menu gear sits on top of the onboarding **skip** control, so a tap on `onboarding-skip` can open the menu instead. If that happens, tap Close (`id: xmark`) and open the seed screen (below) rather than hammering skip.

Deep link straight to the dev seed screen once the bundle is loaded:

```bash
xcrun simctl openurl <udid> "dearwallet://dev/seed"
```

Confirm the tap if iOS asks to open Dear Wallet.

Maestro also ships an MCP server (`maestro mcp`). It is registered in `.cursor/mcp.json`. Reload MCP in Cursor if the Maestro tools are not listed yet. No separate idb or mobile-mcp install: Maestro talks to the simulator itself.

`maestro list-devices` on this machine did not list the running Pixel 8 (it showed a stale `pixel_6`). Maestro still drives it if you pass the adb serial:

```bash
maestro --udid emulator-5554 test .maestro/helpers/land-on-home.yaml
```

Android taps, when Maestro is not convenient:

```bash
adb shell input tap <x> <y>
adb shell input text 'matcha'
adb shell input keyevent 4   # back
```

## Screenshots

```bash
xcrun simctl io <udid> screenshot review/screens/<screen>-<state>-<device>.png
adb exec-out screencap -p > review/screens/<screen>-<state>-pixel8.png
```

Open the PNG before trusting it. A shot of the Simulator chrome, a permission sheet, or the Expo menu is not a shot of the screen.

## Motion

```bash
xcrun simctl io <udid> recordVideo --codec h264 review/motion/clip.mp4
# wait until stderr says "Recording started", exercise the screen, then Ctrl-C

ffmpeg -i review/motion/clip.mp4 -vf fps=20 review/motion/frames/frame-%03d.png
```

On this Xcode, a 45s capture of the Quick log sheet came out at about 1.3 fps (timebase 600). `ffmpeg -vf fps=20` duplicates those frames, so it is good for sequence and weak for 50 ms timing. Keep the Simulator window in front of the device you are recording. Delete `review/motion/frames/` when you are done. The frames are large.

## Simulator settings

Appearance and Dynamic Type, checked with `simctl ui`:

```bash
xcrun simctl ui <udid> appearance light          # or dark
xcrun simctl ui <udid> content_size large
xcrun simctl ui <udid> content_size accessibility-extra-extra-extra-large
xcrun simctl ui <udid> increase_contrast enabled # or disabled
```

Reduce Motion is not a `simctl ui` option on this Xcode. The Accessibility default is, and reading it back returned `1` after the write:

```bash
xcrun simctl spawn <udid> defaults write com.apple.Accessibility ReduceMotionEnabled -bool true
xcrun simctl spawn <udid> defaults read com.apple.Accessibility ReduceMotionEnabled
```

Set it back with `-bool false`. If the app does not pick the change up, toggle Settings → Accessibility → Motion → Reduce Motion on that simulator. Phase 1 still has to confirm the in-app 200 ms fade.

## Offline

Simulator airplane mode does not reliably drop the app’s network (the existing Maestro note says the same). Use the dev seed screen: **offline override on**. That forces `isOffline()` even when NetInfo says the phone is online, and sync waits. It is in-memory only and the screen is not available in production builds (`__DEV__` redirects home).

## Reset

```bash
xcrun simctl uninstall <udid> com.pixelwitch.dearwallet
# whole device, slower:
xcrun simctl erase <udid>
adb uninstall com.pixelwitch.dearwallet
```

Each seed button also wipes that user’s local rows and plants one state. It does not erase the app.

## Dev seed

Open `dearwallet://dev/seed` in a dev build. Each button replaces local diary data for the signed-in (or offline fallback) user, marks onboarding done, and returns to Home.

| Button | What you get |
| --- | --- |
| first day | Onboarded, nothing logged |
| active day | Three kept things today ($23.00) and one loved thing |
| quiet week | One kept thing on Monday of this week |
| busy month | Kept things on the days of this month up to today |
| decorated diary | Two diary pages with stickers stored as page fractions |
| goal in progress | “new headphones”, under the target |
| goal reached | “a tiny fund”, already reached |
| milestones ready | $99.99 kept, 49 logs, 9 diary lines. `first_nvm` already seen. The next log, log, or diary line crosses the next threshold |
| palettes | Peach Soda and Midnight CD unlocked, Orchid Pop still locked |

`npx jest src/features/dev/seed.test.ts src/lib/network.test.ts` covers those shapes.
