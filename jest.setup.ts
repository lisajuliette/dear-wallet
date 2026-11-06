import '@testing-library/react-native/matchers';

jest.mock('nativewind', () => ({
  vars: (value: Record<string, string>) => value,
}));

jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- reanimated mock must be required
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

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

jest.mock(
  'expo-sqlite',
  () => ({
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
  }),
  { virtual: true },
);
