import { router } from 'expo-router';

import { SignInScreen } from '@/features/sync/SignInScreen';

export default function SignInRoute() {
  return <SignInScreen onBack={() => router.back()} onSignedIn={() => router.back()} />;
}
