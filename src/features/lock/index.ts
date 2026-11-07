export { LockScreen } from '@/features/lock/LockScreen';
export { shouldShowLockGate, isDiaryPath, LOCK_BACKGROUND_MS } from '@/features/lock/gate';
export { hashPasscode, verifyPasscode } from '@/features/lock/passcode';
export {
  hasPasscode,
  setPasscode,
  clearPasscode,
  checkPasscode,
} from '@/features/lock/passcodeStore';
export { useAppLock } from '@/features/lock/useAppLock';
