import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { Screen } from '@/components';
import { db } from '@/db/client';
import {
  DecorateScreen,
  buildTrayCounts,
  getDiaryEntry,
  listAllPageStickers,
  listPageStickers,
  listStickerAwards,
  replacePageStickers,
  type CanvasSticker,
} from '@/features/diary';
import { getLocalUserId } from '@/lib/localUser';

export default function DecorateRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState('DECORATE');
  const [stickers, setStickers] = useState<CanvasSticker[]>([]);
  const [tray, setTray] = useState<ReturnType<typeof buildTrayCounts>>([]);
  const [trayOpen, setTrayOpen] = useState(true);
  const [ready, setReady] = useState(false);

  const refreshTray = useCallback(async (pageStickers: CanvasSticker[]) => {
    const [awards, allPlaced] = await Promise.all([
      listStickerAwards(db, getLocalUserId()),
      listAllPageStickers(db, getLocalUserId()),
    ]);
    setTray(
      buildTrayCounts(
        awards,
        allPlaced.map((p) => ({ stickerId: p.stickerId })),
        pageStickers.map((p) => ({ stickerId: p.stickerId })),
      ),
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const entry = await getDiaryEntry(db, getLocalUserId(), id);
      if (!entry || cancelled) {
        if (!entry) router.back();
        return;
      }
      const [y, m, d] = entry.entryDate.split('-').map(Number);
      const label =
        y && m && d
          ? new Date(y, m - 1, d)
              .toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
              .toUpperCase()
          : entry.entryDate;
      setTitle(`${label} · DECORATE`);
      const rows = await listPageStickers(db, getLocalUserId(), id);
      const mapped: CanvasSticker[] = rows.map((row) => ({
        id: row.id,
        stickerId: row.stickerId as CanvasSticker['stickerId'],
        x: row.x,
        y: row.y,
        scale: row.scale,
        rotation: row.rotation,
        z: row.z,
      }));
      if (cancelled) return;
      setStickers(mapped);
      await refreshTray(mapped);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [id, refreshTray]);

  const persist = async (next: CanvasSticker[]) => {
    setStickers(next);
    await replacePageStickers(
      db,
      getLocalUserId(),
      id,
      next.map((s) => ({
        id: s.id,
        stickerId: s.stickerId,
        x: s.x,
        y: s.y,
        scale: s.scale,
        rotation: s.rotation,
        z: s.z,
      })),
    );
    await refreshTray(next);
  };

  if (!ready) {
    return (
      <Screen accessibilityLabel="Decorate page">
        <View style={{ flex: 1 }} />
      </Screen>
    );
  }

  return (
    <DecorateScreen
      title={title}
      stickers={stickers}
      tray={tray}
      trayOpen={trayOpen}
      onChangeStickers={(next) => {
        void persist(next);
      }}
      onBack={() => router.back()}
      onDone={() => router.back()}
      onOpenTray={() => setTrayOpen(true)}
      onCloseTray={() => setTrayOpen(false)}
    />
  );
}
