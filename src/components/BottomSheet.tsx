import { type ReactNode } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CheckerBar } from '@/components/CheckerBar';
import { useTokens } from '@/theme';

type BottomSheetProps = {
  visible: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  accessibilityLabel?: string;
};

/** Sheet with radius 28 top, checker title bar, and scrim. */
export function BottomSheet({
  visible,
  title,
  children,
  onClose,
  accessibilityLabel,
}: BottomSheetProps) {
  const t = useTokens();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          onPress={onClose}
          style={{
            ...({ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } as const),
            backgroundColor: t.scrim,
          }}
        />
        <View
          accessibilityLabel={accessibilityLabel ?? title}
          style={{
            backgroundColor: t.outline,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingTop: 2,
            paddingHorizontal: 2,
          }}
        >
          <View
            style={{
              backgroundColor: t.surface,
              borderTopLeftRadius: 26,
              borderTopRightRadius: 26,
              overflow: 'hidden',
              paddingBottom: Math.max(insets.bottom, 16),
            }}
          >
            <View
              style={{
                height: 44,
                borderBottomWidth: 2,
                borderColor: t.outline,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
                gap: 8,
              }}
            >
              <CheckerBar a={t.c1} b={t.c2} patternId="sheetChecker" height={44} />
              <View
                style={{
                  zIndex: 1,
                  borderRadius: 999,
                  borderWidth: 2,
                  borderColor: t.outline,
                  backgroundColor: t.surface,
                  paddingHorizontal: 10,
                  paddingVertical: 2,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'PixelifySans_500Medium',
                    fontSize: 13,
                    letterSpacing: 0.78,
                    color: t.text,
                  }}
                >
                  {title}
                </Text>
              </View>
              <View style={{ flex: 1 }} />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={onClose}
                hitSlop={10}
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
                <Text style={{ color: t.text, fontSize: 16, fontFamily: 'Nunito_900Black' }}>
                  ×
                </Text>
              </Pressable>
            </View>
            <View style={{ padding: 16 }}>{children}</View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
