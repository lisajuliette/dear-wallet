import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import {
  BarChart,
  ListRow,
  PixelIcon,
  RetroWindow,
  Screen,
  ScriptText,
  Segmented,
} from '@/components';
import type { Item } from '@/features/items/repository';
import {
  buildTallyBars,
  sideTotalsLabel,
  tallyCaption,
  tallyListNote,
  tallyListTitle,
  tallyWindowTitle,
  type TallyRange,
} from '@/features/tally/buildTallyBars';
import { formatCents } from '@/lib/money';
import { useTokens, type TokenName } from '@/theme';

export type { TallyRange };

export type TallyViewModel = {
  range: TallyRange;
  keptCents: number;
  allTimeCents: number;
  savingsCents: number;
  debtCents: number;
  items: Item[];
};

type TallyScreenProps = {
  vm: TallyViewModel;
  onRangeChange: (range: TallyRange) => void;
};

const FILLS: TokenName[] = ['c1', 'c5', 'c3', 'c2', 'c4'];

function itemMeta(item: Item): string {
  const when = new Date(item.happenedAt);
  const time = when.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const day = when.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toLowerCase();
  const bits = [`${day} · ${time}`];
  if (item.tag === 'savings') bits.push('moved to savings');
  if (item.tag === 'debt') bits.push('paid off debt');
  if (item.boughtAfterAllAt) bits.push('bought after all');
  return bits.join(' · ');
}

export function TallyScreen({ vm, onRangeChange }: TallyScreenProps) {
  const t = useTokens();
  const bars = buildTallyBars(vm.range, vm.items);
  const caption = tallyCaption(vm.range, bars, vm.keptCents);
  const listNote = tallyListNote(vm.range, vm.items.length, vm.keptCents);
  const showEmptyChart = vm.range !== 'day' && vm.keptCents <= 0;
  const showBars = vm.range !== 'day' && !showEmptyChart;
  const side = sideTotalsLabel(vm.savingsCents, vm.debtCents);

  return (
    <Screen accessibilityLabel="Tally">
      <ScrollView
        contentContainerStyle={{
          gap: 12,
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 100,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <ScriptText size={32}>Tally</ScriptText>
          </View>
          <Pressable
            accessibilityRole="button"
            testID="tally-loved-list"
            accessibilityLabel="loved list"
            onPress={() => router.push('/loved')}
            style={{
              height: 44,
              paddingHorizontal: 14,
              paddingLeft: 10,
              borderRadius: 22,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.surface,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <PixelIcon name="heart" size={18} />
            <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 14, color: t.text }}>
              loved list
            </Text>
          </Pressable>
        </View>

        <Segmented
          options={[
            { value: 'day', label: 'day' },
            { value: 'week', label: 'week' },
            { value: 'month', label: 'month' },
          ]}
          value={vm.range}
          onChange={(value) => onRangeChange(value as TallyRange)}
          accessibilityLabel="Tally range"
        />

        <RetroWindow title={tallyWindowTitle(vm.range)} titleBar="butter">
          <View style={{ gap: 2 }}>
            <Text style={{ fontFamily: 'PixelifySans_600SemiBold', fontSize: 44, color: t.text }}>
              {formatCents(vm.keptCents)}
            </Text>
            <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: t.text }}>
              {caption}
            </Text>
            {showBars ? <BarChart bars={bars} embedded /> : null}
            {showEmptyChart ? (
              <View
                accessibilityLabel="Empty chart"
                style={{
                  height: 140,
                  marginTop: 8,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderStyle: 'dashed',
                  borderColor: t.outline,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  paddingHorizontal: 20,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
                  {[14, 26, 20].map((h) => (
                    <View
                      key={h}
                      style={{
                        width: 18,
                        height: h,
                        borderRadius: 5,
                        borderWidth: 2,
                        borderStyle: 'dashed',
                        borderColor: t.outline,
                      }}
                    />
                  ))}
                </View>
                <Text
                  style={{
                    fontFamily: 'Nunito_900Black',
                    fontSize: 15,
                    color: t.text,
                    textAlign: 'center',
                  }}
                >
                  ur bars grow from ur first nvm
                </Text>
                <Text
                  style={{
                    fontFamily: 'Nunito_700Bold',
                    fontSize: 13,
                    color: t.text,
                    textAlign: 'center',
                  }}
                >
                  tap + whenever something tempts u
                </Text>
              </View>
            ) : null}
          </View>
        </RetroWindow>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View
            style={{
              flex: 1,
              height: 70,
              borderRadius: 18,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.surface,
              paddingHorizontal: 14,
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'PixelifySans_500Medium',
                fontSize: 12,
                letterSpacing: 0.72,
                color: t.text,
              }}
            >
              ALL TIME
            </Text>
            <Text style={{ fontFamily: 'PixelifySans_600SemiBold', fontSize: 24, color: t.text }}>
              {formatCents(vm.allTimeCents)}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              height: 70,
              borderRadius: 18,
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: t.outline,
              backgroundColor: t.surface,
              paddingHorizontal: 14,
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <Text
              style={{
                fontFamily: 'PixelifySans_500Medium',
                fontSize: 12,
                letterSpacing: 0.72,
                color: t.text,
              }}
            >
              SIDE TOTALS
            </Text>
            <Text
              style={{
                fontFamily: 'Nunito_800ExtraBold',
                fontSize: 13,
                color: t.text,
                lineHeight: 18,
              }}
            >
              {side}
            </Text>
          </View>
        </View>

        <RetroWindow
          title={tallyListTitle(vm.range)}
          titleBar="mint"
          right={
            <View
              style={{
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
                {vm.items.length}
              </Text>
            </View>
          }
        >
          <View style={{ gap: 6 }}>
            {vm.items.map((item, index) => (
              <ListRow
                key={item.id}
                testID={`tally-item-${item.name}`}
                title={item.name}
                meta={itemMeta(item)}
                amountCents={item.amountCents ?? undefined}
                fill={FILLS[index % FILLS.length]}
                onPress={() => router.push(`/item/${item.id}`)}
              />
            ))}
            {listNote ? (
              <Text
                style={{
                  fontFamily: 'Nunito_800ExtraBold',
                  fontSize: 13,
                  color: t.text,
                  textAlign: 'center',
                  paddingVertical: 8,
                }}
              >
                {listNote}
              </Text>
            ) : null}
          </View>
        </RetroWindow>
      </ScrollView>
    </Screen>
  );
}
