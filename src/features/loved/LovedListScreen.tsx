import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import {
  EmptyState,
  IconButton,
  PillButton,
  PixelIcon,
  RetroWindow,
  Screen,
  ScriptText,
  Sticker,
} from '@/components';
import type { Item } from '@/features/items/repository';
import { formatCents } from '@/lib/money';
import { useTokens, type TokenName } from '@/theme';

export type LovedListViewModel = {
  monthLabel: string;
  monthName: string;
  count: number;
  items: Item[];
};

type LovedListScreenProps = {
  vm: LovedListViewModel;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onAdd: () => void;
};

const FILLS: TokenName[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c2'];

function cardDate(iso: string): string {
  return new Date(iso)
    .toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    .toLowerCase();
}

export function LovedListScreen({ vm, onPrevMonth, onNextMonth, onAdd }: LovedListScreenProps) {
  const t = useTokens();
  const { width } = useWindowDimensions();
  const gap = 12;
  const cardWidth = (width - 32 - gap) / 2;
  const empty = vm.items.length === 0;

  return (
    <Screen accessibilityLabel="Loved list">
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <IconButton
            accessibilityLabel="Back to tally"
            icon={<PixelIcon name="back" size={22} />}
            onPress={() => router.back()}
          />
          <View style={{ flex: 1 }}>
            <ScriptText size={30}>Loved</ScriptText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add a loved thing"
            onPress={onAdd}
            style={{
              height: 44,
              paddingHorizontal: 16,
              paddingLeft: 12,
              borderRadius: 22,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.btn,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <PixelIcon name="plus" size={16} color={t.btnText} />
            <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 15, color: t.btnText }}>
              add
            </Text>
          </Pressable>
        </View>

        <View
          style={{
            height: 44,
            borderRadius: 22,
            borderWidth: 2,
            borderColor: t.outline,
            backgroundColor: t.surface,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 4,
          }}
        >
          <IconButton
            size={36}
            accessibilityLabel="Previous month"
            icon={<PixelIcon name="back" size={16} />}
            onPress={onPrevMonth}
            style={{ borderWidth: 0, backgroundColor: 'transparent' }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
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
              {vm.monthLabel}
            </Text>
            <View
              style={{
                paddingHorizontal: 8,
                borderRadius: 999,
                backgroundColor: t.c1,
              }}
            >
              <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 12, color: t.text }}>
                {`${vm.count} loved`}
              </Text>
            </View>
          </View>
          <IconButton
            size={36}
            accessibilityLabel="Next month"
            icon={<PixelIcon name="forward" size={16} />}
            onPress={onNextMonth}
            style={{ borderWidth: 0, backgroundColor: 'transparent' }}
          />
        </View>

        {empty ? (
          <View style={{ gap: 16, marginTop: 20 }}>
            <RetroWindow title="LOVED.EXE" titleBar="pink">
              <EmptyState
                sticker="common-pixel-heart"
                title="nothing loved yet this month"
                body="add the things u bought and adored. a song, a place or a night out counts too. photo optional, no price needed."
              />
              <PillButton
                label="+ add a loved thing"
                onPress={onAdd}
                accessibilityLabel="add a loved thing"
              />
            </RetroWindow>
            <Text
              style={{
                fontFamily: 'Nunito_800ExtraBold',
                fontSize: 13,
                color: t.text,
                textAlign: 'center',
                paddingHorizontal: 16,
              }}
            >
              loved things stay separate from ur tally, so they never change ur kept total ♡
            </Text>
          </View>
        ) : (
          <>
            <ScrollView
              contentContainerStyle={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap,
                paddingBottom: 88,
              }}
            >
              {vm.items.map((item, index) => {
                const fill = FILLS[index % FILLS.length] ?? 'c1';
                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.name}, ${cardDate(item.happenedAt)}`}
                    onPress={() => router.push(`/item/${item.id}`)}
                    style={{
                      width: cardWidth,
                      height: 180,
                      borderRadius: 20,
                      borderWidth: 2,
                      borderColor: t.outline,
                      backgroundColor: t.surface,
                      overflow: 'hidden',
                    }}
                  >
                    <View
                      style={{
                        height: 108,
                        borderBottomWidth: 2,
                        borderColor: t.outline,
                        backgroundColor: item.photoPath ? t[fill] : t.surface,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.photoPath ? (
                        <Image
                          source={{ uri: item.photoPath }}
                          style={{ width: '100%', height: '100%' }}
                          contentFit="cover"
                        />
                      ) : (
                        <Sticker id="common-pixel-heart" size={72} />
                      )}
                      <View style={{ position: 'absolute', right: 8, top: 8 }}>
                        <PixelIcon name="heart" size={22} />
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        backgroundColor: t[fill],
                        justifyContent: 'center',
                        gap: 1,
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        style={{ fontFamily: 'Nunito_900Black', fontSize: 15, color: t.text }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 12, color: t.text }}
                      >
                        {cardDate(item.happenedAt)}
                        {item.amountCents != null ? ` · ${formatCents(item.amountCents)}` : ''}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
            <View style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
              <PillButton
                label={`make my ${vm.monthName} recap`}
                variant="secondary"
                onPress={() =>
                  router.push({
                    pathname: '/recap',
                    params: { period: 'month', kind: 'loved', month: vm.monthLabel },
                  })
                }
                accessibilityLabel={`make my ${vm.monthName} recap`}
              />
            </View>
          </>
        )}
      </View>
    </Screen>
  );
}
