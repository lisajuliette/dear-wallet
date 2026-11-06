import NetInfo from '@react-native-community/netinfo';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { completeLog } from '@/features/log/completeLog';
import { QuickLogForm } from '@/features/log/QuickLogForm';
import { useTokens } from '@/theme';

export default function LogRoute() {
  const t = useTokens();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ kind?: string }>();
  const initialKind = params.kind === 'loved' ? 'loved' : 'kept';
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sub = NetInfo.addEventListener((state) => {
      setOffline(!(state.isConnected && state.isInternetReachable !== false));
    });
    return () => sub();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: t.scrim }}>
      <View
        style={{
          maxHeight: '92%',
          backgroundColor: t.surface,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          borderWidth: 2,
          borderBottomWidth: 0,
          borderColor: t.outline,
          paddingBottom: Math.max(insets.bottom, 8),
          overflow: 'hidden',
        }}
      >
        <QuickLogForm
          initialKind={initialKind}
          offline={offline}
          onClose={() => router.back()}
          onSave={(payload) => {
            // Save locally with no spinner, then open Reward within 300 ms.
            void completeLog(payload).then((result) => {
              router.replace({
                pathname: '/reward',
                params: {
                  amountCents: String(result.amountCents ?? ''),
                  monthCents: String(result.monthCents),
                  starAwarded: result.starAwarded ? '1' : '0',
                  starCount: String(result.starCount),
                  stickerId: result.stickerId ?? '',
                  rare: result.rare ? '1' : '0',
                },
              });
            });
          }}
        />
      </View>
    </View>
  );
}
