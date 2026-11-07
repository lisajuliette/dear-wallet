import { type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { CheckerBar, HardShadow, PixelIcon, Sticker } from '@/components';
import type { DayCardModel } from '@/features/diary/dayCardModel';
import { hitSlopForSize } from '@/lib/hitSlop';
import { useTokens } from '@/theme';

/** Lined page colours are fixed in the diary canvas, separate from the palette. */
const PAPER = '#FFFFFF';
const PAPER_INK = '#2E2F73';
const PAPER_MARGIN = '#F48FC4';
const PAPER_RULE = 'rgba(74, 114, 168, 0.22)';

const MOOD_STICKER = {
  proud: 'mood-proud',
  chill: 'mood-chill',
  meh: 'mood-meh',
  tempted: 'mood-tempted',
  wobbly: 'mood-wobbly',
} as const;

type DayCardProps = {
  day: DayCardModel;
  onOpenItem: (id: string) => void;
  onOpenPage: () => void;
};

function StarChip() {
  const t = useTokens();
  return (
    <View
      style={{
        height: 26,
        paddingLeft: 5,
        paddingRight: 8,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: t.outline,
        backgroundColor: t.surface,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
      }}
    >
      <Svg width={13} height={13} viewBox="0 0 24 24">
        <Path
          d="M12 1C12.9 7.6 16.4 11.1 23 12C16.4 12.9 12.9 16.4 12 23C11.1 16.4 7.6 12.9 1 12C7.6 11.1 11.1 7.6 12 1Z"
          fill={t.c3}
          stroke={t.outline}
          strokeWidth={2.4}
        />
      </Svg>
      <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 11, color: t.text }}>+1 star</Text>
    </View>
  );
}

function Pencil({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 14 14" fill="none">
      <Path
        d="M2.5 11.5l.6-2.6 6.6-6.6 2 2-6.6 6.6z"
        stroke={color}
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
      <Path d="M8.5 3.5l2 2" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

function Heart({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20.2s-6.6-4.1-8.8-7.8C1.6 9.4 3.1 6 6.6 6c2 0 3.2 1.2 3.9 2.2C11.2 7.2 12.4 6 14.4 6c3.5 0 5 3.4 3.4 6.4-2.2 3.7-5.8 7.8-5.8 7.8z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function PageButton({
  label,
  primary,
  onPress,
}: {
  label: string;
  primary: boolean;
  onPress: () => void;
}) {
  const t = useTokens();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}>
      <View style={{ marginBottom: primary ? 3 : 0 }}>
        {primary ? (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 3,
              bottom: -3,
              borderRadius: 25,
              backgroundColor: t.shadow,
            }}
          />
        ) : null}
        <View
          style={{
            height: primary ? 50 : 46,
            borderRadius: primary ? 25 : 23,
            borderWidth: 2,
            borderColor: t.outline,
            backgroundColor: primary ? t.btn : t.surface,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 8,
          }}
        >
          {primary ? <Pencil color={t.btnText} /> : null}
          <Text
            style={{
              fontFamily: 'Nunito_900Black',
              fontSize: primary ? 16 : 15,
              color: primary ? t.btnText : t.text,
            }}
          >
            {label}
          </Text>
          {primary ? <Heart color={t.btnText} /> : null}
        </View>
      </View>
    </Pressable>
  );
}

export function DayCard({ day, onOpenItem, onOpenPage }: DayCardProps) {
  const t = useTokens();
  const primary = day.cta.kind === 'primary';

  return (
    <HardShadow accessibilityLabel={day.aria}>
      <View
        style={{
          borderRadius: 20,
          borderWidth: 2,
          borderColor: t.outline,
          backgroundColor: t.surface,
        }}
      >
        <View style={{ borderRadius: 18, overflow: 'hidden' }}>
          <View
            style={{
              height: 40,
              borderBottomWidth: 2,
              borderColor: t.outline,
              justifyContent: 'center',
            }}
          >
            <CheckerBar a={t.c4} b={t.c5} patternId="diary-day" height={40} />
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8 }}
            >
              <View
                style={{
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
                  {day.label}
                </Text>
              </View>
              {day.isToday ? (
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 1,
                    borderRadius: 999,
                    borderWidth: 2,
                    borderColor: t.outline,
                    backgroundColor: t.c3,
                  }}
                >
                  <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 11, color: t.text }}>
                    today
                  </Text>
                </View>
              ) : null}
              <View style={{ flex: 1 }} />
              {day.showStarChip ? <StarChip /> : null}
            </View>
          </View>

          <View style={{ padding: 12, gap: 10 }}>
            {day.keptTotal && day.countLabel ? (
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
                <Text
                  style={{
                    fontFamily: 'PixelifySans_600SemiBold',
                    fontSize: 30,
                    lineHeight: 32,
                    color: t.text,
                  }}
                >
                  {day.keptTotal}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Nunito_900Black',
                    fontSize: 13,
                    color: t.text,
                    paddingBottom: 3,
                  }}
                >
                  kept
                </Text>
                <View style={{ flex: 1 }} />
                <View
                  style={{
                    paddingHorizontal: 9,
                    paddingVertical: 2,
                    borderRadius: 999,
                    borderWidth: 2,
                    borderColor: t.outline,
                    backgroundColor: t.c1,
                  }}
                >
                  <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 12, color: t.text }}>
                    {day.countLabel}
                  </Text>
                </View>
              </View>
            ) : null}

            {day.quiet ? (
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 }}
              >
                <Sticker id="mood-chill" size={40} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 15, color: t.text }}>
                    {day.quiet.title}
                  </Text>
                  <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 13, color: t.soft }}>
                    {day.quiet.sub}
                  </Text>
                </View>
              </View>
            ) : null}

            {primary ? <PageButton label={day.cta.label} primary onPress={onOpenPage} /> : null}

            {day.rows.length > 0 ? (
              <View style={{ borderRadius: 14, borderWidth: 2, borderColor: t.ring }}>
                <View style={{ borderRadius: 12, overflow: 'hidden' }}>
                  {day.rows.map((row, index) => (
                    <Pressable
                      key={row.id}
                      accessibilityRole="button"
                      accessibilityLabel={`${row.name}, ${row.subtitle}, ${row.amount}`}
                      onPress={() => onOpenItem(row.id)}
                      style={{
                        minHeight: 48,
                        paddingVertical: 4,
                        paddingLeft: 6,
                        paddingRight: 10,
                        borderTopWidth: index === 0 ? 0 : 2,
                        borderStyle: 'dashed',
                        borderColor: t.ring,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <Sticker id={row.sticker} size={32} />
                      <View style={{ flex: 1 }}>
                        <Text
                          numberOfLines={1}
                          style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: t.text }}
                        >
                          {row.name}
                        </Text>
                        <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 11, color: t.soft }}>
                          {row.subtitle}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontFamily: 'PixelifySans_600SemiBold',
                          fontSize: 14,
                          color: t.text,
                        }}
                      >
                        {row.amount}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}

            {day.page ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Open the page for ${day.aria}`}
                onPress={onOpenPage}
              >
                <View
                  style={{
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: t.outline,
                    backgroundColor: PAPER,
                  }}
                >
                  <View
                    style={{
                      borderRadius: 12,
                      overflow: 'hidden',
                      paddingTop: 8,
                      paddingBottom: 10,
                      paddingLeft: 34,
                      paddingRight: 12,
                    }}
                  >
                    <View
                      pointerEvents="none"
                      style={{ position: 'absolute', left: 34, right: 12, top: 8 }}
                    >
                      {[0, 1, 2, 3].map((line) => (
                        <View
                          key={line}
                          style={{
                            marginTop: 21,
                            height: 1,
                            backgroundColor: PAPER_RULE,
                          }}
                        />
                      ))}
                    </View>
                    <View
                      pointerEvents="none"
                      style={{
                        position: 'absolute',
                        left: 22,
                        top: 0,
                        bottom: 0,
                        width: 2,
                        backgroundColor: PAPER_MARGIN,
                      }}
                    />
                    {day.page.mood ? (
                      <View style={{ position: 'absolute', right: 8, top: 6 }}>
                        <Sticker id={MOOD_STICKER[day.page.mood]} size={34} />
                      </View>
                    ) : null}
                    <Text
                      style={{
                        fontFamily: 'Pacifico_400Regular',
                        fontSize: 15,
                        lineHeight: 22,
                        color: PAPER_INK,
                      }}
                    >
                      Dear Wallet,
                    </Text>
                    <Text
                      numberOfLines={3}
                      style={{
                        paddingRight: 36,
                        fontFamily: 'Nunito_700Bold',
                        fontSize: 13,
                        lineHeight: 22,
                        color: PAPER_INK,
                      }}
                    >
                      {day.page.line}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ) : null}

            {primary ? null : (
              <PageButton label={day.cta.label} primary={false} onPress={onOpenPage} />
            )}
          </View>
        </View>
      </View>
    </HardShadow>
  );
}

export function MonthArrow({
  label,
  direction,
  disabled,
  onPress,
}: {
  label: string;
  direction: 'back' | 'forward';
  disabled: boolean;
  onPress: () => void;
}) {
  const t = useTokens();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={hitSlopForSize(36, 36)}
      onPress={onPress}
      style={{ opacity: disabled ? 0.4 : 1 }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          borderWidth: 2,
          borderStyle: disabled ? 'dashed' : 'solid',
          borderColor: t.outline,
          backgroundColor: t.surface,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <PixelIcon name={direction} size={16} />
      </View>
    </Pressable>
  );
}

export function TodayChip({ onPress }: { onPress: () => void }) {
  const t = useTokens();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back to today"
      hitSlop={hitSlopForSize(64, 28)}
      onPress={onPress}
    >
      <View
        style={{
          height: 28,
          paddingHorizontal: 10,
          borderRadius: 999,
          borderWidth: 2,
          borderColor: t.outline,
          backgroundColor: t.c3,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontFamily: 'Nunito_900Black', fontSize: 12, color: t.text }}>today</Text>
      </View>
    </Pressable>
  );
}

export function windowTitle(
  title: string,
  text: string,
  outline: string,
  surface: string,
): ReactNode {
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 1,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: outline,
        backgroundColor: surface,
      }}
    >
      <Text
        style={{
          fontFamily: 'PixelifySans_500Medium',
          fontSize: 13,
          letterSpacing: 0.78,
          color: text,
        }}
      >
        {title}
      </Text>
    </View>
  );
}
