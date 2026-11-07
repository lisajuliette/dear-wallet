import { useMemo, useState } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Svg, { Defs, Pattern, Path, Rect } from 'react-native-svg';

import type { Mood } from '@/components/MoodPicker';
import { PixelIcon } from '@/components/PixelIcon';
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
  /** Short date in the page voice, like "nov 5". */
  dateLabel?: string;
  mood?: Mood | null;
  /** Diary entry written under "Dear Wallet,", under the stickers. */
  body?: string;
  /** No stickers yet: show the dashed drop area. */
  blank?: boolean;
  /** When set, parent can render AccessibleStickerControls for the selection. */
  selectedId?: string | null;
  onSelectedIdChange?: (id: string | null) => void;
};

const BASE = 72;

const MOOD_STICKER: Record<Mood, StickerId> = {
  proud: 'mood-proud',
  chill: 'mood-chill',
  meh: 'mood-meh',
  tempted: 'mood-tempted',
  wobbly: 'mood-wobbly',
};

export function StickerCanvas({
  page,
  stickers,
  onChange,
  accessibilityLabel = 'sticker canvas',
  dateLabel = '',
  mood = null,
  body = '',
  blank = false,
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
      <Svg
        pointerEvents="none"
        width={page.width}
        height={page.height}
        style={{ position: 'absolute', left: 0, top: 0 }}
      >
        <Defs>
          <Pattern id="decorateGrid" width={18} height={18} patternUnits="userSpaceOnUse">
            <Path d="M 18 0 L 0 0 0 18" fill="none" stroke={t.grid} strokeWidth={1} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#decorateGrid)" />
      </Svg>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 36,
          top: 0,
          bottom: 0,
          width: 3,
          backgroundColor: t.c1,
        }}
      />

      <View pointerEvents="none" style={{ position: 'absolute', left: 52, right: 18, top: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text
            style={{
              fontFamily: 'Pacifico_400Regular',
              fontSize: 28,
              lineHeight: 38,
              color: t.text,
            }}
          >
            {dateLabel}
          </Text>
          {mood ? <Sticker id={MOOD_STICKER[mood]} size={36} /> : null}
        </View>
        <Text
          style={{
            fontFamily: 'Pacifico_400Regular',
            fontSize: 20,
            lineHeight: 28,
            color: t.text,
          }}
        >
          Dear Wallet,
        </Text>
        {body ? (
          <Text
            style={{
              fontFamily: 'Nunito_700Bold',
              fontSize: 15,
              lineHeight: 30,
              color: t.text,
            }}
          >
            {body}
          </Text>
        ) : null}
      </View>

      {blank ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 52,
            right: 18,
            top: '54%',
            bottom: 16,
            borderRadius: 18,
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: t.ring,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingHorizontal: 18,
          }}
        >
          <PixelIcon name="sparkle" size={34} color={t.c3} />
          <Text
            style={{
              fontFamily: 'Nunito_900Black',
              fontSize: 16,
              color: t.text,
              textAlign: 'center',
            }}
          >
            this page is all urs
          </Text>
          <Text
            style={{
              fontFamily: 'Nunito_700Bold',
              fontSize: 13,
              color: t.text,
              textAlign: 'center',
            }}
          >
            drag a sticker up from the tray, anywhere u like
          </Text>
        </View>
      ) : null}

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
