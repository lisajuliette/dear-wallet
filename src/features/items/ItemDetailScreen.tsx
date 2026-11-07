import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import {
  IconButton,
  KindMessage,
  PillButton,
  PixelIcon,
  RetroWindow,
  Screen,
  StatusChip,
  TagChip,
} from '@/components';
import type { Item, ItemTag } from '@/features/items/repository';
import { formatCents } from '@/lib/money';
import { useTokens } from '@/theme';

type ItemDetailScreenProps = {
  item: Item;
  onAddPhoto: () => void;
  onToggleTag: (tag: ItemTag) => void;
  onBoughtAfterAll: () => void;
  onUndoBought: () => void;
  onRequestDelete: () => void;
};

function formatWhen(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toLowerCase();
  const time = d
    .toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
    .toLowerCase();
  return `${date} · ${time}`;
}

export function ItemDetailScreen({
  item,
  onAddPhoto,
  onToggleTag,
  onBoughtAfterAll,
  onUndoBought,
  onRequestDelete,
}: ItemDetailScreenProps) {
  const t = useTokens();
  const bought = item.boughtAfterAllAt != null;
  const amount = item.amountCents ?? 0;
  const amountNote = bought
    ? 'not in ur tally anymore'
    : item.tag === 'savings'
      ? 'in savings too ♡'
      : 'stays with u ♡';

  return (
    <Screen accessibilityLabel="Item detail">
      <ScrollView
        contentContainerStyle={{ gap: 12, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconButton
            accessibilityLabel="Back to tally"
            icon={<PixelIcon name="back" size={22} />}
            onPress={() => router.back()}
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
                ITEM
              </Text>
            </View>
          </View>
          <IconButton
            accessibilityLabel="Edit item"
            icon={<PixelIcon name="edit" size={22} />}
            onPress={() => {}}
          />
        </View>

        {item.photoPath ? (
          <RetroWindow title="PHOTO.JPG" titleBar="pink">
            <Image
              source={{ uri: item.photoPath }}
              style={{ width: '100%', height: 140, borderRadius: 8 }}
              contentFit="cover"
              accessibilityLabel="Item photo"
            />
          </RetroWindow>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="add a photo, optional"
            onPress={onAddPhoto}
            style={{
              height: 72,
              borderRadius: 20,
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: t.outline,
              backgroundColor: t.surface,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <PixelIcon name="photo" size={26} />
            <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 15, color: t.text }}>
              + add a photo
            </Text>
            <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 13, color: t.text }}>
              · optional
            </Text>
          </Pressable>
        )}

        <View style={{ gap: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text
              style={{
                flex: 1,
                fontFamily: 'Nunito_900Black',
                fontSize: 24,
                color: t.text,
                lineHeight: 30,
              }}
            >
              {item.name}
            </Text>
            <StatusChip
              label={bought ? 'BOUGHT AFTER ALL' : 'KEPT ♡'}
              fill={bought ? 'c1' : 'c4'}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
            <Text
              style={{
                fontFamily: 'PixelifySans_600SemiBold',
                fontSize: 40,
                color: t.text,
                textDecorationLine: bought ? 'line-through' : 'none',
              }}
            >
              {formatCents(amount)}
            </Text>
            <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: t.text }}>
              {amountNote}
            </Text>
          </View>
        </View>

        {bought ? (
          <KindMessage fill="c2">all good. u still paused, and that counts.</KindMessage>
        ) : null}

        <RetroWindow title="DETAILS" titleBar="mint">
          <View>
            <DetailRow label="WHEN" value={formatWhen(item.happenedAt)} />
            <DetailRow
              label="CATEGORY"
              value={item.category ?? '—'}
              chip={!!item.category}
              last={false}
            />
            <DetailRow label="NOTE" value={item.note ?? '—'} last multiline />
          </View>
        </RetroWindow>

        {!bought ? (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <TagChip
                label="moved to savings"
                selected={item.tag === 'savings'}
                onPress={() => onToggleTag('savings')}
              />
            </View>
            <View style={{ flex: 1 }}>
              <TagChip
                label="paid off debt"
                selected={item.tag === 'debt'}
                onPress={() => onToggleTag('debt')}
              />
            </View>
          </View>
        ) : null}

        {bought ? (
          <PillButton
            testID="item-undo-bought"
            label="undo, i didn't buy it"
            variant="surface"
            onPress={onUndoBought}
            accessibilityLabel="undo, i didn't buy it"
          />
        ) : (
          <PillButton
            testID="item-bought-after-all"
            label="i bought it after all"
            variant="secondary"
            onPress={onBoughtAfterAll}
            accessibilityLabel="i bought it after all"
          />
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="delete item"
          onPress={onRequestDelete}
          style={{
            height: 48,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <PixelIcon name="trash" size={18} />
          <Text
            style={{
              fontFamily: 'Nunito_800ExtraBold',
              fontSize: 15,
              color: t.text,
              textDecorationLine: 'underline',
            }}
          >
            delete item
          </Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

function DetailRow({
  label,
  value,
  chip,
  last,
  multiline,
}: {
  label: string;
  value: string;
  chip?: boolean;
  last?: boolean;
  multiline?: boolean;
}) {
  const t = useTokens();
  return (
    <View
      style={{
        minHeight: 44,
        flexDirection: 'row',
        alignItems: multiline ? 'flex-start' : 'center',
        gap: 12,
        borderBottomWidth: last ? 0 : 2,
        borderStyle: 'dashed',
        borderColor: t.outline,
        paddingVertical: multiline ? 10 : 0,
      }}
    >
      <Text
        style={{
          width: 74,
          fontFamily: 'PixelifySans_500Medium',
          fontSize: 12,
          letterSpacing: 0.72,
          color: t.text,
          paddingTop: multiline ? 2 : 0,
        }}
      >
        {label}
      </Text>
      {chip ? (
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 2,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: t.outline,
            backgroundColor: t.c5,
          }}
        >
          <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: t.text }}>
            {value}
          </Text>
        </View>
      ) : (
        <Text
          style={{
            flex: 1,
            fontFamily: multiline ? 'Nunito_700Bold' : 'Nunito_800ExtraBold',
            fontSize: 15,
            color: t.text,
            lineHeight: multiline ? 21 : undefined,
          }}
        >
          {value}
        </Text>
      )}
    </View>
  );
}
