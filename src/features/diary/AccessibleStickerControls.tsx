import { useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { PixelIcon } from '@/components/PixelIcon';
import { useTokens } from '@/theme';

type AccessibleStickerControlsProps = {
  onNudge: (dx: number, dy: number) => void;
  onScale: (delta: number) => void;
  onRotate: (deltaRad: number) => void;
  onRemove: () => void;
};

const SIZE = 26;
const GAP = 2;
const ICON = 13;
const CLUSTER = SIZE * 3 + GAP * 2;

function Chevron({ dir, color }: { dir: 'up' | 'down' | 'left' | 'right'; color: string }) {
  const d = {
    up: 'M3.2 9.2 L7 4.4 L10.8 9.2',
    down: 'M3.2 4.8 L7 9.6 L10.8 4.8',
    left: 'M9.2 3.2 L4.4 7 L9.2 10.8',
    right: 'M4.8 3.2 L9.6 7 L4.8 10.8',
  }[dir];
  return (
    <Svg width={ICON} height={ICON} viewBox="0 0 14 14">
      <Path
        d={d}
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function PadButton({
  label,
  onPress,
  children,
  style,
}: {
  label: string;
  onPress: () => void;
  children: ReactNode;
  style?: object;
}) {
  const t = useTokens();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={9}
      style={[
        {
          width: SIZE,
          height: SIZE,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: t.outline,
          backgroundColor: t.surface,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

function Cluster({ children }: { children: ReactNode }) {
  return <View style={{ width: CLUSTER, height: CLUSTER }}>{children}</View>;
}

/** Backup transforms when drag, pinch, and twist are hard to use. */
export function AccessibleStickerControls({
  onNudge,
  onScale,
  onRotate,
  onRemove,
}: AccessibleStickerControlsProps) {
  const t = useTokens();
  const [open, setOpen] = useState(false);
  const step = 0.04;
  const slot = SIZE + GAP;

  return (
    <View accessibilityLabel="Sticker controls" style={{ alignItems: 'center', marginBottom: 4 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={open ? 'Hide sticker controls' : 'Show sticker controls'}
        accessibilityState={{ expanded: open }}
        hitSlop={8}
        onPress={() => setOpen((value) => !value)}
        style={{
          minHeight: 28,
          paddingHorizontal: 8,
          borderRadius: 999,
          borderWidth: 2,
          borderColor: t.outline,
          backgroundColor: open ? t.c3 : t.surface,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Chevron dir={open ? 'down' : 'up'} color={t.text} />
        <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 11, color: t.text }}>
          controls
        </Text>
      </Pressable>

      {open ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 6,
            marginTop: 4,
          }}
        >
          <Cluster>
            <PadButton
              label="Move up"
              onPress={() => onNudge(0, -step)}
              style={{ position: 'absolute', top: 0, left: slot }}
            >
              <Chevron dir="up" color={t.text} />
            </PadButton>
            <PadButton
              label="Move left"
              onPress={() => onNudge(-step, 0)}
              style={{ position: 'absolute', top: slot, left: 0 }}
            >
              <Chevron dir="left" color={t.text} />
            </PadButton>
            <PadButton
              label="Move right"
              onPress={() => onNudge(step, 0)}
              style={{ position: 'absolute', top: slot, left: slot * 2 }}
            >
              <Chevron dir="right" color={t.text} />
            </PadButton>
            <PadButton
              label="Move down"
              onPress={() => onNudge(0, step)}
              style={{ position: 'absolute', top: slot * 2, left: slot }}
            >
              <Chevron dir="down" color={t.text} />
            </PadButton>
          </Cluster>
          <PadButton label="Remove sticker" onPress={onRemove}>
            <PixelIcon name="trash" size={ICON} />
          </PadButton>
          <Cluster>
            <PadButton
              label="Bigger"
              onPress={() => onScale(0.15)}
              style={{ position: 'absolute', top: 0, left: slot }}
            >
              <PixelIcon name="plus" size={ICON} />
            </PadButton>
            <PadButton
              label="Rotate left"
              onPress={() => onRotate(-Math.PI / 8)}
              style={{ position: 'absolute', top: slot, left: 0 }}
            >
              <View style={{ transform: [{ scaleX: -1 }] }}>
                <PixelIcon name="shuffle" size={ICON} />
              </View>
            </PadButton>
            <PadButton
              label="Rotate right"
              onPress={() => onRotate(Math.PI / 8)}
              style={{ position: 'absolute', top: slot, left: slot * 2 }}
            >
              <PixelIcon name="shuffle" size={ICON} />
            </PadButton>
            <PadButton
              label="Smaller"
              onPress={() => onScale(-0.15)}
              style={{ position: 'absolute', top: slot * 2, left: slot }}
            >
              <Svg width={ICON} height={ICON} viewBox="0 0 14 14">
                <Path
                  d="M3 7h8"
                  stroke={t.text}
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  fill="none"
                />
              </Svg>
            </PadButton>
          </Cluster>
        </View>
      ) : null}
    </View>
  );
}
