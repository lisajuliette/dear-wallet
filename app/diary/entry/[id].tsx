import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Screen, type Mood } from '@/components';
import { db } from '@/db/client';
import {
  completeDiarySave,
  DiaryEntryScreen,
  getDiaryEntry,
  getPromptById,
  listPromptHistory,
  pickPrompt,
  type DiaryEntryViewModel,
} from '@/features/diary';
import { dayKey } from '@/lib/dates';
import { LOCAL_USER_ID } from '@/lib/localUser';

function titleFor(dateKey: string, isNew: boolean): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const label =
    y && m && d
      ? new Date(y, m - 1, d)
          .toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
          .toUpperCase()
      : dateKey;
  return `${label} · ${isNew ? 'NEW ENTRY' : 'EDITING'}`;
}

export default function DiaryEntryRoute() {
  const { id, date } = useLocalSearchParams<{ id: string; date?: string }>();
  const isNew = id === 'new';
  const entryDate = typeof date === 'string' && date.length > 0 ? date : dayKey();
  const [promptId, setPromptId] = useState<string | null>(null);
  const [vm, setVm] = useState<DiaryEntryViewModel | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const history = await listPromptHistory(db, LOCAL_USER_ID);
      if (isNew) {
        const prompt = pickPrompt(history);
        if (cancelled) return;
        setPromptId(prompt.id);
        setVm({
          title: titleFor(entryDate, true),
          promptText: prompt.text,
          mood: null,
          body: '',
          isNew: true,
          entryId: null,
        });
        return;
      }

      const entry = await getDiaryEntry(db, LOCAL_USER_ID, id);
      if (cancelled) return;
      if (!entry) {
        router.back();
        return;
      }
      const prompt = getPromptById(entry.promptId) ?? pickPrompt(history);
      setPromptId(prompt.id);
      setVm({
        title: titleFor(entry.entryDate, false),
        promptText: prompt.text,
        mood: entry.mood,
        body: entry.body,
        isNew: false,
        entryId: entry.id,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isNew, entryDate]);

  if (!vm) {
    return (
      <Screen accessibilityLabel="Diary entry">
        <View style={{ flex: 1 }} />
      </Screen>
    );
  }

  return (
    <DiaryEntryScreen
      vm={vm}
      onClose={() => router.back()}
      onShufflePrompt={() => {
        void listPromptHistory(db, LOCAL_USER_ID).then((history) => {
          const next = pickPrompt(history, new Date(), Math.random, promptId);
          setPromptId(next.id);
          setVm((prev) => (prev ? { ...prev, promptText: next.text } : prev));
        });
      }}
      onChangeMood={(mood: Mood) => setVm((prev) => (prev ? { ...prev, mood } : prev))}
      onChangeBody={(body) => setVm((prev) => (prev ? { ...prev, body } : prev))}
      onSave={() => {
        void completeDiarySave({
          id: vm.entryId ?? undefined,
          entryDate: vm.entryId ? undefined : entryDate,
          promptId,
          mood: vm.mood,
          body: vm.body,
        }).then((result) => {
          router.replace({
            pathname: '/reward',
            params: {
              amountCents: '',
              monthCents: '0',
              starAwarded: result.starAwarded ? '1' : '0',
              starCount: String(result.starCount),
              stickerId: result.stickerId ?? '',
              rare: result.rare ? '1' : '0',
            },
          });
        });
      }}
      onDecorate={() => {
        if (vm.entryId) {
          router.push({ pathname: '/diary/decorate/[id]', params: { id: vm.entryId } });
        }
      }}
    />
  );
}
