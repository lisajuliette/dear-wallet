import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-bg1 px-gutter">
      <Text className="font-script text-3xl text-ink">Dear Wallet</Text>
      <Text className="mt-2 font-sans text-base text-ink">soft money diary</Text>
      {__DEV__ ? (
        <View className="mt-8 items-center gap-3">
          <Link href="/dev/theme">
            <Text className="font-sans-semibold text-btn underline">open theme lab</Text>
          </Link>
          <Link href="/dev/components">
            <Text className="font-sans-semibold text-btn underline">open components lab</Text>
          </Link>
        </View>
      ) : null}
    </View>
  );
}
