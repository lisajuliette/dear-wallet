import { and, eq, isNull, ne, sql } from 'drizzle-orm';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AmountPad,
  BottomSheet,
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
import type { PixelIconName } from '@/components/pixelIcons';
import { db } from '@/db/client';
import { diaryEntries } from '@/db/schema';
import { keptLogCount, keptTotalCents } from '@/features/items/repository';
import { clearPasscode, hasPasscode, setPasscode } from '@/features/lock/passcodeStore';
import {
  addCategory,
  loadCategories,
  removeCategory,
  renameCategory,
  saveCategories,
  setCategoryShown,
  type CategoryPref,
} from '@/features/log/categories';
import { listUnlockIds } from '@/features/rewards/milestones';
import { useSettingsStore } from '@/features/rewards/settingsStore';
import { saveDailyQuestsEnabled } from '@/features/settings/dailyQuestSetting';
import { normalizeDisplayName, saveChosenDisplayName } from '@/features/settings/displayName';
import { shareExport } from '@/features/settings/exportData';
import {
  buildFaceplateStatuses,
  remainingUnlockText,
  unlockConditionLabel,
} from '@/features/settings/faceplates';
import {
  CHECKIN_COPY,
  fromCheckinParts,
  parseCheckinTime,
  syncWeeklyCheckin,
  toCheckinParts,
  type CheckinParts,
} from '@/features/settings/notifications';
import { persistPrefs, saveAppLock, savePalette } from '@/features/settings/prefs';
import { savePromptsEnabled } from '@/features/settings/promptSetting';
import type { AppLockMode } from '@/features/settings/types';
import { deleteAccount } from '@/features/sync/authActions';
import { useAuthStore } from '@/features/sync/authStore';
import { getLocalUserId } from '@/lib/localUser';
import { applyTimeKey, formatTimeEntry, timeEntryParts } from '@/lib/timePad';
import { palettes, useTokens, type PaletteKey } from '@/theme';
import { useThemeStore } from '@/theme/store';

type SettingsScreenProps = {
  onBack: () => void;
};

const WEEKDAYS = [
  { label: 'M', value: 1, name: 'mon' },
  { label: 'T', value: 2, name: 'tue' },
  { label: 'W', value: 3, name: 'wed' },
  { label: 'T', value: 4, name: 'thu' },
  { label: 'F', value: 5, name: 'fri' },
  { label: 'S', value: 6, name: 'sat' },
  { label: 'S', value: 0, name: 'sun' },
] as const;

function formatCheckinTime(time: string): string {
  const { hour, minute } = parseCheckinTime(time);
  const suffix = hour >= 12 ? 'pm' : 'am';
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}:${minute.toString().padStart(2, '0')} ${suffix}`;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const t = useTokens();
  const insets = useSafeAreaInsets();
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
  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const nameValue = nameDraft ?? settings.displayName;
  const [categories, setCategories] = useState<CategoryPref[]>([]);
  const [categoryDraft, setCategoryDraft] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  const [timeOpen, setTimeOpen] = useState(false);
  const [timeDraft, setTimeDraft] = useState<CheckinParts>({
    hour12: 7,
    minute: 0,
    period: 'pm',
  });
  const [timeDigits, setTimeDigits] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [deleteNote, setDeleteNote] = useState<string | null>(null);
  const [busyDelete, setBusyDelete] = useState(false);
  const email = useAuthStore((s) => s.email)?.trim() || null;
  const shownCount = categories.filter((c) => c.shown).length;
  const homeName = (nameValue.trim() || 'You').toUpperCase();
  const nameDirty = normalizeDisplayName(nameValue) !== normalizeDisplayName(settings.displayName);
  const renameDirty = editingCategory !== null && renameDraft.trim() !== editingCategory;
  const dirty = nameDirty || categoryDraft.trim().length > 0 || renameDirty;

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
    setCategories(await loadCategories());
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

  const commitCategories = (next: CategoryPref[]) => {
    setCategories(next);
    void saveCategories(next);
  };

  const savePending = async () => {
    if (nameDirty) await saveChosenDisplayName(db, nameValue);
    let next = categories;
    if (editingCategory && renameDraft.trim() && renameDraft.trim() !== editingCategory) {
      next = renameCategory(next, editingCategory, renameDraft);
    }
    if (categoryDraft.trim()) next = addCategory(next, categoryDraft);
    if (next !== categories) commitCategories(next);
    setNameDraft(null);
    setEditingCategory(null);
    setRenameDraft('');
    setCategoryDraft('');
    setLeaveOpen(false);
  };

  const onAddCategory = () => {
    const next = addCategory(categories, categoryDraft);
    commitCategories(next);
    setCategoryDraft('');
  };

  const onRenameCategory = () => {
    if (!editingCategory) return;
    commitCategories(renameCategory(categories, editingCategory, renameDraft));
    setEditingCategory(null);
    setRenameDraft('');
  };

  const onDeleteCategory = () => {
    if (!editingCategory) return;
    commitCategories(removeCategory(categories, editingCategory));
    setEditingCategory(null);
    setRenameDraft('');
  };

  const openTime = () => {
    setTimeDraft(toCheckinParts(settings.checkinTime));
    setTimeDigits('');
    setTimeOpen(true);
  };

  const saveTime = async () => {
    const typed = timeEntryParts(timeDigits);
    const time = fromCheckinParts(
      typed?.hour12 ?? timeDraft.hour12,
      typed?.minute ?? timeDraft.minute,
      timeDraft.period,
    );
    settings.setCheckinTime(time);
    await persistPrefs(db, { checkinTime: time });
    if (settings.checkinEnabled) await syncCheckin(true, settings.checkinWeekday, time);
    setTimeOpen(false);
  };

  const typedTime = timeDigits ? formatTimeEntry(timeDigits) : null;

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
            testID="settings-back"
            accessibilityLabel="Back"
            icon={<PixelIcon name="back" size={22} />}
            onPress={() => {
              if (dirty) {
                setLeaveOpen(true);
                return;
              }
              onBack();
            }}
          />
          <ScriptText size={compact ? 26 : 30}>Settings</ScriptText>
        </View>

        <ScrollView
          contentContainerStyle={{
            gap: 12,
            paddingBottom: (tryUnlock ? 120 : 28) + (dirty ? 72 + insets.bottom : insets.bottom),
          }}
          showsVerticalScrollIndicator={false}
        >
          <RetroWindow title="FACEPLATES" titleBar="pink" right={`${unlockedCount} of 6 unlocked`}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 4 }}>
                {plates.map((p) => (
                  <Pressable
                    key={p.key}
                    testID={`settings-palette-${p.key}`}
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

          <RetroWindow title="ABOUT U" titleBar="butter">
            <View style={{ gap: 12 }}>
              <View style={{ gap: 6 }}>
                <Text
                  style={{
                    fontFamily: 'PixelifySans_500Medium',
                    fontSize: 12,
                    letterSpacing: 0.72,
                    color: t.text,
                  }}
                >
                  WHAT SHOULD I CALL U?
                </Text>
                <View>
                  <TextInput
                    testID="settings-name"
                    accessibilityLabel="Your name"
                    value={nameValue}
                    onChangeText={setNameDraft}
                    onSubmitEditing={() => {
                      void savePending();
                    }}
                    placeholder="You"
                    placeholderTextColor={t.text}
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="done"
                    maxLength={24}
                    style={{
                      height: 48,
                      borderRadius: 16,
                      borderWidth: 2,
                      borderColor: t.outline,
                      backgroundColor: t.c1,
                      paddingLeft: 14,
                      paddingRight: 40,
                      fontFamily: 'Nunito_800ExtraBold',
                      fontSize: 16,
                      color: t.text,
                    }}
                  />
                  <View
                    pointerEvents="none"
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: 0,
                      bottom: 0,
                      justifyContent: 'center',
                    }}
                  >
                    <PixelIcon name="edit" size={16} />
                  </View>
                </View>
                <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 12, color: t.text }}>
                  shows on Home as HI {homeName}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: t.text }}>
                  currency
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`currency ${settings.currency}`}
                  onPress={() => {
                    void persistPrefs(db, { currency: 'USD' });
                  }}
                  style={{
                    minHeight: 44,
                    paddingHorizontal: 14,
                    borderRadius: 999,
                    borderWidth: 2,
                    borderColor: t.outline,
                    backgroundColor: t.surface,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 14, color: t.text }}>
                    {settings.currency} $
                  </Text>
                </Pressable>
              </View>
            </View>
          </RetroWindow>

          <RetroWindow title="CATEGORIES" titleBar="lilac" right={`${shownCount} on quick log`}>
            <View style={{ gap: 10 }}>
              <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 12, color: t.text }}>
                tap to show or hide one on quick log. hold to rename or delete.
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {categories.map((c) => (
                  <Pressable
                    key={c.name}
                    accessibilityRole="button"
                    accessibilityLabel={c.shown ? `${c.name}, shown` : `${c.name}, hidden`}
                    accessibilityHint="Hold to rename or delete"
                    onPress={() => {
                      commitCategories(setCategoryShown(categories, c.name, !c.shown));
                    }}
                    onLongPress={() => {
                      setEditingCategory(c.name);
                      setRenameDraft(c.name);
                    }}
                    style={{ minHeight: 44, justifyContent: 'center' }}
                  >
                    <View
                      style={{
                        minHeight: 36,
                        paddingHorizontal: 12,
                        borderRadius: 999,
                        borderWidth: 2,
                        borderColor: t.outline,
                        backgroundColor: c.shown ? t.btn : t.surface,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      {c.shown ? <PixelIcon name="check" size={14} color={t.btnText} /> : null}
                      <Text
                        style={{
                          fontFamily: 'Nunito_800ExtraBold',
                          fontSize: 14,
                          color: c.shown ? t.btnText : t.text,
                        }}
                      >
                        {c.name}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
              {editingCategory ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <TextInput
                    testID="settings-rename-category"
                    accessibilityLabel="Category name"
                    value={renameDraft}
                    onChangeText={setRenameDraft}
                    onSubmitEditing={onRenameCategory}
                    autoCapitalize="none"
                    returnKeyType="done"
                    maxLength={24}
                    style={{
                      flex: 1,
                      height: 44,
                      borderRadius: 16,
                      borderWidth: 2,
                      borderColor: t.outline,
                      backgroundColor: t.surface,
                      paddingHorizontal: 14,
                      fontFamily: 'Nunito_800ExtraBold',
                      fontSize: 16,
                      color: t.text,
                    }}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Save category name"
                    onPress={onRenameCategory}
                    style={{
                      height: 44,
                      paddingHorizontal: 12,
                      borderRadius: 16,
                      borderWidth: 2,
                      borderColor: t.outline,
                      backgroundColor: t.c3,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 14, color: t.text }}>
                      save
                    </Text>
                  </Pressable>
                  <Pressable
                    testID="settings-delete-category"
                    accessibilityRole="button"
                    accessibilityLabel={`Delete ${editingCategory}`}
                    onPress={onDeleteCategory}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 16,
                      borderWidth: 2,
                      borderColor: t.outline,
                      backgroundColor: t.surface,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PixelIcon name="trash" size={18} />
                  </Pressable>
                </View>
              ) : null}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TextInput
                  testID="settings-new-category"
                  accessibilityLabel="Add a category"
                  value={categoryDraft}
                  onChangeText={setCategoryDraft}
                  onSubmitEditing={onAddCategory}
                  placeholder="add one"
                  placeholderTextColor={t.text}
                  autoCapitalize="none"
                  returnKeyType="done"
                  maxLength={24}
                  style={{
                    flex: 1,
                    height: 48,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: t.outline,
                    backgroundColor: t.c1,
                    paddingHorizontal: 14,
                    fontFamily: 'Nunito_800ExtraBold',
                    fontSize: 16,
                    color: t.text,
                  }}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Add category"
                  onPress={onAddCategory}
                  style={{
                    height: 48,
                    paddingHorizontal: 16,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: t.outline,
                    backgroundColor: t.surface,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 15, color: t.text }}>
                    add
                  </Text>
                </Pressable>
              </View>
            </View>
          </RetroWindow>

          <RetroWindow title="FEEL" titleBar="sky">
            <View style={{ gap: 8 }}>
              <PillToggle
                label="sounds"
                hint="chiptune blips + keypad tones"
                icon={<RowIcon name="note" fill={t.c1} />}
                value={settings.sounds}
                onChange={(v) => {
                  void onToggleSounds(v);
                }}
              />
              <PillToggle
                label="haptics"
                hint="lil taps when things happen"
                icon={<RowIcon name="sparkle" fill={t.c2} />}
                value={settings.haptics}
                onChange={(v) => {
                  void onToggleHaptics(v);
                }}
              />
              <PillToggle
                label="reduced motion"
                hint="fades instead of bounces"
                icon={<RowIcon name="shuffle" fill={t.c3} />}
                value={settings.reducedMotion}
                onChange={(v) => {
                  void onToggleMotion(v);
                }}
              />
            </View>
          </RetroWindow>

          <RetroWindow title="DIARY" titleBar="pink">
            <View style={{ gap: 8 }}>
              <PillToggle
                label="daily prompt"
                hint="a lil question at the top of the diary"
                icon={<RowIcon name="edit" fill={t.c5} />}
                value={settings.prompts}
                onChange={(v) => {
                  settings.setPrompts(v);
                  void savePromptsEnabled(v);
                }}
              />
              <PillToggle
                label="daily quests"
                hint="the card on home"
                icon={<RowIcon name="check" fill={t.c4} />}
                value={settings.dailyQuests}
                onChange={(v) => {
                  settings.setDailyQuests(v);
                  void saveDailyQuestsEnabled(v);
                }}
              />
              <View style={{ gap: 6 }}>
                <PillToggle
                  label="app lock"
                  hint="face ID on the diary"
                  icon={<RowIcon name="lock" fill={t.c1} />}
                  value={settings.appLock !== 'off' || pendingLockMode !== null}
                  onChange={(on) => {
                    void onAppLockMode(on ? 'diary' : 'off');
                  }}
                />
                {settings.appLock !== 'off' || pendingLockMode ? (
                  <Segmented
                    accessibilityLabel="App lock scope"
                    value={(pendingLockMode ?? settings.appLock) === 'app' ? 'app' : 'diary'}
                    onChange={(v) => {
                      void onAppLockMode(v);
                    }}
                    selectedFill="c3"
                    options={[
                      { label: 'just the diary', value: 'diary' },
                      { label: 'whole app', value: 'app' },
                    ]}
                  />
                ) : null}
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
            </View>
          </RetroWindow>

          <RetroWindow title="REMINDERS" titleBar="butter">
            <View style={{ gap: 10 }}>
              <PillToggle
                label="weekly check-in"
                hint="one gentle nudge a week"
                icon={<RowIcon name="diary" fill={t.c3} />}
                value={settings.checkinEnabled}
                onChange={(v) => {
                  void onToggleCheckin(v);
                }}
              />
              <View style={{ flexDirection: 'row', gap: 4 }}>
                {WEEKDAYS.map((d) => {
                  const selected = settings.checkinWeekday === d.value;
                  return (
                    <Pressable
                      key={d.name}
                      accessibilityRole="button"
                      accessibilityLabel={d.name}
                      accessibilityState={{ selected }}
                      onPress={() => {
                        void onWeekday(d.value);
                      }}
                      style={{
                        flex: 1,
                        height: 44,
                        borderRadius: 14,
                        borderWidth: 2,
                        borderColor: t.outline,
                        backgroundColor: selected ? t.c3 : t.surface,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'Nunito_900Black',
                          fontSize: 14,
                          color: t.text,
                        }}
                      >
                        {d.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: t.text }}>
                  at
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Set check-in time, ${formatCheckinTime(settings.checkinTime)}`}
                  onPress={openTime}
                  style={{
                    minHeight: 44,
                    paddingHorizontal: 14,
                    borderRadius: 999,
                    borderWidth: 2,
                    borderColor: t.outline,
                    backgroundColor: t.c3,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 14, color: t.text }}>
                    {formatCheckinTime(settings.checkinTime)}
                  </Text>
                </Pressable>
              </View>
              <View
                style={{
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: t.outline,
                  backgroundColor: t.c2,
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    borderWidth: 2,
                    borderColor: t.outline,
                    backgroundColor: t.surface,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PixelIcon name="note" size={16} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 13, color: t.text }}>
                    Dear Wallet · {formatCheckinTime(settings.checkinTime)}
                  </Text>
                  <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 12, color: t.text }}>
                    {CHECKIN_COPY[0]}
                  </Text>
                </View>
              </View>
            </View>
          </RetroWindow>

          <RetroWindow title="ACCOUNT + DATA" titleBar="mint">
            <View style={{ gap: 4 }}>
              <SettingsRow
                label="account"
                hint={email ? 'signed in · backed up' : undefined}
                value={email ?? 'sign in'}
                icon={<RowIcon name="heart" fill={t.c4} />}
                onPress={() => router.push('/sign-in')}
              />
              <SettingsRow
                label="export my data"
                value={busyExport ? '…' : 'csv + photos'}
                icon={<RowIcon name="download" fill={t.c2} />}
                onPress={() => {
                  setBusyExport(true);
                  void shareExport(db)
                    .catch(() => undefined)
                    .finally(() => setBusyExport(false));
                }}
              />
              <SettingsRow
                label="delete account"
                hint="removes everything, for good"
                value=""
                icon={<RowIcon name="trash" fill={t.c1} />}
                onPress={() => {
                  setDeleteNote(null);
                  setDeleteOpen(true);
                }}
              />
            </View>
          </RetroWindow>

          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'PixelifySans_500Medium',
              fontSize: 12,
              letterSpacing: 0.72,
              color: t.text,
              marginTop: 4,
            }}
          >
            DEAR WALLET V1.0 · MADE WITH ♡
          </Text>
        </ScrollView>

        {dirty ? (
          <View
            style={{
              position: 'absolute',
              left: 16,
              right: 16,
              bottom: (tryUnlock ? 112 : 16) + insets.bottom,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Save changes"
              onPress={() => {
                void savePending();
              }}
            >
              <View
                style={{
                  minHeight: 48,
                  borderRadius: 999,
                  borderWidth: 2,
                  borderColor: t.outline,
                  backgroundColor: t.btn,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 15, color: t.btnText }}>
                  save changes
                </Text>
              </View>
            </Pressable>
          </View>
        ) : null}

        {tryUnlock && previewPalette ? (
          <View style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
            <PreviewBar
              palette={previewPalette}
              unlockText={tryUnlock.text}
              onRevert={() => setPreviewPalette(null)}
            />
          </View>
        ) : null}

        <BottomSheet visible={leaveOpen} title="SAVE CHANGES?" onClose={() => setLeaveOpen(false)}>
          <View style={{ gap: 12 }}>
            <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: t.text }}>
              {"these aren't kept yet."}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Save changes and go back"
              onPress={() => {
                void savePending().then(() => onBack());
              }}
              style={{
                minHeight: 48,
                borderRadius: 999,
                borderWidth: 2,
                borderColor: t.outline,
                backgroundColor: t.btn,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 15, color: t.btnText }}>
                save
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Leave without saving"
              onPress={() => {
                setNameDraft(null);
                setCategoryDraft('');
                setEditingCategory(null);
                setRenameDraft('');
                setLeaveOpen(false);
                onBack();
              }}
              style={{
                minHeight: 48,
                borderRadius: 999,
                borderWidth: 2,
                borderColor: t.outline,
                backgroundColor: t.surface,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 15, color: t.text }}>
                not now
              </Text>
            </Pressable>
          </View>
        </BottomSheet>

        <BottomSheet visible={timeOpen} title="CHECK-IN TIME" onClose={() => setTimeOpen(false)}>
          <View style={{ gap: 12 }}>
            <Text
              style={{
                fontFamily: 'PixelifySans_600SemiBold',
                fontSize: 36,
                color: t.text,
                textAlign: 'center',
              }}
            >
              {typedTime?.hour ?? timeDraft.hour12}:
              {typedTime?.minute ?? String(timeDraft.minute).padStart(2, '0')}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
              {(['am', 'pm'] as const).map((period) => {
                const selected = timeDraft.period === period;
                return (
                  <Pressable
                    key={period}
                    accessibilityRole="button"
                    accessibilityLabel={period}
                    accessibilityState={{ selected }}
                    onPress={() => setTimeDraft((draft) => ({ ...draft, period }))}
                    style={{
                      minWidth: 72,
                      height: 44,
                      paddingHorizontal: 18,
                      borderRadius: 999,
                      borderWidth: 2,
                      borderColor: t.outline,
                      backgroundColor: selected ? t.c3 : t.surface,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 15, color: t.text }}>
                      {period}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <AmountPad
              variant="time"
              accessibilityLabel="time pad"
              hapticsEnabled={settings.haptics}
              compact={compact}
              onKey={(key) => setTimeDigits((digits) => applyTimeKey(digits, key))}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Set time"
              onPress={() => {
                void saveTime();
              }}
              style={{
                minHeight: 48,
                borderRadius: 999,
                borderWidth: 2,
                borderColor: t.outline,
                backgroundColor: t.btn,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 15, color: t.btnText }}>
                set time
              </Text>
            </Pressable>
          </View>
        </BottomSheet>

        <BottomSheet
          visible={deleteOpen}
          title="DELETE ACCOUNT"
          onClose={() => setDeleteOpen(false)}
        >
          <View style={{ gap: 12 }}>
            <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: t.text }}>
              this removes the signed-in backup. the diary on this phone stays.
            </Text>
            {deleteNote ? (
              <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 13, color: t.text }}>
                {deleteNote}
              </Text>
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Delete account"
              disabled={busyDelete}
              onPress={() => {
                void (async () => {
                  if (!email) {
                    setDeleteNote('sign in first, then this can remove the backup.');
                    return;
                  }
                  setBusyDelete(true);
                  const result = await deleteAccount();
                  setBusyDelete(false);
                  if (result.error) {
                    setDeleteNote("couldn't remove the backup just now.");
                    return;
                  }
                  setDeleteOpen(false);
                })();
              }}
              style={{
                minHeight: 48,
                borderRadius: 999,
                borderWidth: 2,
                borderColor: t.outline,
                backgroundColor: t.btn,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: busyDelete ? 0.6 : 1,
              }}
            >
              <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 15, color: t.btnText }}>
                delete account
              </Text>
            </Pressable>
          </View>
        </BottomSheet>
      </View>
    </Screen>
  );
}

function RowIcon({ name, fill }: { name: PixelIconName; fill: string }) {
  const t = useTokens();
  return (
    <View
      style={{
        width: 30,
        height: 30,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: t.outline,
        backgroundColor: fill,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <PixelIcon name={name} size={16} />
    </View>
  );
}

function SettingsRow({
  label,
  value,
  hint,
  icon,
  onPress,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  onPress: () => void;
}) {
  const t = useTokens();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}: ${value}` : label}
      onPress={onPress}
      style={{
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 8,
      }}
    >
      {icon}
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: t.text }}>
          {label}
        </Text>
        {hint ? (
          <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 12, color: t.text }}>{hint}</Text>
        ) : null}
      </View>
      {value ? (
        <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: t.text }}>
          {value}
        </Text>
      ) : null}
    </Pressable>
  );
}
