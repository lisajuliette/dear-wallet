import { Pressable, Text, View } from 'react-native';

import { useTokens } from '@/theme';

type AccessibleStickerControlsProps = {
  onNudge: (dx: number, dy: number) => void;
  onScale: (delta: number) => void;
  onRotate: (deltaRad: number) => void;
  onRemove: () => void;
};

function ControlChip({ label, onPress }: { label: string; onPress: () => void }) {
  const t = useTokens();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={{
        minHeight: 44,
        minWidth: 44,
        paddingHorizontal: 10,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: t.outline,
        backgroundColor: t.surface,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 12, color: t.text }}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Keyboard / VoiceOver-friendly sticker transforms (no drag required). */
export function AccessibleStickerControls({
  onNudge,
  onScale,
  onRotate,
  onRemove,
}: AccessibleStickerControlsProps) {
  const t = useTokens();
  const step = 0.04;

  return (
    <View accessibilityLabel="Sticker controls" style={{ gap: 8, paddingVertical: 4 }}>
      <Text
        style={{
          fontFamily: 'PixelifySans_500Medium',
          fontSize: 12,
          letterSpacing: 0.72,
          color: t.text,
        }}
      >
        MOVE · RESIZE · ROTATE
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        <ControlChip label="left" onPress={() => onNudge(-step, 0)} />
        <ControlChip label="right" onPress={() => onNudge(step, 0)} />
        <ControlChip label="up" onPress={() => onNudge(0, -step)} />
        <ControlChip label="down" onPress={() => onNudge(0, step)} />
        <ControlChip label="bigger" onPress={() => onScale(0.15)} />
        <ControlChip label="smaller" onPress={() => onScale(-0.15)} />
        <ControlChip label="rotate" onPress={() => onRotate(Math.PI / 8)} />
        <ControlChip label="remove" onPress={onRemove} />
      </View>
    </View>
  );
}
