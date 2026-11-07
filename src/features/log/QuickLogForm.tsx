import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { AmountPad, CheckerBar, Chip, PixelIcon, PillButton, Segmented } from '@/components';
import { canSaveLog, type LogKind } from '@/features/home/canSaveLog';
import { pickItemPhoto } from '@/features/items/photos';
import {
  addCategory,
  loadCategories,
  saveCategories,
  shownCategoryNames,
  type CategoryPref,
} from '@/features/log/categories';
import { applyPadKey } from '@/lib/amountPad';
import { formatCents, parsePadInput } from '@/lib/money';
import { useTokens } from '@/theme';

export type QuickLogSavePayload = {
  kind: LogKind;
  name: string;
  amountCents: number | null;
  note: string | null;
  category: string | null;
  link?: string | null;
  photoUri?: string | null;
};

type QuickLogFormProps = {
  initialKind?: LogKind;
  offline?: boolean;
  onSave: (payload: QuickLogSavePayload) => void;
  onClose: () => void;
};

export function QuickLogForm({
  initialKind = 'kept',
  offline = false,
  onSave,
  onClose,
}: QuickLogFormProps) {
  const t = useTokens();
  const { height } = useWindowDimensions();
  const compact = height < 740;
  const [kind, setKind] = useState<LogKind>(initialKind);
  const [amountText, setAmountText] = useState('');
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryPref[]>([]);
  const [addingCategory, setAddingCategory] = useState(false);
  const [categoryDraft, setCategoryDraft] = useState('');
  const [noteOpen, setNoteOpen] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void loadCategories().then((prefs) => {
      if (!cancelled) setCategories(prefs);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const enabled = canSaveLog(kind, amountText, name);
  const amountCents = parsePadInput(amountText);
  const displayAmount =
    amountText.length === 0
      ? '$0'
      : amountCents !== null
        ? formatCents(amountCents)
        : `$${amountText}`;

  const trimmedNote = note.trim();
  const trimmedLink = link.trim();
  const shown = shownCategoryNames(categories);

  const commitCategory = (raw: string) => {
    const next = addCategory(categories, raw);
    setCategories(next);
    void saveCategories(next);
    const name = next.find(
      (c) => c.name.toLowerCase() === raw.trim().replace(/\s+/g, ' ').slice(0, 24).toLowerCase(),
    )?.name;
    if (name) setCategory(name);
    setCategoryDraft('');
    setAddingCategory(false);
  };

  return (
    <View style={{ flex: 1 }} accessibilityLabel="Quick log" testID="quick-log">
      <View
        style={{
          height: 56,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingLeft: 14,
          paddingRight: 10,
          borderBottomWidth: 2,
          borderColor: t.outline,
          backgroundColor: t.c1,
          overflow: 'hidden',
        }}
      >
        <CheckerBar a={t.c2} b={t.c1} patternId="quick-log-checker" height={56} />
        <View
          style={{
            zIndex: 1,
            width: 28,
            height: 28,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: t.outline,
            backgroundColor: t.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PixelIcon name="heart" size={16} />
        </View>
        <Text
          style={{
            zIndex: 1,
            paddingHorizontal: 12,
            paddingVertical: 2,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: t.outline,
            backgroundColor: t.surface,
            fontFamily: 'PixelifySans_500Medium',
            fontSize: 15,
            letterSpacing: 0.9,
            color: t.text,
            overflow: 'hidden',
          }}
        >
          QUICK LOG
        </Text>
        {offline ? (
          <View
            style={{
              height: 28,
              paddingHorizontal: 10,
              borderRadius: 14,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.c3,
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'PixelifySans_500Medium',
                fontSize: 12,
                letterSpacing: 0.6,
                color: t.text,
              }}
            >
              OFFLINE
            </Text>
          </View>
        ) : null}
        <View style={{ flex: 1 }} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={onClose}
          style={{
            zIndex: 1,
            width: 44,
            height: 44,
            borderRadius: 14,
            borderWidth: 2,
            borderColor: t.outline,
            backgroundColor: t.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 18, color: t.text }}>×</Text>
        </Pressable>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 16,
          gap: compact ? 10 : 14,
          paddingBottom: 24,
        }}
      >
        <Segmented
          value={kind}
          onChange={setKind}
          options={[
            { label: "didn't buy", value: 'kept' },
            { label: 'loved it', value: 'loved' },
          ]}
        />

        <View style={{ alignItems: 'center' }}>
          {!compact ? (
            <Text
              style={{
                fontFamily: 'PixelifySans_500Medium',
                fontSize: 12,
                letterSpacing: 0.72,
                color: t.text,
              }}
            >
              HOW MUCH?
            </Text>
          ) : null}
          <Text
            style={{
              fontFamily: 'PixelifySans_600SemiBold',
              fontSize: compact ? 44 : 52,
              color: t.text,
            }}
          >
            {displayAmount}
          </Text>
        </View>

        <View style={{ gap: 6 }}>
          {!compact ? (
            <Text
              style={{
                fontFamily: 'PixelifySans_500Medium',
                fontSize: 12,
                letterSpacing: 0.72,
                color: t.text,
              }}
            >
              WHAT WAS IT?
            </Text>
          ) : null}
          <TextInput
            testID="quick-log-name"
            accessibilityLabel="What was it"
            value={name}
            onChangeText={setName}
            placeholder="bubble tea, shoes, a phone case…"
            placeholderTextColor={t.soft}
            style={{
              height: 48,
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
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {shown.map((option) => (
            <Chip
              key={option}
              label={option}
              selected={category === option}
              onPress={() => setCategory((current) => (current === option ? null : option))}
            />
          ))}
          <Chip
            label="+"
            accessibilityLabel="Add a category"
            onPress={() => setAddingCategory((open) => !open)}
          />
        </View>

        {addingCategory ? (
          <TextInput
            testID="quick-log-new-category"
            accessibilityLabel="New category"
            value={categoryDraft}
            onChangeText={setCategoryDraft}
            onSubmitEditing={() => commitCategory(categoryDraft)}
            placeholder="name it"
            placeholderTextColor={t.soft}
            autoCapitalize="none"
            returnKeyType="done"
            maxLength={24}
            style={{
              height: 44,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.surface,
              paddingHorizontal: 14,
              fontFamily: 'Nunito_800ExtraBold',
              fontSize: 15,
              color: t.text,
            }}
          />
        ) : null}

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Chip
              label={trimmedNote ? 'note' : '+ note'}
              dashed={!trimmedNote}
              selected={!!trimmedNote || noteOpen}
              onPress={() => setNoteOpen((open) => !open)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Chip
              label={photoUri ? 'added' : '+ photo'}
              dashed={!photoUri}
              selected={!!photoUri}
              onPress={() => {
                void pickItemPhoto().then((uri) => {
                  if (uri) setPhotoUri(uri);
                });
              }}
            />
          </View>
        </View>

        {noteOpen ? (
          <TextInput
            testID="quick-log-note"
            accessibilityLabel="Note"
            value={note}
            onChangeText={setNote}
            placeholder="a little note, optional"
            placeholderTextColor={t.soft}
            multiline
            style={{
              minHeight: 72,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.surface,
              paddingHorizontal: 14,
              paddingVertical: 10,
              fontFamily: 'Nunito_700Bold',
              fontSize: 15,
              color: t.text,
              textAlignVertical: 'top',
            }}
          />
        ) : null}

        <TextInput
          testID="quick-log-link"
          accessibilityLabel="Link"
          value={link}
          onChangeText={setLink}
          placeholder="a link, optional"
          placeholderTextColor={t.soft}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          style={{
            height: 44,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: t.outline,
            backgroundColor: t.surface,
            paddingHorizontal: 14,
            fontFamily: 'Nunito_700Bold',
            fontSize: 15,
            color: t.text,
          }}
        />

        <AmountPad
          onKey={(key) => {
            setAmountText((prev) => applyPadKey(prev, key));
          }}
          compact={compact}
        />

        {offline ? (
          <Text
            style={{
              fontFamily: 'Nunito_700Bold',
              fontSize: 13,
              color: t.text,
              textAlign: 'center',
            }}
          >
            saved on ur phone ♡ it syncs when ur back online
          </Text>
        ) : null}

        <PillButton
          testID="quick-log-save"
          label="nvm!"
          disabled={!enabled}
          size="md"
          onPress={() => {
            if (!enabled) return;
            onSave({
              kind,
              name: name.trim(),
              amountCents,
              note: trimmedNote.length > 0 ? trimmedNote : null,
              category,
              link: trimmedLink.length > 0 ? trimmedLink : null,
              photoUri,
            });
          }}
        />
        {!enabled ? (
          <Text
            style={{
              fontFamily: 'Nunito_700Bold',
              fontSize: 13,
              color: t.text,
              textAlign: 'center',
            }}
          >
            {kind === 'loved' ? 'a name is enough ♡' : 'an amount and a name is all it needs'}
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}
