import { Text, View } from 'react-native';

import { Screen, ScriptText } from '@/components';

export default function DiaryPlaceholder() {
  return (
    <Screen accessibilityLabel="Diary">
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <ScriptText size={28}>diary</ScriptText>
        <Text className="font-sans text-ink">coming in a later step</Text>
      </View>
    </Screen>
  );
}
