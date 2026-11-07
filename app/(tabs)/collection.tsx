import { and, eq, isNull } from 'drizzle-orm';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { db } from '@/db/client';
import { stickerAwards } from '@/db/schema';
import {
  buildAlbumSlots,
  buildAllMilestones,
  buildMilestoneBadges,
  buildPackCards,
  type MilestoneRow,
  type PackCard,
} from '@/features/collection/collectionModel';
import { CollectionScreen } from '@/features/collection/CollectionScreen';
import {
  listAchievedMilestoneIds,
  listUnlockIds,
  loadMilestoneStats,
} from '@/features/rewards/milestones';
import { MILESTONES } from '@/features/rewards/milestonesCatalog';
import { countStars } from '@/features/rewards/stars';
import { getLocalUserId } from '@/lib/localUser';

const emptyStats = { keptTotalCents: 0, keptLogCount: 0, diaryTextCount: 0 };

export default function CollectionRoute() {
  const [stars, setStars] = useState(0);
  const [mileCount, setMileCount] = useState(0);
  const [badges, setBadges] = useState(buildMilestoneBadges(new Set(), emptyStats));
  const [allMilestones, setAllMilestones] = useState<MilestoneRow[]>(
    buildAllMilestones(new Set(), emptyStats),
  );
  const [album, setAlbum] = useState(buildAlbumSlots([]));
  const [packs, setPacks] = useState(buildPackCards([], emptyStats));
  const [lockedPack, setLockedPack] = useState<PackCard | null>(null);

  const refresh = useCallback(async () => {
    const [achieved, unlocks, stats, starCount, awards] = await Promise.all([
      listAchievedMilestoneIds(db, getLocalUserId()),
      listUnlockIds(db, getLocalUserId()),
      loadMilestoneStats(db, getLocalUserId()),
      countStars(db, getLocalUserId()),
      Promise.resolve(
        db
          .select({ stickerId: stickerAwards.stickerId })
          .from(stickerAwards)
          .where(and(eq(stickerAwards.userId, getLocalUserId()), isNull(stickerAwards.deletedAt)))
          .all(),
      ),
    ]);
    const achievedSet = new Set(achieved);
    setStars(starCount);
    setMileCount(Math.min(MILESTONES.length, achieved.length));
    setBadges(buildMilestoneBadges(achievedSet, stats));
    setAllMilestones(buildAllMilestones(achievedSet, stats));
    setAlbum(buildAlbumSlots(awards.map((a) => a.stickerId)));
    setPacks(buildPackCards(unlocks, stats));
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return (
    <CollectionScreen
      stars={stars}
      mileCount={mileCount}
      badges={badges}
      milestones={allMilestones}
      album={album}
      packs={packs}
      lockedPack={lockedPack}
      onCloseLocked={() => setLockedPack(null)}
      onOpenLocked={setLockedPack}
    />
  );
}
