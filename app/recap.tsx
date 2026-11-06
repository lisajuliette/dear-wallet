import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { IconButton, PixelIcon, Screen, ScriptText } from '@/components';

/** Stub until Step 10 ships Recap cards. */
export default function RecapStub() {
  return (
    <Screen accessibilityLabel="Recap">
      <View style={{ flex: 1, padding: 16, gap: 12 }}>
        <IconButton
          accessibilityLabel="Back"
          icon={<PixelIcon name="back" size={22} />}
          onPress={() => router.back()}
        />
        <ScriptText size={32}>Recap</ScriptText>
        <Text className="font-sans text-ink">coming in a later step ♡</Text>
      </View>
    </Screen>
  );
}
