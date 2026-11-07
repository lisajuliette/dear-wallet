import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';

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
  type MilestoneRow,
  type PackCard,
} from '@/features/collection/collectionModel';
import { TASKBAR_SCROLL_PAD } from '@/lib/taskbarPad';
import { HOLO, useTokens } from '@/theme';

export type CollectionScreenProps = {
  stars: number;
  mileCount: number;
  badges: MilestoneBadge[];
  milestones: MilestoneRow[];
  album: AlbumSlot[];
  packs: PackCard[];
  lockedPack: PackCard | null;
  onCloseLocked: () => void;
  onOpenLocked: (pack: PackCard) => void;
};

function ProgressArc({ pct }: { pct: string }) {
  const t = useTokens();
  const value = Number.parseInt(pct, 10);
  if (!Number.isFinite(value) || value <= 0) return null;
  const fraction = Math.min(1, value / 100);
  const size = 52;
  const stroke = 5;
  const r = size / 2 - stroke / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * fraction;
  return (
    <Svg width={size} height={size} style={{ position: 'absolute' }} pointerEvents="none">
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={t.btn}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={`${dash} ${circ}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
}

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
        {next ? <ProgressArc pct={badge.pct} /> : null}
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

function PackTile({
  pack,
  ownedCount,
  onOpen,
}: {
  pack: PackCard;
  ownedCount: number;
  onOpen: (pack: PackCard) => void;
}) {
  const t = useTokens();
  const subtitle = pack.locked
    ? pack.id === 'y2k_desk'
      ? 'at $500 kept'
      : 'at 50 logs'
    : `${ownedCount} of ${pack.stickerIds.length}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        pack.locked ? `${pack.label} pack, locked` : `${pack.label} pack, ${subtitle}`
      }
      onPress={() => onOpen(pack)}
      style={{
        flex: 1,
        height: 196,
        borderRadius: 18,
        borderWidth: 2,
        borderStyle: pack.locked ? 'dashed' : 'solid',
        borderColor: t.outline,
        backgroundColor: t.surface,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          height: 108,
          borderBottomWidth: 2,
          borderBottomColor: t.outline,
          borderStyle: pack.locked ? 'dashed' : 'solid',
          backgroundColor: pack.id === 'y2k_desk' ? t.c3 : t.c5,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {pack.id === 'y2k_desk' ? (
          <Svg width="100%" height="100%" style={{ position: 'absolute' }}>
            <Defs>
              <Pattern id="pack-y2k" width={16} height={16} patternUnits="userSpaceOnUse">
                <Rect width={8} height={8} fill={t.surface} />
                <Rect x={8} y={8} width={8} height={8} fill={t.surface} />
              </Pattern>
            </Defs>
            <Rect width="100%" height="100%" fill={t.c3} />
            <Rect width="100%" height="100%" fill="url(#pack-y2k)" />
          </Svg>
        ) : null}
        {pack.id === 'holo_club' ? (
          <LinearGradient
            colors={HOLO as unknown as [string, string, string, string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          />
        ) : null}
        {pack.locked ? (
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PixelIcon name="lock" size={24} />
          </View>
        ) : (
          <View style={{ width: '100%', height: 92 }}>
            <View
              style={{ position: 'absolute', left: 4, top: 22, transform: [{ rotate: '-12deg' }] }}
            >
              <Sticker id="common-lil-cloud" size={46} />
            </View>
            <View
              style={{ position: 'absolute', left: 28, top: 8, transform: [{ rotate: '4deg' }] }}
            >
              <Sticker id="common-pixel-heart" size={46} />
            </View>
            <View
              style={{ position: 'absolute', left: 52, top: 26, transform: [{ rotate: '14deg' }] }}
            >
              <Sticker id="common-butterfly" size={46} />
            </View>
          </View>
        )}
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 10,
        }}
      >
        <Text
          style={{
            fontFamily: 'Nunito_900Black',
            fontSize: 14,
            lineHeight: 18,
            color: t.text,
            textAlign: 'center',
          }}
        >
          {pack.label}
        </Text>
        <Text
          style={{
            marginTop: 2,
            fontFamily: 'Nunito_800ExtraBold',
            fontSize: 12,
            lineHeight: 16,
            color: t.text,
            textAlign: 'center',
          }}
        >
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

export function CollectionScreen({
  stars,
  mileCount,
  badges,
  milestones,
  album,
  packs,
  lockedPack,
  onCloseLocked,
  onOpenLocked,
}: CollectionScreenProps) {
  const t = useTokens();
  const [milestonesOpen, setMilestonesOpen] = useState(false);
  const { height } = useWindowDimensions();
  const compact = height < 740;
  const owned = albumOwnedCount(album);
  const more = Math.max(0, ALBUM_SLOT_COUNT - owned);
  const ownedIn = (pack: PackCard) =>
    album.filter((slot) => slot.owned && pack.stickerIds.includes(slot.id)).length;

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
          style={{ flex: 1, marginBottom: TASKBAR_SCROLL_PAD }}
          contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <RetroWindow title="MILESTONES" titleBar="butter" right={`${mileCount} of 9`}>
            <View style={{ flexDirection: 'row', gap: 6, paddingVertical: 4 }}>
              {badges.map((b) => (
                <Badge key={b.id} badge={b} />
              ))}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="See all milestones"
              onPress={() => setMilestonesOpen(true)}
              style={{
                minHeight: 44,
                marginTop: 8,
                borderRadius: 999,
                borderWidth: 2,
                borderColor: t.outline,
                backgroundColor: t.c3,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 14,
              }}
            >
              <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 14, color: t.text }}>
                see all {milestones.length}
              </Text>
            </Pressable>
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
                    height: 50,
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
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {packs.map((pack) => (
                <PackTile
                  key={pack.id}
                  pack={pack}
                  ownedCount={ownedIn(pack)}
                  onOpen={onOpenLocked}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      <BottomSheet
        visible={milestonesOpen}
        title="MILESTONES"
        onClose={() => setMilestonesOpen(false)}
      >
        <View style={{ gap: 8 }}>
          {milestones.map((m) => (
            <View
              key={m.id}
              style={{
                minHeight: 56,
                borderRadius: 16,
                borderWidth: 2,
                borderStyle: m.state === 'done' ? 'solid' : 'dashed',
                borderColor: t.outline,
                backgroundColor: m.state === 'done' ? t.c3 : t.surface,
                paddingHorizontal: 12,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <View style={{ width: 72 }}>
                <Text
                  style={{ fontFamily: 'PixelifySans_600SemiBold', fontSize: 16, color: t.text }}
                >
                  {m.label}
                </Text>
                <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 11, color: t.text }}>
                  {m.state === 'done' ? 'earned' : m.pct}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: t.text }}>
                  {m.headline}
                </Text>
                <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 12, color: t.text }}>
                  {m.unit.toLowerCase()}
                </Text>
              </View>
              {m.state === 'locked' ? <PixelIcon name="lock" size={18} /> : null}
              {m.state === 'done' ? <PixelIcon name="sparkle" size={18} /> : null}
            </View>
          ))}
        </View>
      </BottomSheet>

      <BottomSheet
        visible={!!lockedPack}
        title={`${(lockedPack?.label ?? '').toUpperCase()} PACK`}
        onClose={onCloseLocked}
      >
        {lockedPack ? (
          <View style={{ gap: 12 }}>
            <View
              style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}
            >
              {lockedPack.stickerIds.map((id) => (
                <View
                  key={id}
                  style={{
                    width: 68,
                    height: 76,
                    borderRadius: 14,
                    borderWidth: 2,
                    borderStyle: lockedPack.locked ? 'dashed' : 'solid',
                    borderColor: t.outline,
                    backgroundColor: t.surface,
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {isStickerId(id) ? (
                    <View style={{ opacity: lockedPack.locked ? 0.32 : 1 }}>
                      <Sticker id={id} size={52} />
                    </View>
                  ) : (
                    <View
                      style={{
                        width: 36,
                        height: 44,
                        borderRadius: 14,
                        backgroundColor: t.soft,
                        opacity: 0.7,
                      }}
                    />
                  )}
                </View>
              ))}
            </View>
            <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: t.text }}>
              {lockedPack.locked ? lockedPack.unlockHint : 'every sticker in this pack'}
            </Text>
            {lockedPack.locked ? (
              <>
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
              </>
            ) : null}
            <PillButton label="cute, got it" onPress={onCloseLocked} />
          </View>
        ) : null}
      </BottomSheet>
    </Screen>
  );
}
