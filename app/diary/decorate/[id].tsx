import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { Screen, type Mood } from '@/components';
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
import { goBack } from '@/lib/goBack';
import { getLocalUserId } from '@/lib/localUser';

export default function DecorateRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState('DECORATE');
  const [dateLabel, setDateLabel] = useState('');
  const [mood, setMood] = useState<Mood | null>(null);
  const [body, setBody] = useState('');
  const [stickers, setStickers] = useState<CanvasSticker[]>([]);
  const [tray, setTray] = useState<ReturnType<typeof buildTrayCounts>>([]);
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
        if (!entry) goBack('/(tabs)/diary');
        return;
      }
      const [, m, d] = entry.entryDate.split('-').map(Number);
      const months = [
        'jan',
        'feb',
        'mar',
        'apr',
        'may',
        'jun',
        'jul',
        'aug',
        'sep',
        'oct',
        'nov',
        'dec',
      ];
      const month = m ? months[m - 1] : '';
      const label = month && d ? `${month} ${d}` : entry.entryDate;
      setTitle(`${label.toUpperCase()} · DECORATE`);
      setDateLabel(label);
      setMood(entry.mood);
      setBody(entry.body);
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
      dateLabel={dateLabel}
      mood={mood}
      body={body}
      stickers={stickers}
      tray={tray}
      onChangeStickers={(next) => {
        void persist(next);
      }}
      onBack={() => goBack({ pathname: '/diary/entry/[id]', params: { id } })}
      onDone={() => goBack({ pathname: '/diary/entry/[id]', params: { id } })}
    />
  );
}
