import { useState } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';

import { BottomSheet, IconButton, PixelIcon, PillButton, Screen, StickerTray } from '@/components';
import type { StickerId } from '@/components/stickerAssets';
import { AccessibleStickerControls } from '@/features/diary/AccessibleStickerControls';
import { clampStickerScale } from '@/features/diary/pageCoords';
import {
  StickerCanvas,
  defaultDropFraction,
  type CanvasSticker,
} from '@/features/diary/StickerCanvas';
import { useDecoratePageSize } from '@/features/diary/StickerCanvas';
import type { TrayCount } from '@/features/diary/trayCounts';
import { createId } from '@/lib/uuid';
import { useTokens } from '@/theme';

type DecorateScreenProps = {
  title: string;
  stickers: CanvasSticker[];
  tray: TrayCount[];
  trayOpen: boolean;
  onChangeStickers: (next: CanvasSticker[]) => void;
  onBack: () => void;
  onDone: () => void;
  onOpenTray: () => void;
  onCloseTray: () => void;
};

export function DecorateScreen({
  title,
  stickers,
  tray,
  trayOpen,
  onChangeStickers,
  onBack,
  onDone,
  onOpenTray,
  onCloseTray,
}: DecorateScreenProps) {
  const t = useTokens();
  const page = useDecoratePageSize();
  const { height } = useWindowDimensions();
  const compact = height < 740;
  const blank = stickers.length === 0;
  const trayEmpty = tray.length === 0 || tray.every((item) => item.count <= 0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = stickers.find((s) => s.id === selectedId) ?? null;

  const patchSelected = (patch: Partial<CanvasSticker>) => {
    if (!selected) return;
    onChangeStickers(stickers.map((s) => (s.id === selected.id ? { ...s, ...patch } : s)));
  };

  const place = (id: StickerId) => {
    const drop = defaultDropFraction();
    const maxZ = stickers.reduce((m, s) => Math.max(m, s.z), 0);
    onChangeStickers([
      ...stickers,
      {
        id: createId(),
        stickerId: id,
        x: drop.x,
        y: drop.y,
        scale: 1,
        rotation: 0,
        z: maxZ + 1,
      },
    ]);
    onCloseTray();
  };

  return (
    <Screen accessibilityLabel="Decorate page">
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8, gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconButton
            accessibilityLabel="Back to entry"
            icon={<PixelIcon name="back" size={22} />}
            onPress={onBack}
          />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 2,
                borderRadius: 999,
                borderWidth: 2,
                borderColor: t.outline,
                backgroundColor: t.surface,
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
          </View>
          <PillButton label="done" size="md" variant="secondary" onPress={onDone} />
        </View>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <View>
            <StickerCanvas
              page={page}
              stickers={stickers}
              onChange={onChangeStickers}
              selectedId={selectedId}
              onSelectedIdChange={setSelectedId}
            />
            {blank ? (
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
                  padding: 24,
                }}
              >
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
                    marginTop: 8,
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
          </View>
        </View>

        {selected ? (
          <AccessibleStickerControls
            onNudge={(dx, dy) => {
              patchSelected({
                x: Math.min(1, Math.max(0, selected.x + dx)),
                y: Math.min(1, Math.max(0, selected.y + dy)),
              });
            }}
            onScale={(delta) => {
              patchSelected({ scale: clampStickerScale(selected.scale + delta) });
            }}
            onRotate={(delta) => {
              patchSelected({ rotation: selected.rotation + delta });
            }}
            onRemove={() => {
              setSelectedId(null);
              onChangeStickers(stickers.filter((s) => s.id !== selected.id));
            }}
          />
        ) : (
          <View
            style={{
              alignSelf: 'center',
              paddingHorizontal: 14,
              height: 32,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.c3,
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 12, color: t.text }}>
              {blank
                ? 'drag up · drop anywhere · or use tray'
                : 'drag · or tap a sticker for move buttons'}
            </Text>
          </View>
        )}

        <PillButton
          label="sticker tray"
          variant="surface"
          size="md"
          onPress={onOpenTray}
          accessibilityLabel="Open sticker tray"
        />
      </View>

      <BottomSheet
        visible={trayOpen}
        title="STICKER TRAY"
        onClose={onCloseTray}
        accessibilityLabel="Sticker tray"
      >
        <View style={{ height: compact ? 150 : 168, justifyContent: 'center' }}>
          {trayEmpty ? (
            <View style={{ gap: 8, paddingVertical: 12 }}>
              <Text
                style={{
                  fontFamily: 'Nunito_900Black',
                  fontSize: 16,
                  color: t.text,
                  textAlign: 'center',
                }}
              >
                all stuck! ur page looks cute
              </Text>
              <Text
                style={{
                  fontFamily: 'Nunito_700Bold',
                  fontSize: 13,
                  color: t.text,
                  textAlign: 'center',
                }}
              >
                new stickers drop when u log or write. tap one on the page to send it back here.
              </Text>
            </View>
          ) : (
            <StickerTray items={tray} onSelect={place} />
          )}
        </View>
      </BottomSheet>
    </Screen>
  );
}
