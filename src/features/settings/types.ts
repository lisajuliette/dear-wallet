export type AppLockMode = 'off' | 'diary' | 'app';

export type ProfilePrefs = {
  displayName: string;
  palette: string;
  currency: string;
  sounds: boolean;
  haptics: boolean;
  reducedMotion: boolean;
  appLock: AppLockMode;
  checkinEnabled: boolean;
  checkinWeekday: number;
  checkinTime: string;
};
