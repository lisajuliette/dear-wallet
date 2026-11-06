import { TextInput, Text, View } from 'react-native';

import {
  IconButton,
  MoodPicker,
  PixelIcon,
  PillButton,
  RetroWindow,
  Screen,
  ScriptText,
  type Mood,
} from '@/components';
import { canSaveEntry } from '@/features/diary/canSaveEntry';
import { useTokens } from '@/theme';

const MAX = 280;

export type DiaryEntryViewModel = {
  title: string;
  promptText: string;
  mood: Mood | null;
  body: string;
  isNew: boolean;
  entryId: string | null;
};

type DiaryEntryScreenProps = {
  vm: DiaryEntryViewModel;
  onClose: () => void;
  onShufflePrompt: () => void;
  onChangeMood: (mood: Mood) => void;
  onChangeBody: (body: string) => void;
  onSave: () => void;
  onDecorate: () => void;
};

export function DiaryEntryScreen({
  vm,
  onClose,
  onShufflePrompt,
  onChangeMood,
  onChangeBody,
  onSave,
  onDecorate,
}: DiaryEntryScreenProps) {
  const t = useTokens();
  const enabled = canSaveEntry(vm.mood, vm.body);

  return (
    <Screen accessibilityLabel="Diary entry">
      <View style={{ flex: 1, paddingHorizontal: 12, paddingTop: 8, paddingBottom: 16, gap: 12 }}>
        <RetroWindow
          title={vm.title}
          titleBar="pink"
          right={
            <IconButton
              size={36}
              accessibilityLabel="Close"
              icon={<PixelIcon name="close" size={18} />}
              onPress={onClose}
            />
          }
        >
          <View style={{ gap: 12 }}>
            <View
              style={{
                borderRadius: 16,
                borderWidth: 2,
                borderColor: t.outline,
                backgroundColor: t.c2,
                padding: 12,
                gap: 8,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text
                  style={{
                    fontFamily: 'PixelifySans_500Medium',
                    fontSize: 12,
                    letterSpacing: 0.72,
                    color: t.text,
                  }}
                >
                  PROMPT
                </Text>
                <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 11, color: t.text }}>
                  OPTIONAL
                </Text>
                <View style={{ flex: 1 }} />
                <IconButton
                  size={36}
                  accessibilityLabel="Shuffle prompt"
                  icon={<PixelIcon name="shuffle" size={18} />}
                  onPress={onShufflePrompt}
                />
              </View>
              <Text
                style={{
                  fontFamily: 'Nunito_800ExtraBold',
                  fontSize: 15,
                  color: t.text,
                  lineHeight: 21,
                }}
              >
                {vm.promptText}
              </Text>
            </View>

            <View style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text
                  style={{
                    fontFamily: 'PixelifySans_500Medium',
                    fontSize: 12,
                    letterSpacing: 0.72,
                    color: t.text,
                  }}
                >
                  MOOD
                </Text>
                <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 11, color: t.text }}>
                  OPTIONAL
                </Text>
              </View>
              <MoodPicker value={vm.mood} onChange={onChangeMood} />
            </View>

            <ScriptText size={24}>Dear Wallet,</ScriptText>
            <View
              style={{
                minHeight: 140,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: t.outline,
                backgroundColor: t.surface,
                padding: 12,
              }}
            >
              <TextInput
                accessibilityLabel="Diary text"
                value={vm.body}
                onChangeText={(text) => onChangeBody(text.slice(0, MAX))}
                multiline
                placeholder="a line or two is plenty…"
                placeholderTextColor={t.text}
                style={{
                  flex: 1,
                  minHeight: 110,
                  fontFamily: 'Nunito_700Bold',
                  fontSize: 16,
                  color: t.text,
                  textAlignVertical: 'top',
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 8,
                }}
              >
                <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 12, color: t.text }}>
                  only u can see this
                </Text>
                <Text
                  style={{
                    fontFamily: 'PixelifySans_500Medium',
                    fontSize: 12,
                    color: t.text,
                  }}
                >
                  {vm.body.length} / {MAX}
                </Text>
              </View>
            </View>

            {vm.isNew ? (
              <Text
                style={{
                  fontFamily: 'Nunito_800ExtraBold',
                  fontSize: 13,
                  color: t.text,
                  textAlign: 'center',
                }}
              >
                a mood or one line is enough to save. stickers come after.
              </Text>
            ) : null}

            <View style={{ flexDirection: 'row', gap: 8 }}>
              {!vm.isNew ? (
                <View style={{ flex: 1 }}>
                  <PillButton
                    label="decorate"
                    variant="surface"
                    onPress={onDecorate}
                    accessibilityLabel="decorate"
                  />
                </View>
              ) : null}
              <View style={{ flex: 1 }}>
                <PillButton
                  label="save ♡"
                  disabled={!enabled}
                  onPress={onSave}
                  accessibilityLabel="save"
                />
              </View>
            </View>
          </View>
        </RetroWindow>
      </View>
    </Screen>
  );
}
