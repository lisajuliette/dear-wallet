import { useState } from 'react';
import { Pressable, Text, TextInput, useWindowDimensions, View } from 'react-native';

import {
  AmountPad,
  Chip,
  PillButton,
  RetroWindow,
  Screen,
  ScriptText,
  SegmentBar,
} from '@/components';
import { applyPadKey } from '@/lib/amountPad';
import { formatCents, parsePadInput } from '@/lib/money';
import { useTokens } from '@/theme';

const IDEAS = ['concert tickets', 'a lil trip', 'new phone', 'rainy-day fund'];

export type GoalScreenProps = {
  mode: 'none' | 'name' | 'amount' | 'progress' | 'reached';
  name: string;
  targetCents: number;
  progressCents: number;
  startedLabel: string;
  nvmCount: number;
  onPickIdea: (idea: string) => void;
  onCustomName: () => void;
  onChangeName: (name: string) => void;
  onNextAmount: () => void;
  onConfirmAmount: (cents: number) => void;
  onEdit: () => void;
  onSwap: () => void;
  onPickNew: () => void;
  onKeepCounting: () => void;
  onBack?: () => void;
};

export function GoalScreen({
  mode,
  name,
  targetCents,
  progressCents,
  startedLabel,
  nvmCount,
  onPickIdea,
  onCustomName,
  onChangeName,
  onNextAmount,
  onConfirmAmount,
  onEdit,
  onSwap,
  onPickNew,
  onKeepCounting,
  onBack,
}: GoalScreenProps) {
  const t = useTokens();
  const { height } = useWindowDimensions();
  const compact = height < 740;
  const [amountText, setAmountText] = useState('');
  const amountCents = parsePadInput(amountText);
  const pct = targetCents > 0 ? Math.min(1, progressCents / targetCents) : 0;
  const toGo = Math.max(0, targetCents - progressCents);

  return (
    <Screen accessibilityLabel="Goal">
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {onBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back"
              onPress={onBack}
              hitSlop={8}
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
              <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 18, color: t.text }}>←</Text>
            </Pressable>
          ) : null}
          <ScriptText size={compact ? 26 : 30}>Goal</ScriptText>
        </View>

        {mode === 'none' || mode === 'name' ? (
          <View style={{ gap: 14, flex: 1 }}>
            <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 16, color: t.text }}>
              {"no goal right now, and that's okay"}
            </Text>
            <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 14, color: t.text }}>
              pick something fun to keep money for. one at a time, change it whenever.
            </Text>
            <Text
              style={{
                fontFamily: 'PixelifySans_500Medium',
                fontSize: 13,
                letterSpacing: 0.78,
                color: t.text,
              }}
            >
              IDEAS
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {IDEAS.map((idea) => (
                <Chip key={idea} label={idea} onPress={() => onPickIdea(idea)} />
              ))}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="name your own"
              onPress={onCustomName}
            >
              <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 15, color: t.btn }}>
                or name ur own
              </Text>
            </Pressable>
            {mode === 'name' ? (
              <View style={{ gap: 10 }}>
                <TextInput
                  accessibilityLabel="goal name"
                  value={name}
                  onChangeText={onChangeName}
                  placeholder="i'm keeping money for…"
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
                <PillButton
                  label="next: how much?"
                  disabled={name.trim().length === 0}
                  onPress={onNextAmount}
                />
              </View>
            ) : null}
          </View>
        ) : null}

        {mode === 'amount' ? (
          <View style={{ gap: 12, flex: 1 }}>
            <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 16, color: t.text }}>
              {"i'm keeping money for "}
              {name}
            </Text>
            <Text
              style={{
                fontFamily: 'PixelifySans_600SemiBold',
                fontSize: compact ? 44 : 52,
                color: t.text,
                textAlign: 'center',
              }}
            >
              {amountText.length === 0
                ? '$0'
                : amountCents !== null
                  ? formatCents(amountCents)
                  : `$${amountText}`}
            </Text>
            <AmountPad
              onKey={(key) => setAmountText((prev) => applyPadKey(prev, key))}
              compact={compact}
            />
            <PillButton
              label="set goal ♡"
              disabled={!amountCents || amountCents <= 0}
              onPress={() => {
                if (amountCents && amountCents > 0) onConfirmAmount(amountCents);
              }}
            />
          </View>
        ) : null}

        {mode === 'progress' ? (
          <View style={{ gap: 12, flex: 1 }}>
            <RetroWindow title="KEEPING MONEY FOR" titleBar="butter">
              <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 18, color: t.text }}>
                {name}
              </Text>
              <Text
                style={{
                  fontFamily: 'PixelifySans_600SemiBold',
                  fontSize: 28,
                  color: t.text,
                  marginTop: 6,
                }}
              >
                {formatCents(progressCents)} of {formatCents(targetCents)}
              </Text>
              <View style={{ marginTop: 10 }}>
                <SegmentBar value={pct} />
              </View>
              <Text
                style={{ fontFamily: 'Nunito_700Bold', fontSize: 14, color: t.text, marginTop: 8 }}
              >
                {Math.round(pct * 100)}% · {formatCents(toGo)} to go
              </Text>
            </RetroWindow>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View
                style={{
                  flex: 1,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: t.outline,
                  backgroundColor: t.surface,
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'PixelifySans_500Medium',
                    fontSize: 12,
                    letterSpacing: 0.72,
                    color: t.text,
                  }}
                >
                  SINCE
                </Text>
                <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: t.text }}>
                  {startedLabel}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: t.outline,
                  backgroundColor: t.surface,
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'PixelifySans_500Medium',
                    fontSize: 12,
                    letterSpacing: 0.72,
                    color: t.text,
                  }}
                >
                  NVMS THAT HELPED
                </Text>
                <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: t.text }}>
                  {nvmCount}
                </Text>
              </View>
            </View>
            <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 13, color: t.text }}>
              no deadline, no budget. this counts the money u kept since {startedLabel}. buying
              something after all never takes progress away ♡
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 'auto', paddingBottom: 24 }}>
              <View style={{ flex: 1 }}>
                <PillButton label="edit goal" variant="secondary" onPress={onEdit} />
              </View>
              <View style={{ flex: 1 }}>
                <PillButton
                  label="swap for a different goal"
                  variant="secondary"
                  onPress={onSwap}
                />
              </View>
            </View>
          </View>
        ) : null}

        {mode === 'reached' ? (
          <View style={{ gap: 14, flex: 1, alignItems: 'center', paddingTop: 24 }}>
            <Text
              style={{
                paddingHorizontal: 12,
                paddingVertical: 3,
                borderRadius: 999,
                borderWidth: 2,
                borderColor: t.outline,
                backgroundColor: t.surface,
                fontFamily: 'PixelifySans_500Medium',
                fontSize: 13,
                letterSpacing: 0.78,
                color: t.text,
                overflow: 'hidden',
              }}
            >
              GOAL REACHED ✦
            </Text>
            <ScriptText size={36}>u did it!!</ScriptText>
            <Text
              style={{
                fontFamily: 'Nunito_800ExtraBold',
                fontSize: 16,
                color: t.text,
                textAlign: 'center',
              }}
            >
              {formatCents(targetCents)} kept for {name}
              {". go enjoy it, or don't. ur call ♡"}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                marginTop: 'auto',
                paddingBottom: 24,
                width: '100%',
              }}
            >
              <View style={{ flex: 1 }}>
                <PillButton label="pick a new goal" onPress={onPickNew} />
              </View>
              <View style={{ flex: 1 }}>
                <PillButton
                  label="keep counting this one"
                  variant="secondary"
                  onPress={onKeepCounting}
                />
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}
