import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-bg1 px-gutter">
      <Text className="font-script text-3xl text-ink">Dear Wallet</Text>
      <Text className="mt-2 font-sans text-base text-ink">soft money diary</Text>
      {__DEV__ ? (
        <Link href="/dev/theme" className="mt-8">
          <Text className="font-sans-semibold text-btn underline">open theme lab</Text>
        </Link>
      ) : null}
    </View>
  );
}
