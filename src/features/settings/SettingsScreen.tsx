import { and, eq, isNull, ne, sql } from 'drizzle-orm';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';

import {
  Faceplate,
  IconButton,
  PixelIcon,
  PillToggle,
  PreviewBar,
  RetroWindow,
  Screen,
  ScriptText,
  Segmented,
} from '@/components';
import { db } from '@/db/client';
import { diaryEntries } from '@/db/schema';
import { keptLogCount, keptTotalCents } from '@/features/items/repository';
import { clearPasscode, hasPasscode, setPasscode } from '@/features/lock/passcodeStore';
import { listUnlockIds } from '@/features/rewards/milestones';
import { useSettingsStore } from '@/features/rewards/settingsStore';
import { shareExportJson } from '@/features/settings/exportData';
import {
  buildFaceplateStatuses,
  remainingUnlockText,
  unlockConditionLabel,
} from '@/features/settings/faceplates';
import { syncWeeklyCheckin } from '@/features/settings/notifications';
import { persistPrefs, saveAppLock, savePalette } from '@/features/settings/prefs';
import type { AppLockMode } from '@/features/settings/types';
import { getLocalUserId } from '@/lib/localUser';
import { palettes, useTokens, type PaletteKey } from '@/theme';
import { useThemeStore } from '@/theme/store';

type SettingsScreenProps = {
  onBack: () => void;
};

const WEEKDAYS = [
  { label: 'S', value: 0 },
  { label: 'M', value: 1 },
  { label: 'T', value: 2 },
  { label: 'W', value: 3 },
  { label: 'T', value: 4 },
  { label: 'F', value: 5 },
  { label: 'S', value: 6 },
] as const;

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const t = useTokens();
  const { height } = useWindowDimensions();
  const compact = height < 740;
  const palette = useThemeStore((s) => s.palette);
  const previewPalette = useThemeStore((s) => s.previewPalette);
  const setPreviewPalette = useThemeStore((s) => s.setPreviewPalette);
  const settings = useSettingsStore();
  const [unlockIds, setUnlockIds] = useState<string[]>([]);
  const [progress, setProgress] = useState({
    keptTotalCents: 0,
    keptLogCount: 0,
    diaryTextCount: 0,
  });
  const [busyExport, setBusyExport] = useState(false);
  const [pendingLockMode, setPendingLockMode] = useState<AppLockMode | null>(null);
  const [passcodeDraft, setPasscodeDraft] = useState('');

  const refresh = useCallback(async () => {
    const [ids, kept, logs, diaryCount] = await Promise.all([
      listUnlockIds(db, getLocalUserId()),
      keptTotalCents(db, getLocalUserId(), null),
      keptLogCount(db, getLocalUserId()),
      db
        .select({ n: sql<number>`count(*)` })
        .from(diaryEntries)
        .where(
          and(
            eq(diaryEntries.userId, getLocalUserId()),
            isNull(diaryEntries.deletedAt),
            ne(diaryEntries.body, ''),
          ),
        )
        .then((rows) => Number(rows[0]?.n ?? 0)),
    ]);
    setUnlockIds(ids);
    setProgress({ keptTotalCents: kept, keptLogCount: logs, diaryTextCount: diaryCount });
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
      return () => {
        setPreviewPalette(null);
      };
    }, [refresh, setPreviewPalette]),
  );

  const activeKey = previewPalette ?? palette;
  const plates = buildFaceplateStatuses(unlockIds, activeKey);
  const unlockedCount = plates.filter((p) => !p.locked).length;

  const onPickFaceplate = async (key: PaletteKey) => {
    const unlocked = plates.find((p) => p.key === key && !p.locked);
    if (unlocked) {
      await savePalette(db, key);
      return;
    }
    setPreviewPalette(key);
  };

  const syncCheckin = async (enabled: boolean, weekday: number, time: string) => {
    await syncWeeklyCheckin({ enabled, weekday, time });
  };

  const onToggleSounds = async (v: boolean) => {
    settings.setSounds(v);
    await persistPrefs(db, { sounds: v });
  };
  const onToggleHaptics = async (v: boolean) => {
    settings.setHaptics(v);
    await persistPrefs(db, { haptics: v });
  };
  const onToggleMotion = async (v: boolean) => {
    settings.setReducedMotion(v);
    await persistPrefs(db, { reducedMotion: v });
  };

  const onToggleCheckin = async (v: boolean) => {
    settings.setCheckinEnabled(v);
    await persistPrefs(db, { checkinEnabled: v });
    await syncCheckin(v, settings.checkinWeekday, settings.checkinTime);
  };

  const onWeekday = async (weekday: number) => {
    settings.setCheckinWeekday(weekday);
    await persistPrefs(db, { checkinWeekday: weekday });
    if (settings.checkinEnabled) {
      await syncCheckin(true, weekday, settings.checkinTime);
    }
  };

  const onAppLockMode = async (mode: AppLockMode) => {
    if (mode === 'off') {
      await clearPasscode();
      await saveAppLock(db, 'off');
      setPendingLockMode(null);
      return;
    }
    const exists = await hasPasscode();
    if (!exists) {
      setPendingLockMode(mode);
      setPasscodeDraft('');
      return;
    }
    await saveAppLock(db, mode);
  };

  const confirmPasscode = async () => {
    if (!pendingLockMode || !/^\d{6}$/.test(passcodeDraft)) return;
    await setPasscode(passcodeDraft);
    await saveAppLock(db, pendingLockMode);
    setPendingLockMode(null);
    setPasscodeDraft('');
  };

  const tryUnlock = previewPalette
    ? (() => {
        const unlock = palettes[previewPalette].unlock;
        const remain = remainingUnlockText(unlock, progress);
        const cond = unlockConditionLabel(unlock);
        return {
          name: palettes[previewPalette].name,
          text: remain ? `unlocks ${cond} · ${remain}` : `unlocks ${cond}`,
        };
      })()
    : null;

  return (
    <Screen accessibilityLabel="Settings">
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconButton
            accessibilityLabel="Back"
            icon={<PixelIcon name="back" size={22} />}
            onPress={onBack}
          />
          <ScriptText size={compact ? 26 : 30}>Settings</ScriptText>
        </View>

        <ScrollView
          contentContainerStyle={{ gap: 12, paddingBottom: tryUnlock ? 120 : 28 }}
          showsVerticalScrollIndicator={false}
        >
          <RetroWindow
            title="FACEPLATES"
            titleBar="pink"
            right={
              <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 12, color: t.text }}>
                {unlockedCount} of 6 unlocked
              </Text>
            }
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 4 }}>
                {plates.map((p) => (
                  <Pressable
                    key={p.key}
                    accessibilityRole="button"
                    accessibilityLabel={`${p.name}, ${p.status}`}
                    accessibilityState={{ selected: p.key === activeKey }}
                    onPress={() => {
                      void onPickFaceplate(p.key);
                    }}
                    style={{ width: 94, alignItems: 'center', gap: 4 }}
                  >
                    <View
                      style={{
                        padding: 3,
                        borderRadius: 26,
                        borderWidth: 3,
                        borderColor: p.key === activeKey ? t.btn : 'transparent',
                      }}
                    >
                      <Faceplate
                        palette={p.key}
                        locked={p.locked}
                        selected={p.key === activeKey && !p.locked}
                      />
                    </View>
                    <Text
                      style={{
                        fontFamily: 'Nunito_900Black',
                        fontSize: 12,
                        color: t.text,
                        textAlign: 'center',
                      }}
                    >
                      {p.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Nunito_700Bold',
                        fontSize: 11,
                        color: t.text,
                        textAlign: 'center',
                      }}
                    >
                      {p.status}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </RetroWindow>

          <RetroWindow title="SETTINGS.EXE" titleBar="mint">
            <View style={{ gap: 8, paddingVertical: 4 }}>
              <PillToggle
                label="sounds"
                value={settings.sounds}
                onChange={(v) => {
                  void onToggleSounds(v);
                }}
              />
              <PillToggle
                label="haptics"
                value={settings.haptics}
                onChange={(v) => {
                  void onToggleHaptics(v);
                }}
              />
              <PillToggle
                label="reduced motion"
                value={settings.reducedMotion}
                onChange={(v) => {
                  void onToggleMotion(v);
                }}
              />

              <View style={{ gap: 6, paddingTop: 4 }}>
                <PillToggle
                  label="weekly check-in"
                  value={settings.checkinEnabled}
                  onChange={(v) => {
                    void onToggleCheckin(v);
                  }}
                />
                <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 12, color: t.text }}>
                  day · {settings.checkinTime}
                </Text>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  {WEEKDAYS.map((d, i) => {
                    const selected = settings.checkinWeekday === d.value;
                    return (
                      <Pressable
                        key={`${d.label}-${i}`}
                        accessibilityRole="button"
                        accessibilityLabel={['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][i]}
                        accessibilityState={{ selected }}
                        onPress={() => {
                          void onWeekday(d.value);
                        }}
                        style={{
                          flex: 1,
                          height: 40,
                          minHeight: 44,
                          borderRadius: 12,
                          borderWidth: 2,
                          borderColor: t.outline,
                          backgroundColor: selected ? t.btn : t.surface,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: 'PixelifySans_600SemiBold',
                            fontSize: 13,
                            color: selected ? t.btnText : t.text,
                          }}
                        >
                          {d.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <SettingsRow
                label="currency"
                value={settings.currency}
                onPress={() => {
                  void persistPrefs(db, { currency: 'USD' });
                }}
              />

              <View style={{ gap: 6 }}>
                <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: t.text }}>
                  app lock
                </Text>
                <Segmented
                  value={settings.appLock}
                  onChange={(v) => {
                    void onAppLockMode(v);
                  }}
                  options={[
                    { label: 'off', value: 'off' },
                    { label: 'diary', value: 'diary' },
                    { label: 'app', value: 'app' },
                  ]}
                />
                {pendingLockMode ? (
                  <View style={{ gap: 6 }}>
                    <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 12, color: t.text }}>
                      pick a 6-digit passcode
                    </Text>
                    <TextInput
                      accessibilityLabel="Passcode"
                      keyboardType="number-pad"
                      maxLength={6}
                      secureTextEntry
                      value={passcodeDraft}
                      onChangeText={(text) => setPasscodeDraft(text.replace(/\D/g, '').slice(0, 6))}
                      style={{
                        height: 44,
                        borderRadius: 14,
                        borderWidth: 2,
                        borderColor: t.outline,
                        backgroundColor: t.surface,
                        paddingHorizontal: 12,
                        fontFamily: 'PixelifySans_600SemiBold',
                        fontSize: 18,
                        color: t.text,
                      }}
                    />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Save passcode"
                      onPress={() => {
                        void confirmPasscode();
                      }}
                      style={{
                        minHeight: 44,
                        borderRadius: 999,
                        borderWidth: 2,
                        borderColor: t.outline,
                        backgroundColor: t.btn,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{ fontFamily: 'Nunito_900Black', fontSize: 14, color: t.btnText }}
                      >
                        save passcode
                      </Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>

              <SettingsRow
                label="export my data"
                value={busyExport ? '…' : 'JSON'}
                onPress={() => {
                  setBusyExport(true);
                  void shareExportJson(db)
                    .catch(() => undefined)
                    .finally(() => setBusyExport(false));
                }}
              />
              <SettingsRow
                label="account"
                value="sign in"
                onPress={() => router.push('/sign-in')}
              />
            </View>
          </RetroWindow>
        </ScrollView>

        {tryUnlock && previewPalette ? (
          <View style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
            <PreviewBar
              palette={previewPalette}
              unlockText={tryUnlock.text}
              onRevert={() => setPreviewPalette(null)}
            />
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

function SettingsRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) {
  const t = useTokens();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
      onPress={onPress}
      style={{
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
      }}
    >
      <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: t.text }}>
        {label}
      </Text>
      <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: t.text }}>
        {value}
      </Text>
    </Pressable>
  );
}
