import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  IconButton,
  PixelIcon,
  PillButton,
  RetroWindow,
  Screen,
  ScriptText,
  Segmented,
} from '@/components';
import type { RecapData, RecapKind, RecapPeriod } from '@/features/recap/buildRecap';
import { captureRecapCard, saveRecapToPhotos, shareRecap } from '@/features/recap/export';
import { RECAP_CARD_HEIGHT, RECAP_CARD_WIDTH, RecapCard } from '@/features/recap/RecapCard';
import { useTokens } from '@/theme';

export type RecapScreenProps = {
  data: RecapData;
  period: RecapPeriod;
  kind: RecapKind;
  onChangePeriod: (period: RecapPeriod) => void;
  onChangeKind: (kind: RecapKind) => void;
  onBack: () => void;
};

export function RecapScreen({
  data,
  period,
  kind,
  onChangePeriod,
  onChangeKind,
  onBack,
}: RecapScreenProps) {
  const t = useTokens();
  const { height } = useWindowDimensions();
  const compact = height < 740;
  const previewScale = compact ? 146 / RECAP_CARD_WIDTH : 216 / RECAP_CARD_WIDTH;
  const previewW = Math.round(RECAP_CARD_WIDTH * previewScale);
  const previewH = Math.round(RECAP_CARD_HEIGHT * previewScale);
  // RN 0.88 View ref typing is awkward with view-shot — keep untyped.
  const cardRef = useRef(null);
  const [busy, setBusy] = useState<'save' | 'share' | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const previewTracks = data.tracks.slice(0, compact ? 2 : 3);
  const more = Math.max(0, data.tracks.length + data.moreCount - previewTracks.length);

  const runExport = async (mode: 'save' | 'share') => {
    setBusy(mode);
    setMessage(null);
    try {
      const uri = await captureRecapCard(cardRef);
      if (mode === 'save') {
        await saveRecapToPhotos(uri);
        setMessage('saved to Photos ♡');
      } else {
        await shareRecap(uri);
      }
    } catch (err) {
      const text = err instanceof Error ? err.message : 'could not export just now';
      setMessage(text);
    } finally {
      setBusy(null);
    }
  };

  return (
    <Screen accessibilityLabel="Recap">
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconButton
            accessibilityLabel="Back"
            icon={<PixelIcon name="back" size={22} />}
            onPress={onBack}
          />
          <ScriptText size={compact ? 26 : 30}>Recap</ScriptText>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Segmented
              value={period}
              onChange={onChangePeriod}
              options={[
                { label: 'week', value: 'week' },
                { label: 'month', value: 'month' },
              ]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Segmented
              value={kind}
              onChange={onChangeKind}
              options={[
                { label: 'wanted', value: 'wanted' },
                { label: 'loved', value: 'loved' },
              ]}
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ gap: 12, paddingBottom: 28, alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ alignItems: 'center', gap: 6 }}>
            <View
              style={{
                width: previewW,
                height: previewH,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: t.outline,
                overflow: 'hidden',
                backgroundColor: t.surface,
                shadowColor: t.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 0,
              }}
            >
              <View
                style={{
                  width: RECAP_CARD_WIDTH,
                  height: RECAP_CARD_HEIGHT,
                  transform: [{ scale: previewScale }],
                  transformOrigin: 'top left',
                }}
              >
                <RecapCard data={data} />
              </View>
            </View>
            <Text
              style={{
                paddingHorizontal: 10,
                paddingVertical: 2,
                borderRadius: 999,
                borderWidth: 2,
                borderColor: t.outline,
                backgroundColor: t.surface,
                fontFamily: 'PixelifySans_500Medium',
                fontSize: 12,
                letterSpacing: 0.6,
                color: t.text,
                overflow: 'hidden',
              }}
            >
              9:16
            </Text>
          </View>

          <View style={{ width: '100%' }}>
            <RetroWindow title="TRACK LIST" titleBar="pink" right={data.totalChip}>
              {previewTracks.map((tr) => (
                <View
                  key={tr.n}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    gap: 10,
                    paddingVertical: 4,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'PixelifySans_600SemiBold',
                      fontSize: 14,
                      color: t.text,
                      width: 28,
                    }}
                  >
                    {tr.n}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      flex: 1,
                      fontFamily: 'Nunito_800ExtraBold',
                      fontSize: 15,
                      color: t.text,
                    }}
                  >
                    {tr.name}
                  </Text>
                  <Text
                    style={{ fontFamily: 'PixelifySans_600SemiBold', fontSize: 14, color: t.text }}
                  >
                    {tr.right}
                  </Text>
                </View>
              ))}
              {more > 0 ? (
                <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: t.text }}>
                  + {more} more
                </Text>
              ) : null}
              {data.empty ? (
                <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 13, color: t.text }}>
                  nothing to list yet ♡
                </Text>
              ) : null}
            </RetroWindow>
          </View>

          <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
            <View style={{ flex: 1 }}>
              <PillButton
                label={busy === 'save' ? 'saving…' : 'save'}
                disabled={!!busy}
                onPress={() => {
                  void runExport('save');
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PillButton
                label={busy === 'share' ? 'sharing…' : 'share'}
                variant="secondary"
                disabled={!!busy}
                onPress={() => {
                  void runExport('share');
                }}
              />
            </View>
          </View>
          {busy ? <ActivityIndicator color={t.btn} /> : null}
          {message ? (
            <Pressable accessibilityRole="button" onPress={() => setMessage(null)}>
              <Text
                style={{
                  fontFamily: 'Nunito_700Bold',
                  fontSize: 13,
                  color: t.text,
                  textAlign: 'center',
                }}
              >
                {message}
              </Text>
            </Pressable>
          ) : null}
        </ScrollView>
      </View>

      {/* Off-screen full card for capture */}
      <View
        pointerEvents="none"
        style={{ position: 'absolute', left: -RECAP_CARD_WIDTH * 2, top: 0 }}
      >
        <View ref={cardRef as never} collapsable={false}>
          <RecapCard data={data} />
        </View>
      </View>
    </Screen>
  );
}
