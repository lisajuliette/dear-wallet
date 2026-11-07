import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';

import {
  BottomSheet,
  PixelIcon,
  PillButton,
  RetroWindow,
  Screen,
  ScriptText,
  Sticker,
} from '@/components';
import {
  ALBUM_SLOT_COUNT,
  albumOwnedCount,
  isStickerId,
  type AlbumSlot,
  type MilestoneBadge,
  type PackCard,
} from '@/features/collection/collectionModel';
import { useTokens } from '@/theme';

export type CollectionScreenProps = {
  stars: number;
  mileCount: number;
  badges: MilestoneBadge[];
  album: AlbumSlot[];
  packs: PackCard[];
  lockedPack: PackCard | null;
  onCloseLocked: () => void;
  onOpenLocked: (pack: PackCard) => void;
};

function Badge({ badge }: { badge: MilestoneBadge }) {
  const t = useTokens();
  const done = badge.state === 'done';
  const next = badge.state === 'next';
  return (
    <View style={{ alignItems: 'center', gap: 5, flex: 1 }}>
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          borderWidth: 2,
          borderStyle: next || badge.state === 'locked' ? 'dashed' : 'solid',
          borderColor: t.outline,
          backgroundColor: done ? t.c3 : t.surface,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {done ? <PixelIcon name="sparkle" size={26} /> : null}
        {next ? (
          <Text style={{ fontFamily: 'PixelifySans_600SemiBold', fontSize: 13, color: t.text }}>
            {badge.pct}
          </Text>
        ) : null}
        {badge.state === 'locked' ? <PixelIcon name="lock" size={20} /> : null}
      </View>
      <Text
        style={{
          fontFamily: 'Nunito_800ExtraBold',
          fontSize: 11,
          color: t.text,
          textAlign: 'center',
        }}
      >
        {badge.label}
      </Text>
    </View>
  );
}

export function CollectionScreen({
  stars,
  mileCount,
  badges,
  album,
  packs,
  lockedPack,
  onCloseLocked,
  onOpenLocked,
}: CollectionScreenProps) {
  const t = useTokens();
  const { height } = useWindowDimensions();
  const compact = height < 740;
  const owned = albumOwnedCount(album);
  const more = Math.max(0, ALBUM_SLOT_COUNT - owned);

  return (
    <Screen accessibilityLabel="Collection">
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <ScriptText size={compact ? 26 : 30}>Collection</ScriptText>
          </View>
          <View
            style={{
              height: 36,
              paddingHorizontal: 12,
              borderRadius: 18,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.surface,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <PixelIcon name="sparkle" size={18} />
            <Text style={{ fontFamily: 'PixelifySans_600SemiBold', fontSize: 16, color: t.text }}>
              {stars}
            </Text>
            <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 12, color: t.text }}>
              stars
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ gap: 12, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <RetroWindow title="MILESTONES" titleBar="butter" right={`${mileCount} of 9`}>
            <View style={{ flexDirection: 'row', gap: 6, paddingVertical: 4 }}>
              {badges.map((b) => (
                <Badge key={b.id} badge={b} />
              ))}
            </View>
          </RetroWindow>

          <RetroWindow
            title="STICKER ALBUM"
            titleBar="pink"
            right={`${owned} / ${ALBUM_SLOT_COUNT}`}
          >
            <Text
              style={{ fontFamily: 'Nunito_700Bold', fontSize: 13, color: t.text, marginBottom: 8 }}
            >
              it fills up as u log + write. no rush ♡
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {album.map((slot) => (
                <View
                  key={slot.id}
                  style={{
                    width: '14.5%',
                    aspectRatio: 1,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderStyle: slot.owned && slot.hasArt ? 'solid' : 'dashed',
                    borderColor: t.outline,
                    backgroundColor: t.surface,
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {slot.owned && slot.hasArt && isStickerId(slot.id) ? (
                    <Sticker id={slot.id} size={36} />
                  ) : (
                    <Text
                      style={{
                        fontFamily: 'PixelifySans_600SemiBold',
                        fontSize: 16,
                        color: t.soft,
                      }}
                    >
                      ?
                    </Text>
                  )}
                </View>
              ))}
            </View>
            <Text
              style={{
                fontFamily: 'Nunito_700Bold',
                fontSize: 13,
                color: t.text,
                marginTop: 8,
              }}
            >
              {more} more to find. rares are holo ✦
            </Text>
          </RetroWindow>

          <View style={{ gap: 8 }}>
            <Text
              style={{
                fontFamily: 'PixelifySans_500Medium',
                fontSize: 13,
                letterSpacing: 0.78,
                color: t.text,
              }}
            >
              STICKER PACKS
            </Text>
            {packs.map((pack) => (
              <Pressable
                key={pack.id}
                accessibilityRole="button"
                accessibilityLabel={`${pack.label} pack`}
                disabled={!pack.locked}
                onPress={() => {
                  if (pack.locked) onOpenLocked(pack);
                }}
                style={{
                  borderRadius: 18,
                  borderWidth: 2,
                  borderColor: t.outline,
                  backgroundColor: t.surface,
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  opacity: pack.locked ? 1 : 1,
                }}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: t.outline,
                    backgroundColor: pack.locked ? t.c2 : t.c3,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {pack.locked ? (
                    <PixelIcon name="lock" size={22} />
                  ) : (
                    <PixelIcon name="sparkle" size={22} />
                  )}
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 16, color: t.text }}>
                    {pack.label}
                  </Text>
                  <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 13, color: t.text }}>
                    {pack.locked
                      ? pack.id === 'y2k_desk'
                        ? 'at $500 kept'
                        : 'at 50 logs'
                      : 'open ♡'}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      <BottomSheet
        visible={!!lockedPack}
        title={`${(lockedPack?.label ?? '').toUpperCase()} PACK`}
        onClose={onCloseLocked}
      >
        {lockedPack ? (
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
              {Array.from({ length: Math.min(6, lockedPack.silhouetteCount) }).map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderStyle: 'dashed',
                    borderColor: t.outline,
                    backgroundColor: t.c5,
                  }}
                />
              ))}
            </View>
            <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: t.text }}>
              {lockedPack.unlockHint}
            </Text>
            <View
              style={{
                height: 14,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: t.outline,
                overflow: 'hidden',
                backgroundColor: t.surface,
              }}
            >
              <View
                style={{
                  width: `${Math.round(lockedPack.progress * 100)}%`,
                  height: '100%',
                  backgroundColor: t.c3,
                }}
              />
            </View>
            <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 14, color: t.text }}>
              {lockedPack.remainingLabel}
            </Text>
            <PillButton label="cute, got it" onPress={onCloseLocked} />
          </View>
        ) : null}
      </BottomSheet>
    </Screen>
  );
}
