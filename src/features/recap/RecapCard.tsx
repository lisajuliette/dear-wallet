import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import type { RecapData } from '@/features/recap/buildRecap';
import { formatCents } from '@/lib/money';
import { HOLO, useTokens } from '@/theme';

/** Layout pt size that captures to 1080×1920 at pixelRatio 3. */
export const RECAP_CARD_WIDTH = 360;
export const RECAP_CARD_HEIGHT = 640;

/** Scale from 1080 canvas px → 360 pt. */
const S = 1 / 3;

type RecapCardProps = {
  data: RecapData;
};

function Star({ size, fill }: { size: number; fill: string }) {
  const t = useTokens();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 1C12.9 7.6 16.4 11.1 23 12C16.4 12.9 12.9 16.4 12 23C11.1 16.4 7.6 12.9 1 12C7.6 11.1 11.1 7.6 12 1Z"
        fill={fill}
        stroke={t.outline}
        strokeWidth={1.8}
      />
    </Svg>
  );
}

function TrackRow({ n, name, right }: { n: string; name: string; right: string }) {
  const t = useTokens();
  return (
    <View style={{ height: 46 * S, flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
      <Text
        style={{
          width: 22,
          fontFamily: 'PixelifySans_600SemiBold',
          fontSize: 12,
          color: t.text,
        }}
      >
        {n}
      </Text>
      <Text
        numberOfLines={1}
        style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 12, color: t.text, maxWidth: 140 }}
      >
        {name}
      </Text>
      <View
        style={{
          flex: 1,
          minWidth: 8,
          borderBottomWidth: 1.5,
          borderStyle: 'dotted',
          borderColor: t.ring,
          transform: [{ translateY: -4 }],
        }}
      />
      <Text
        style={{
          fontFamily: 'PixelifySans_600SemiBold',
          fontSize: 12,
          color: t.text,
        }}
      >
        {right}
      </Text>
    </View>
  );
}

function MonthCard({ data }: { data: RecapData }) {
  const t = useTokens();
  return (
    <>
      {/* Holo CD */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 360 * S,
          top: 450 * S,
          width: 640 * S,
          height: 640 * S,
          borderRadius: 999,
          borderWidth: 2,
          borderColor: t.outline,
          backgroundColor: HOLO[0],
          shadowColor: t.shadow,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 1,
          shadowRadius: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 244 * S,
            height: 244 * S,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: t.outline,
            backgroundColor: t.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 72 * S,
              height: 72 * S,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.bg1,
            }}
          />
        </View>
      </View>

      {/* Jewel case */}
      <View
        style={{
          position: 'absolute',
          left: 80 * S,
          top: 420 * S,
          width: 680 * S,
          height: 680 * S,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: t.outline,
          backgroundColor: t.surface,
          shadowColor: t.shadow,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 1,
          shadowRadius: 0,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            left: 82 * S,
            top: 26 * S,
            right: 26 * S,
            bottom: 26 * S,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: t.outline,
            backgroundColor: t.c1,
            padding: 10,
          }}
        >
          <Text style={{ fontFamily: 'Pacifico_400Regular', fontSize: 48, color: t.text }}>
            {data.coverMonthShort}
          </Text>
          <Text
            style={{
              marginTop: 4,
              alignSelf: 'flex-start',
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.surface,
              fontFamily: 'PixelifySans_500Medium',
              fontSize: 9,
              letterSpacing: 0.5,
              color: t.text,
              overflow: 'hidden',
            }}
          >
            {data.coverTag}
          </Text>
        </View>
      </View>

      {/* Track list */}
      <View
        style={{
          position: 'absolute',
          left: 80 * S,
          right: 80 * S,
          top: 1140 * S,
          borderRadius: 14,
          borderWidth: 2,
          borderColor: t.outline,
          backgroundColor: t.surface,
          shadowColor: t.shadow,
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 1,
          shadowRadius: 0,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: 32,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
            gap: 6,
            borderBottomWidth: 2,
            borderColor: t.outline,
            backgroundColor: t.c1,
          }}
        >
          <Text
            style={{
              paddingHorizontal: 8,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.surface,
              fontFamily: 'PixelifySans_500Medium',
              fontSize: 11,
              letterSpacing: 0.6,
              color: t.text,
              overflow: 'hidden',
            }}
          >
            {data.listTitle}
          </Text>
          <View style={{ flex: 1 }} />
          <Text
            style={{
              paddingHorizontal: 8,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: t.outline,
              backgroundColor: t.c3,
              fontFamily: 'PixelifySans_600SemiBold',
              fontSize: 11,
              color: t.text,
              overflow: 'hidden',
            }}
          >
            {data.totalChip}
          </Text>
        </View>
        <View style={{ paddingHorizontal: 12, paddingVertical: 8, gap: 1 }}>
          {data.tracks.map((tr) => (
            <TrackRow key={tr.n} {...tr} />
          ))}
          {data.moreLine ? (
            <Text
              style={{
                marginTop: 2,
                paddingLeft: 26,
                fontFamily: 'Nunito_800ExtraBold',
                fontSize: 11,
                color: t.text,
              }}
            >
              {data.moreLine}
            </Text>
          ) : null}
          {data.quiet ? (
            <View
              style={{
                marginTop: 8,
                alignItems: 'center',
                gap: 2,
                paddingTop: 8,
                borderTopWidth: 1.5,
                borderStyle: 'dashed',
                borderColor: t.ring,
              }}
            >
              <Text style={{ fontFamily: 'Pacifico_400Regular', fontSize: 18, color: t.text }}>
                a quiet month is still a hit
              </Text>
              <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 11, color: t.text }}>
                fewer temptations, same cute me ♡
              </Text>
            </View>
          ) : null}
          {data.empty ? (
            <Text
              style={{
                fontFamily: 'Nunito_700Bold',
                fontSize: 12,
                color: t.text,
                textAlign: 'center',
                paddingVertical: 12,
              }}
            >
              {"nothing here yet — and that's fine ♡"}
            </Text>
          ) : null}
        </View>
      </View>
    </>
  );
}

function WeekCard({ data }: { data: RecapData }) {
  const t = useTokens();
  const fills = [t.c1, t.c2, t.c3, t.c4, t.c5];
  const rows = data.tracks.slice(0, 4);
  const digits = formatCents(data.totalCents).split('');

  return (
    <>
      <View
        style={{
          position: 'absolute',
          left: 80 * S,
          right: 80 * S,
          top: 470 * S,
          borderRadius: 15,
          borderWidth: 2,
          borderColor: t.outline,
          backgroundColor: t.surface,
          shadowColor: t.shadow,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 1,
          shadowRadius: 0,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: 34,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
            gap: 8,
            borderBottomWidth: 2,
            borderColor: t.outline,
            backgroundColor: t.c4,
          }}
        >
          <Text
            style={{
              paddingHorizontal: 10,
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
            {data.weekLabel}
          </Text>
        </View>
        <View style={{ padding: 12, gap: 8 }}>
          {rows.map((r, i) => (
            <View
              key={r.n}
              style={{
                height: 42,
                borderRadius: 14,
                borderWidth: 2,
                borderColor: t.outline,
                backgroundColor: fills[i % fills.length],
                paddingHorizontal: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Star size={20} fill={t.surface} />
              <Text
                numberOfLines={1}
                style={{ flex: 1, fontFamily: 'Nunito_900Black', fontSize: 14, color: t.text }}
              >
                {r.name}
              </Text>
              <Text style={{ fontFamily: 'PixelifySans_600SemiBold', fontSize: 16, color: t.text }}>
                {r.right}
              </Text>
            </View>
          ))}
          {data.empty ? (
            <Text
              style={{
                fontFamily: 'Nunito_700Bold',
                fontSize: 13,
                color: t.text,
                textAlign: 'center',
              }}
            >
              a quiet week. still counts ♡
            </Text>
          ) : null}
        </View>
      </View>

      <View
        style={{
          position: 'absolute',
          left: 80 * S,
          right: 80 * S,
          top: 1480 * S,
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text
          style={{
            fontFamily: 'PixelifySans_500Medium',
            fontSize: 12,
            letterSpacing: 0.8,
            color: t.text,
          }}
        >
          {data.weekFootLabel}
        </Text>
        {data.kind === 'wanted' ? (
          <View
            style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            {digits.map((ch, i) => (
              <View
                key={`${ch}-${i}`}
                style={{
                  minWidth: ch === '.' || ch === ',' ? 18 : 28,
                  height: 48,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: t.outline,
                  backgroundColor: t.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: t.shadow,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 1,
                  shadowRadius: 0,
                  paddingHorizontal: 4,
                }}
              >
                <Text
                  style={{ fontFamily: 'PixelifySans_600SemiBold', fontSize: 22, color: t.text }}
                >
                  {ch}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Star size={36} fill={t.c1} />
            <Star size={36} fill={t.c3} />
            <Star size={36} fill={t.c5} />
          </View>
        )}
      </View>
    </>
  );
}

/** Full-size (360×640) recap card for preview + view-shot capture. */
export function RecapCard({ data }: RecapCardProps) {
  const t = useTokens();

  return (
    <View
      collapsable={false}
      style={{
        width: RECAP_CARD_WIDTH,
        height: RECAP_CARD_HEIGHT,
        overflow: 'hidden',
        backgroundColor: t.bg1,
      }}
      accessibilityLabel="Recap card"
    >
      <View
        style={{
          ...({ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } as const),
          backgroundColor: t.bg2,
          opacity: 0.55,
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: 80 * S,
          right: 80 * S,
          top: 80 * S,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontFamily: 'Pacifico_400Regular', fontSize: 18, color: t.text }}>
          Dear Wallet
        </Text>
        <Text
          style={{
            paddingHorizontal: 10,
            paddingVertical: 2,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: t.outline,
            backgroundColor: t.surface,
            fontFamily: 'PixelifySans_500Medium',
            fontSize: 11,
            letterSpacing: 0.6,
            color: t.text,
            overflow: 'hidden',
          }}
        >
          {data.dateLabel}
        </Text>
      </View>

      <Text
        style={{
          position: 'absolute',
          left: 80 * S,
          right: 80 * S,
          top: 196 * S,
          fontFamily: 'Pacifico_400Regular',
          fontSize: data.period === 'week' ? 28 : 32,
          color: t.text,
        }}
      >
        {data.title}
      </Text>

      {data.period === 'month' ? <MonthCard data={data} /> : <WeekCard data={data} />}

      <Text
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 24 * S,
          textAlign: 'center',
          fontFamily: 'PixelifySans_500Medium',
          fontSize: 11,
          letterSpacing: 0.6,
          color: t.text,
        }}
      >
        MADE WITH DEAR WALLET ♡
      </Text>
    </View>
  );
}
