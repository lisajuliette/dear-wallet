import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Screen } from '@/components';
import { db } from '@/db/client';
import { listAchievedMilestoneIds, markMilestoneSeen } from '@/features/rewards/milestones';
import { milestoneById } from '@/features/rewards/milestonesCatalog';
import { MilestoneScreen } from '@/features/rewards/MilestoneScreen';
import { useRewardQueueStore } from '@/features/rewards/rewardQueue';
import { getLocalUserId } from '@/lib/localUser';

export default function MilestoneRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const def = milestoneById(id);
  const [achievedIds, setAchievedIds] = useState<string[]>([]);

  useEffect(() => {
    void listAchievedMilestoneIds(db, getLocalUserId()).then(setAchievedIds);
  }, []);

  if (!def) {
    return (
      <Screen accessibilityLabel="Milestone">
        <View style={{ flex: 1 }} />
      </Screen>
    );
  }

  const advance = () => {
    markMilestoneSeen(db, getLocalUserId(), def.id);
    useRewardQueueStore.getState().shift();
    const next = useRewardQueueStore.getState().peek();
    if (next) {
      router.replace(`/milestone/${next}`);
      return;
    }
    router.replace('/(tabs)');
  };

  return (
    <MilestoneScreen
      def={def}
      achievedIds={achievedIds}
      onYay={advance}
      onSaveCard={() => {
        // TODO(step-10): export milestone share card
      }}
      onOpenCollection={() => {
        markMilestoneSeen(db, getLocalUserId(), def.id);
        useRewardQueueStore.getState().clear();
        router.replace('/(tabs)/collection');
      }}
    />
  );
}
