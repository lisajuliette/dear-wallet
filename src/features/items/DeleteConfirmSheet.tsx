import { Text, View } from 'react-native';

import { BottomSheet, PillButton, Sticker } from '@/components';
import { useTokens } from '@/theme';

type DeleteConfirmSheetProps = {
  visible: boolean;
  name: string;
  onKeep: () => void;
  onDelete: () => void;
};

export function DeleteConfirmSheet({ visible, name, onKeep, onDelete }: DeleteConfirmSheetProps) {
  const t = useTokens();

  return (
    <BottomSheet
      visible={visible}
      title="DELETE ITEM?"
      onClose={onKeep}
      accessibilityLabel="Delete confirmation"
    >
      <View style={{ alignItems: 'center', gap: 12 }}>
        <Sticker id="mood-wobbly" size={72} />
        <Text
          style={{
            fontFamily: 'Nunito_900Black',
            fontSize: 20,
            color: t.text,
            textAlign: 'center',
          }}
        >
          {`delete ${name}?`}
        </Text>
        <Text
          style={{
            fontFamily: 'Nunito_700Bold',
            fontSize: 14,
            color: t.text,
            textAlign: 'center',
            lineHeight: 20,
          }}
        >
          {"it leaves ur tally and ur history. this one can't be undone."}
        </Text>
        <View
          style={{
            width: '100%',
            borderRadius: 16,
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: t.outline,
            padding: 12,
          }}
        >
          <Text
            style={{
              fontFamily: 'Nunito_800ExtraBold',
              fontSize: 13,
              color: t.text,
              textAlign: 'center',
              lineHeight: 18,
            }}
          >
            {"bought it after all? use that instead. it keeps the memory and there's no penalty ♡"}
          </Text>
        </View>
        <PillButton
          label="keep it"
          variant="primary"
          onPress={onKeep}
          accessibilityLabel="keep it"
        />
        <PillButton
          label="yes, delete it"
          variant="surface"
          onPress={onDelete}
          accessibilityLabel="yes, delete it"
        />
      </View>
    </BottomSheet>
  );
}
