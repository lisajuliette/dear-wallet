import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

import { PixelIcon } from '@/components/PixelIcon';
import { palettes, tokens, type PaletteKey } from '@/theme';

type FaceplateProps = {
  palette: PaletteKey;
  locked?: boolean;
  selected?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/** Mini phone preview in its own palette (Settings / Onboarding). */
export function Faceplate({
  palette,
  locked = false,
  selected = false,
  onPress,
  accessibilityLabel,
}: FaceplateProps) {
  const t = tokens(palette);
  const label = accessibilityLabel ?? `${palettes[palette].name} faceplate`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled: locked }}
      disabled={!onPress}
      onPress={onPress}
      style={{
        width: 84,
        height: 150,
        borderRadius: 22,
        borderWidth: selected ? 3 : 2,
        borderColor: selected ? t.btn : t.outline,
        overflow: 'hidden',
        opacity: locked ? 0.72 : 1,
      }}
    >
      <LinearGradient
        colors={[t.bg1, t.bg2]}
        style={{ flex: 1, paddingHorizontal: 8, paddingTop: 6, paddingBottom: 6 }}
      >
        <View
          style={{
            alignSelf: 'center',
            width: 20,
            height: 5,
            borderRadius: 3,
            backgroundColor: t.outline,
            marginBottom: 7,
          }}
        />
        <View
          style={{
            height: 34,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: t.outline,
            backgroundColor: t.surface,
            overflow: 'hidden',
            marginBottom: 6,
          }}
        >
          <View
            style={{
              height: 8,
              backgroundColor: t.c1,
              borderBottomWidth: 2,
              borderColor: t.outline,
            }}
          />
          <Text
            style={{
              fontFamily: 'PixelifySans_600SemiBold',
              fontSize: 12,
              color: t.text,
              paddingHorizontal: 5,
              lineHeight: 18,
            }}
          >
            $38
          </Text>
        </View>
        {[t.c2, t.c3, t.c4].map((fill, index) => (
          <View
            key={index}
            style={{
              height: 14,
              borderRadius: 7,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: fill,
              marginBottom: 4,
            }}
          />
        ))}
        <View style={{ flex: 1 }} />
        <View
          style={{
            height: 22,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: t.outline,
            backgroundColor: t.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.btn,
            }}
          />
        </View>
      </LinearGradient>
      {locked ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: t.scrim,
          }}
        >
          <PixelIcon name="lock" size={22} color={t.btnText} accessibilityLabel="locked" />
        </View>
      ) : null}
    </Pressable>
  );
}
