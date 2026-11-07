import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { completeLog } from '@/features/log/completeLog';
import { QuickLogForm } from '@/features/log/QuickLogForm';
import { subscribeOffline } from '@/lib/network';
import { useTokens } from '@/theme';

export default function LogRoute() {
  const t = useTokens();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const params = useLocalSearchParams<{ kind?: string }>();
  const initialKind = params.kind === 'loved' ? 'loved' : 'kept';
  const [offline, setOffline] = useState(false);

  useEffect(() => subscribeOffline(setOffline), []);

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: t.scrim }}>
      <View
        style={{
          // Border lives on this shell. overflow hidden on the same view
          // clips the stroke at the rounded corners.
          height: Math.round(height * 0.92),
          backgroundColor: t.outline,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingTop: 2,
          paddingHorizontal: 2,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: t.surface,
            borderTopLeftRadius: 26,
            borderTopRightRadius: 26,
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
    </View>
  );
}
