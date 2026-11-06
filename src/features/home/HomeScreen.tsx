import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import {
  CloudCard,
  EmptyState,
  IconButton,
  ListRow,
  PixelIcon,
  RetroWindow,
  Screen,
  ScriptText,
  SegmentBar,
} from '@/components';
import { formatKept, type HomeViewModel } from '@/features/home/homeModel';
import { useTokens } from '@/theme';

type HomeScreenProps = {
  vm: HomeViewModel;
  onRefresh?: () => void;
};

export function HomeScreen({ vm }: HomeScreenProps) {
  const t = useTokens();

  return (
    <Screen accessibilityLabel="Home">
      <ScrollView
        contentContainerStyle={{ gap: 14, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: 'PixelifySans_500Medium',
                fontSize: 13,
                letterSpacing: 0.78,
                color: t.text,
              }}
            >
              {vm.greeting}
            </Text>
            <ScriptText size={30}>Dear Wallet</ScriptText>
          </View>
          <View
            accessibilityLabel={`${vm.starCount} stars`}
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
              {vm.starCount}
            </Text>
            <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 12, color: t.text }}>
              stars
            </Text>
          </View>
          <IconButton
            accessibilityLabel="Settings"
            icon={<PixelIcon name="settings" size={22} />}
            onPress={() => router.push('/dev/theme')}
          />
        </View>

        <RetroWindow title="KEPT TODAY">
          <View style={{ gap: 2 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontFamily: 'PixelifySans_600SemiBold', fontSize: 48, color: t.text }}>
                {formatKept(vm.todayCents)}
              </Text>
              <PixelIcon name="coin" size={36} />
            </View>
            <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 15, color: t.text }}>
              {vm.todayCaption}
            </Text>
            <View
              style={{
                marginTop: 8,
                paddingTop: 8,
                borderTopWidth: 2,
                borderStyle: 'dashed',
                borderColor: t.outline,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: t.text }}>
                this month
              </Text>
              <Text style={{ fontFamily: 'PixelifySans_600SemiBold', fontSize: 24, color: t.text }}>
                {formatKept(vm.monthCents)}
              </Text>
            </View>
          </View>
        </RetroWindow>

        <CloudCard fill={vm.questDone ? 'c4' : 'c2'} height={104} accessibilityLabel="daily quest">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 15,
                borderWidth: 2,
                borderColor: t.outline,
                backgroundColor: t.surface,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PixelIcon name={vm.questDone ? 'check' : 'note'} size={26} />
            </View>
            <View style={{ flex: 1, gap: 1 }}>
              <Text
                style={{
                  fontFamily: 'PixelifySans_500Medium',
                  fontSize: 12,
                  letterSpacing: 0.72,
                  color: t.text,
                }}
              >
                {vm.questDone ? 'QUEST DONE' : 'DAILY QUEST'}
              </Text>
              <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 16, color: t.text }}>
                {vm.questText}
              </Text>
              <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 13, color: t.text }}>
                {vm.questDone
                  ? '+1 star on ur calendar, forever'
                  : 'tiny + optional, no temptation needed'}
              </Text>
            </View>
            {vm.questDone ? (
              <View
                style={{
                  height: 36,
                  paddingHorizontal: 12,
                  borderRadius: 18,
                  borderWidth: 2,
                  borderColor: t.outline,
                  backgroundColor: t.surface,
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{ fontFamily: 'PixelifySans_600SemiBold', fontSize: 15, color: t.text }}
                >
                  +1
                </Text>
              </View>
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="go"
                onPress={() => {
                  if (vm.questId === 'peek_tally') router.push('/(tabs)/tally');
                  else if (vm.questId === 'log_loved')
                    router.push({ pathname: '/log', params: { kind: 'loved' } });
                  else router.push('/(tabs)/diary');
                }}
                style={{
                  height: 44,
                  paddingHorizontal: 18,
                  borderRadius: 22,
                  borderWidth: 2,
                  borderColor: t.outline,
                  backgroundColor: t.btn,
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 15, color: t.btnText }}>
                  go
                </Text>
              </Pressable>
            )}
          </View>
        </CloudCard>

        {vm.hasGoal ? (
          <CloudCard fill="c3" height={110} accessibilityLabel="goal">
            <View style={{ gap: 8 }}>
              <Text
                style={{
                  fontFamily: 'PixelifySans_500Medium',
                  fontSize: 12,
                  letterSpacing: 0.72,
                  color: t.text,
                }}
              >
                KEEPING MONEY FOR
              </Text>
              <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 16, color: t.text }}>
                {vm.goalLabel}
              </Text>
              <SegmentBar
                value={
                  vm.goalTargetCents > 0
                    ? Math.min(1, vm.goalProgressCents / vm.goalTargetCents)
                    : 0
                }
              />
              <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 14, color: t.text }}>
                {formatKept(vm.goalProgressCents)} of {formatKept(vm.goalTargetCents)}
              </Text>
            </View>
          </CloudCard>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="pick a goal"
            onPress={() => router.push('/(tabs)/collection')}
            style={{
              borderRadius: 20,
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: t.outline,
              backgroundColor: t.surface,
              padding: 16,
              gap: 4,
            }}
          >
            <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 16, color: t.text }}>
              {"i'm keeping money for ___"}
            </Text>
            <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 13, color: t.text }}>
              add one whenever u feel like it
            </Text>
            <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 14, color: t.btn }}>
              pick one
            </Text>
          </Pressable>
        )}

        <RetroWindow title="TODAY'S NVMS">
          {vm.todayItems.length === 0 ? (
            <EmptyState
              sticker="common-lil-cloud"
              title={
                vm.state === 'first_day'
                  ? 'ur first nvm lands here'
                  : 'no temptations today? iconic.'
              }
              body={
                vm.state === 'first_day'
                  ? 'tap + whenever something tempts u'
                  : 'ur month is still glowing ♡'
              }
            />
          ) : (
            <View style={{ gap: 8 }}>
              {vm.todayItems.map((item) => (
                <ListRow
                  key={item.id}
                  title={item.name}
                  meta={item.kind === 'loved' ? 'loved' : undefined}
                  amountCents={item.amountCents ?? undefined}
                  fill={item.kind === 'loved' ? 'c1' : 'c5'}
                />
              ))}
            </View>
          )}
        </RetroWindow>
      </ScrollView>
    </Screen>
  );
}
