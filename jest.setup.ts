import '@testing-library/react-native/matchers';

jest.mock('nativewind', () => ({
  vars: (value: Record<string, string>) => value,
}));

jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- RN View for Animated.View
  const { View } = require('react-native');
  const shared = (value: unknown) => ({ value });
  const passthrough = (value: unknown) => value;
  const AnimatedView = View;
  return {
    __esModule: true,
    default: {
      View: AnimatedView,
      Text: View,
      Image: View,
      ScrollView: View,
      createAnimatedComponent: (Component: unknown) => Component,
      call: () => {},
      addWhitelistedNativeProps: () => {},
      addWhitelistedUIProps: () => {},
    },
    useSharedValue: shared,
    useAnimatedStyle: () => ({}),
    useDerivedValue: (fn: () => unknown) => shared(fn()),
    useAnimatedRef: () => ({ current: null }),
    withTiming: passthrough,
    withSpring: passthrough,
    withDelay: (_d: number, v: unknown) => v,
    withSequence: (...vals: unknown[]) => vals[0],
    withRepeat: (v: unknown) => v,
    Easing: { linear: (t: number) => t, ease: (t: number) => t, bezier: () => (t: number) => t },
    interpolate: () => 0,
    Extrapolation: { CLAMP: 'clamp' },
    runOnJS: (fn: (...args: unknown[]) => unknown) => fn,
    runOnUI: (fn: (...args: unknown[]) => unknown) => fn,
    FadeIn: {},
    FadeOut: {},
  };
});

jest.mock('react-native-worklets', () => ({
  __esModule: true,
  createSerializable: (v: unknown) => v,
  isWorkletFunction: () => false,
}));

jest.mock(
  'expo-haptics',
  () => ({
    ImpactFeedbackStyle: {
      Light: 'light',
      Medium: 'medium',
      Heavy: 'heavy',
    },
    NotificationFeedbackType: {
      Success: 'success',
      Warning: 'warning',
      Error: 'error',
    },
    impactAsync: jest.fn(async () => undefined),
    notificationAsync: jest.fn(async () => undefined),
    selectionAsync: jest.fn(async () => undefined),
  }),
  { virtual: true },
);

jest.mock(
  'expo-audio',
  () => ({
    useAudioPlayer: jest.fn(() => ({
      play: jest.fn(),
      pause: jest.fn(),
      seekTo: jest.fn(),
      remove: jest.fn(),
    })),
    createAudioPlayer: jest.fn(() => ({
      play: jest.fn(),
      pause: jest.fn(),
      seekTo: jest.fn(),
      remove: jest.fn(),
    })),
    setAudioModeAsync: jest.fn(async () => undefined),
  }),
  { virtual: true },
);

jest.mock('expo-crypto', () => ({
  randomUUID: () => globalThis.crypto.randomUUID(),
}));

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(async () => ({ isConnected: true, isInternetReachable: true })),
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useFocusEffect: jest.fn(),
  useLocalSearchParams: jest.fn(() => ({})),
  Redirect: ({ href }: { href: string }) => href,
  Link: ({ children }: { children: unknown }) => children,
  Stack: {
    Screen: () => null,
  },
  Tabs: Object.assign(() => null, { Screen: () => null }),
}));

jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    execSync: jest.fn(),
    getAllSync: jest.fn(() => []),
    getFirstSync: jest.fn(() => null),
    runSync: jest.fn(),
    prepareSync: jest.fn(() => ({
      executeSync: jest.fn(),
      finalizeSync: jest.fn(),
    })),
    closeSync: jest.fn(),
  })),
  openDatabaseAsync: jest.fn(async () => ({
    execAsync: jest.fn(async () => undefined),
    getAllAsync: jest.fn(async () => []),
    getFirstAsync: jest.fn(async () => null),
    runAsync: jest.fn(async () => ({ changes: 0, lastInsertRowId: 0 })),
    closeAsync: jest.fn(async () => undefined),
  })),
}));

jest.mock('drizzle-orm/expo-sqlite/migrator', () => ({
  useMigrations: () => ({ success: true, error: null }),
}));
