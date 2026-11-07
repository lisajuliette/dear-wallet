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

jest.mock('expo-crypto', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- jest mock
  const { createHash, randomBytes } = require('node:crypto');
  return {
    randomUUID: () => globalThis.crypto.randomUUID(),
    CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
    digestStringAsync: async (_algo: string, data: string) =>
      createHash('sha256').update(data).digest('hex'),
    getRandomBytesAsync: async (n: number) => new Uint8Array(randomBytes(n)),
  };
});

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
  usePathname: jest.fn(() => '/'),
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

jest.mock('react-native-view-shot', () => ({
  captureRef: jest.fn(async () => 'file:///tmp/recap.png'),
}));

jest.mock('expo-media-library/legacy', () => ({
  requestPermissionsAsync: jest.fn(async () => ({ granted: true, status: 'granted' })),
  saveToLibraryAsync: jest.fn(async () => undefined),
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(async () => true),
  shareAsync: jest.fn(async () => undefined),
}));

jest.mock('expo-notifications', () => ({
  SchedulableTriggerInputTypes: { WEEKLY: 'weekly' },
  scheduleNotificationAsync: jest.fn(async () => 'id'),
  cancelScheduledNotificationAsync: jest.fn(async () => undefined),
  requestPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  getPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
}));

jest.mock('expo-secure-store', () => {
  const store = new Map<string, string>();
  return {
    getItemAsync: jest.fn(async (key: string) => store.get(key) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key: string) => {
      store.delete(key);
    }),
  };
});

jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(async () => false),
  isEnrolledAsync: jest.fn(async () => false),
  authenticateAsync: jest.fn(async () => ({ success: false })),
}));

jest.mock('expo-file-system/legacy', () => ({
  cacheDirectory: 'file:///tmp/',
  documentDirectory: 'file:///tmp/',
  writeAsStringAsync: jest.fn(async () => undefined),
  readAsStringAsync: jest.fn(async () => ''),
  makeDirectoryAsync: jest.fn(async () => undefined),
  copyAsync: jest.fn(async () => undefined),
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(async () => ({ granted: true })),
  launchImageLibraryAsync: jest.fn(async () => ({ canceled: true, assets: [] })),
}));

jest.mock('expo-image-manipulator', () => ({
  SaveFormat: { JPEG: 'jpeg' },
  manipulateAsync: jest.fn(async (uri: string) => ({ uri })),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- official AsyncStorage jest mock
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      getSession: jest.fn(async () => ({ data: { session: null }, error: null })),
      signInAnonymously: jest.fn(async () => ({
        data: {
          user: { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', is_anonymous: true },
        },
        error: null,
      })),
      signInWithPassword: jest.fn(async () => ({ data: { user: null }, error: null })),
      signUp: jest.fn(async () => ({ data: { user: null }, error: null })),
      updateUser: jest.fn(async () => ({ data: { user: null }, error: null })),
      resetPasswordForEmail: jest.fn(async () => ({ error: null })),
      signInWithIdToken: jest.fn(async () => ({ data: { user: null }, error: null })),
      signOut: jest.fn(async () => ({ error: null })),
      startAutoRefresh: jest.fn(),
      stopAutoRefresh: jest.fn(),
    },
    from: jest.fn(() => ({
      upsert: jest.fn(async () => ({ error: null })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          gt: jest.fn(async () => ({ data: [], error: null })),
        })),
      })),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(async () => ({ error: null })),
      })),
    },
  }),
}));

jest.mock('expo-apple-authentication', () => ({
  AppleAuthenticationButton: 'AppleAuthenticationButton',
  AppleAuthenticationButtonType: { SIGN_IN: 0 },
  AppleAuthenticationButtonStyle: { BLACK: 0 },
  AppleAuthenticationScope: { FULL_NAME: 0, EMAIL: 1 },
  signInAsync: jest.fn(async () => ({ identityToken: null })),
}));

jest.mock('react-native-gesture-handler', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- RN View for gesture mock
  const { View } = require('react-native');
  const chain = () => {
    const api: Record<string, unknown> = {};
    const self = () => api;
    api.onBegin = self;
    api.onUpdate = self;
    api.onEnd = self;
    return api;
  };
  return {
    GestureHandlerRootView: View,
    GestureDetector: ({ children }: { children: unknown }) => children,
    Gesture: {
      Pan: chain,
      Pinch: chain,
      Rotation: chain,
      Tap: chain,
      Simultaneous: (...gestures: unknown[]) => gestures,
    },
  };
});
