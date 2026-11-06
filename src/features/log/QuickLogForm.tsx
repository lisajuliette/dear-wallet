import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { AmountPad, Chip, PillButton, Segmented } from '@/components';
import { canSaveLog, type LogKind } from '@/features/home/canSaveLog';
import { applyPadKey } from '@/lib/amountPad';
import { formatCents, parsePadInput } from '@/lib/money';
import { useTokens } from '@/theme';

const RECENT = [1200, 2400, 1800, 6500];

export type QuickLogSavePayload = {
  kind: LogKind;
  name: string;
  amountCents: number | null;
  note: string | null;
  category: string | null;
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
  const [note, setNote] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [photoAdded, setPhotoAdded] = useState(false);
  const [recentOn, setRecentOn] = useState<number | null>(null);

  const enabled = canSaveLog(kind, amountText, name);
  const amountCents = parsePadInput(amountText);
  const displayAmount =
    amountText.length === 0
      ? '$0'
      : amountCents !== null
        ? formatCents(amountCents)
        : `$${amountText}`;

  return (
    <View style={{ flex: 1 }} accessibilityLabel="Quick log">
      <View
        style={{
          height: 56,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 10,
          borderBottomWidth: 2,
          borderColor: t.outline,
          backgroundColor: t.c1,
        }}
      >
        <Text
          style={{
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
          {RECENT.map((cents) => (
            <Chip
              key={cents}
              label={formatCents(cents)}
              selected={recentOn === cents}
              onPress={() => {
                setRecentOn(cents);
                setAmountText((cents / 100).toFixed(2).replace(/\.00$/, ''));
              }}
            />
          ))}
          <Chip
            label={category ?? '+ category'}
            selected={!!category}
            dashed={!category}
            onPress={() => setCategory(category ? null : 'treat')}
          />
          <Chip
            label={note ? 'note' : '+ note'}
            dashed={!note}
            selected={!!note}
            onPress={() => setNote(note ? null : 'later')}
          />
          <Chip
            label={photoAdded ? 'added' : '+ photo'}
            dashed={!photoAdded}
            selected={photoAdded}
            onPress={() => setPhotoAdded((v) => !v)}
          />
        </View>

        <AmountPad
          onKey={(key) => {
            setRecentOn(null);
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
          label="nvm!"
          disabled={!enabled}
          size={compact ? 'md' : 'lg'}
          onPress={() => {
            if (!enabled) return;
            onSave({
              kind,
              name: name.trim(),
              amountCents: kind === 'kept' ? amountCents : amountCents,
              note,
              category,
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
            an amount and a name is all it needs
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}
