import { useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';

import { CheckerBar, IconButton, PixelIcon, Screen, StickerTray } from '@/components';
import type { Mood } from '@/components/MoodPicker';
import type { StickerId } from '@/components/stickerAssets';
import { type PageSize } from '@/features/diary/pageCoords';
import {
  StickerCanvas,
  defaultDropFraction,
  type CanvasSticker,
} from '@/features/diary/StickerCanvas';
import type { TrayCount } from '@/features/diary/trayCounts';
import { createId } from '@/lib/uuid';
import { useTokens } from '@/theme';

type DecorateScreenProps = {
  title: string;
  dateLabel: string;
  mood: Mood | null;
  body: string;
  stickers: CanvasSticker[];
  tray: TrayCount[];
  onChangeStickers: (next: CanvasSticker[]) => void;
  onBack: () => void;
  onDone: () => void;
};

export function DecorateScreen({
  title,
  dateLabel,
  mood,
  body,
  stickers,
  tray,
  onChangeStickers,
  onBack,
  onDone,
}: DecorateScreenProps) {
  const t = useTokens();
  const { height } = useWindowDimensions();
  const compact = height < 740;
  const trayHeight = compact ? 150 : 168;
  const blank = stickers.length === 0;
  const trayEmpty = tray.length === 0;
  const trayCount = tray.reduce((sum, item) => sum + item.count, 0);
  const [page, setPage] = useState<PageSize>({ width: 320, height: 520 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = stickers.find((s) => s.id === selectedId) ?? null;

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
  };

  return (
    <Screen accessibilityLabel="Decorate page">
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8 }}>
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
                  fontSize: 14,
                  letterSpacing: 0.84,
                  color: t.text,
                }}
              >
                {title}
              </Text>
            </View>
          </View>
          <Pressable
            testID="decorate-done"
            accessibilityRole="button"
            accessibilityLabel="done"
            onPress={onDone}
            style={{
              height: 44,
              paddingHorizontal: 18,
              borderRadius: 22,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.btn,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 3,
            }}
          >
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 3,
                right: 0,
                bottom: -3,
                left: 0,
                borderRadius: 22,
                backgroundColor: t.shadow,
                zIndex: -1,
              }}
            />
            <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 15, color: t.btnText }}>
              done
            </Text>
          </Pressable>
        </View>

        <View
          style={{ flex: 1, marginTop: 12, marginBottom: 6 }}
          onLayout={(event) => {
            const next = event.nativeEvent.layout;
            if (next.width > 0 && next.height > 0) {
              setPage({ width: next.width, height: next.height });
            }
          }}
        >
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 6,
              bottom: -6,
              borderRadius: 20,
              backgroundColor: t.shadow,
            }}
          />
          <StickerCanvas
            page={page}
            stickers={stickers}
            dateLabel={dateLabel}
            mood={mood}
            body={body}
            blank={blank}
            onChange={onChangeStickers}
            selectedId={selectedId}
            onSelectedIdChange={setSelectedId}
          />
        </View>

        {selected || trayEmpty ? null : (
          <View style={{ alignItems: 'center', marginBottom: 8 }}>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 999,
                borderWidth: 2,
                borderColor: t.outline,
                backgroundColor: t.surface,
              }}
            >
              <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 12, color: t.text }}>
                {blank ? 'drag up · drop anywhere' : 'drag · pinch to resize · twist to rotate'}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View
        accessibilityLabel="Sticker tray"
        style={{
          height: trayHeight,
          backgroundColor: t.outline,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingTop: 2,
          paddingHorizontal: 2,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: t.surface,
            borderTopLeftRadius: 26,
            borderTopRightRadius: 26,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: 44,
              borderBottomWidth: 2,
              borderColor: t.outline,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 14,
            }}
          >
            <CheckerBar a={t.c4} b={t.c5} patternId="trayChecker" height={44} />
            <View
              style={{
                zIndex: 1,
                paddingHorizontal: 10,
                paddingVertical: 1,
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
                STICKER TRAY
              </Text>
            </View>
            <View
              style={{
                zIndex: 1,
                minWidth: 24,
                height: 24,
                paddingHorizontal: 6,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: t.outline,
                backgroundColor: t.surface,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontFamily: 'PixelifySans_600SemiBold', fontSize: 13, color: t.text }}>
                {trayEmpty ? '0' : String(trayCount)}
              </Text>
            </View>
          </View>

          {trayEmpty ? (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                paddingHorizontal: 20,
              }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  borderWidth: 2,
                  borderStyle: 'dashed',
                  borderColor: t.outline,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PixelIcon name="sparkle" size={28} color={t.c2} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 16, color: t.text }}>
                  all stuck! ur page looks cute
                </Text>
                <Text
                  style={{
                    fontFamily: 'Nunito_700Bold',
                    fontSize: 13,
                    lineHeight: 18,
                    color: t.text,
                  }}
                >
                  new stickers drop when u log or write. tap one on the page to send it back here.
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 16 }}>
              <StickerTray items={tray} onSelect={place} />
            </View>
          )}
        </View>
      </View>
    </Screen>
  );
}
