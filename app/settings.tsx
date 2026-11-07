import { router } from 'expo-router';

import { SettingsScreen } from '@/features/settings/SettingsScreen';

export default function SettingsRoute() {
  return <SettingsScreen onBack={() => router.back()} />;
}
