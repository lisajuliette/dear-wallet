import { useMemo, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { Sticker } from '@/components/Sticker';
import type { StickerId } from '@/components/stickerAssets';
import {
  clampStickerScale,
  fractionToPixels,
  pixelsToFraction,
  type PageSize,
} from '@/features/diary/pageCoords';
import { TransformHandles } from '@/features/diary/TransformHandles';
import { useTokens } from '@/theme';

export type CanvasSticker = {
  id: string;
  stickerId: StickerId;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  z: number;
};

type StickerCanvasProps = {
  page: PageSize;
  stickers: CanvasSticker[];
  onChange: (next: CanvasSticker[]) => void;
  accessibilityLabel?: string;
  /** When set, parent can render AccessibleStickerControls for the selection. */
  selectedId?: string | null;
  onSelectedIdChange?: (id: string | null) => void;
};

const BASE = 72;

export function StickerCanvas({
  page,
  stickers,
  onChange,
  accessibilityLabel = 'sticker canvas',
  selectedId: selectedIdProp,
  onSelectedIdChange,
}: StickerCanvasProps) {
  const t = useTokens();
  const [internalSelected, setInternalSelected] = useState<string | null>(null);
  const selectedId = selectedIdProp !== undefined ? selectedIdProp : internalSelected;
  const setSelectedId = (id: string | null) => {
    onSelectedIdChange?.(id);
    if (selectedIdProp === undefined) setInternalSelected(id);
  };
  const sorted = useMemo(() => [...stickers].sort((a, b) => a.z - b.z), [stickers]);

  const update = (id: string, patch: Partial<CanvasSticker>) => {
    onChange(stickers.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const remove = (id: string) => {
    setSelectedId(null);
    onChange(stickers.filter((s) => s.id !== id));
  };

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={{
        width: page.width,
        height: page.height,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: t.outline,
        backgroundColor: t.surface,
        overflow: 'hidden',
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 28,
          top: 0,
          bottom: 0,
          width: 2,
          backgroundColor: t.c1,
        }}
      />
      {Array.from({ length: Math.floor(page.height / 28) }).map((_, i) => (
        <View
          key={i}
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 36 + i * 28,
            height: 1,
            backgroundColor: t.ring,
          }}
        />
      ))}

      {sorted.map((sticker) => (
        <PlacedSticker
          key={`${sticker.id}:${sticker.x}:${sticker.y}:${sticker.scale}:${sticker.rotation}`}
          sticker={sticker}
          page={page}
          selected={selectedId === sticker.id}
          onSelect={() => setSelectedId(sticker.id)}
          onChange={(patch) => update(sticker.id, patch)}
          onRemove={() => remove(sticker.id)}
        />
      ))}
    </View>
  );
}

function PlacedSticker({
  sticker,
  page,
  selected,
  onSelect,
  onChange,
  onRemove,
}: {
  sticker: CanvasSticker;
  page: PageSize;
  selected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<CanvasSticker>) => void;
  onRemove: () => void;
}) {
  const px = fractionToPixels({ x: sticker.x, y: sticker.y }, page);
  const translateX = useSharedValue(px.x);
  const translateY = useSharedValue(px.y);
  const scaleSv = useSharedValue(sticker.scale);
  const rotationSv = useSharedValue(sticker.rotation);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const startScale = useSharedValue(1);
  const startRot = useSharedValue(0);

  const commitFromUI = (x: number, y: number, nextScale: number, nextRot: number) => {
    const frac = pixelsToFraction({ x, y }, page);
    onChange({
      x: Math.min(1, Math.max(0, frac.x)),
      y: Math.min(1, Math.max(0, frac.y)),
      scale: clampStickerScale(nextScale),
      rotation: nextRot,
    });
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = startX.value + e.translationX;
      translateY.value = startY.value + e.translationY;
    })
    .onEnd(() => {
      runOnJS(commitFromUI)(translateX.value, translateY.value, scaleSv.value, rotationSv.value);
    });

  const pinch = Gesture.Pinch()
    .onBegin(() => {
      startScale.value = scaleSv.value;
    })
    .onUpdate((e) => {
      const next = startScale.value * e.scale;
      scaleSv.value = Math.min(2.5, Math.max(0.4, next));
    })
    .onEnd(() => {
      runOnJS(commitFromUI)(translateX.value, translateY.value, scaleSv.value, rotationSv.value);
    });

  const rotateG = Gesture.Rotation()
    .onBegin(() => {
      startRot.value = rotationSv.value;
    })
    .onUpdate((e) => {
      rotationSv.value = startRot.value + e.rotation;
    })
    .onEnd(() => {
      runOnJS(commitFromUI)(translateX.value, translateY.value, scaleSv.value, rotationSv.value);
    });

  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(onSelect)();
  });

  const composed = Gesture.Simultaneous(pan, pinch, rotateG, tap);

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: 0,
    top: 0,
    transform: [
      { translateX: translateX.value - (BASE * scaleSv.value) / 2 },
      { translateY: translateY.value - (BASE * scaleSv.value) / 2 },
      { scale: scaleSv.value },
      { rotate: `${rotationSv.value}rad` },
    ],
    zIndex: sticker.z,
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={style}>
        <View style={{ width: BASE, height: BASE }}>
          <Sticker id={sticker.stickerId} size={BASE} />
          {selected ? (
            <TransformHandles
              onRemove={onRemove}
              onRotatePress={() => {
                const next = rotationSv.value + Math.PI / 8;
                commitFromUI(translateX.value, translateY.value, scaleSv.value, next);
              }}
              onResizePress={() => {
                const next = clampStickerScale(scaleSv.value + 0.15);
                commitFromUI(translateX.value, translateY.value, next, rotationSv.value);
              }}
            />
          ) : null}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

export function defaultDropFraction(): { x: number; y: number } {
  return { x: 0.5, y: 0.45 };
}

export function useDecoratePageSize(): PageSize {
  const { width, height } = useWindowDimensions();
  const isCompact = height < 740;
  const pageWidth = width - 32;
  const tray = isCompact ? 150 : 168;
  const header = 72;
  const hint = 40;
  return {
    width: pageWidth,
    height: Math.max(220, height - header - tray - hint - 48),
  };
}
