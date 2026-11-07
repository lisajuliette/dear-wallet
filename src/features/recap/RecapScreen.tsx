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
          <View style={{ flex: 1 }}>
            <ScriptText size={compact ? 26 : 30}>Recap</ScriptText>
          </View>
          <View
            style={{
              paddingHorizontal: 10,
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
                fontSize: 12,
                letterSpacing: 0.72,
                color: t.text,
              }}
            >
              {data.dateLabel}
            </Text>
          </View>
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
              selectedFill="c3"
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
              selectedFill="c3"
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ gap: 12, paddingBottom: 28, alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ alignItems: 'center', width: previewW, marginBottom: 10 }}>
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 6,
                bottom: -6,
                borderRadius: 16,
                backgroundColor: t.shadow,
              }}
            />
            <View
              style={{
                width: previewW,
                height: previewH,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: t.outline,
                overflow: 'hidden',
                backgroundColor: t.surface,
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
            <View
              style={{
                position: 'absolute',
                right: 8,
                bottom: -8,
                paddingHorizontal: 8,
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
                  fontSize: 11,
                  color: t.text,
                }}
              >
                9:16
              </Text>
            </View>
          </View>

          <View style={{ width: '100%' }}>
            <RetroWindow title={data.listTitle} titleBar="pink" right={data.totalChip}>
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
              {data.moreLine ? (
                <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: t.text }}>
                  {data.moreLine}
                </Text>
              ) : null}
              {data.empty ? (
                <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 13, color: t.text }}>
                  nothing to list yet ♡
                </Text>
              ) : null}
            </RetroWindow>
          </View>

          {message ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Dismiss message"
              onPress={() => setMessage(null)}
            >
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

        <View style={{ flexDirection: 'row', gap: 10, paddingBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <PillButton
              testID="recap-save"
              label={busy === 'save' ? 'saving…' : 'save'}
              variant="surface"
              size="lg"
              disabled={!!busy}
              icon={<PixelIcon name="download" size={18} />}
              onPress={() => {
                void runExport('save');
              }}
            />
          </View>
          <View style={{ flex: 1.3 }}>
            <PillButton
              label={busy === 'share' ? 'sharing…' : 'share'}
              size="lg"
              disabled={!!busy}
              icon={<PixelIcon name="share" size={18} color={t.btnText} />}
              onPress={() => {
                void runExport('share');
              }}
            />
          </View>
        </View>
        {busy ? <ActivityIndicator color={t.btn} /> : null}
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
