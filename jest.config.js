/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: [
    'src/features/**/*.{ts,tsx}',
    'src/lib/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/index.ts',
    '!**/photos.ts',
    '!**/StickerCanvas.tsx',
    '!**/TransformHandles.tsx',
    '!**/DecorateScreen.tsx',
    '!**/DiaryScreen.tsx',
    '!**/completeDiarySave.ts',
    '!**/useDiaryData.ts',
  ],
  // collectCoverageFrom already limits to src/features and src/lib
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
  moduleNameMapper: {
    '^@/assets/(.*)$': '<rootDir>/assets/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.svg$': '<rootDir>/test/svgMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|drizzle-orm)',
  ],
};
