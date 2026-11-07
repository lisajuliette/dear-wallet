import { type ReactNode } from 'react';
import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { CheckerBar } from '@/components/CheckerBar';
import { HardShadow } from '@/components/HardShadow';
import { HOLO, useTokens } from '@/theme';

type TitleBar = 'pink' | 'mint' | 'butter' | 'lilac' | 'sky' | 'holo';

type RetroWindowProps = {
  title: string;
  titleBar?: TitleBar;
  right?: ReactNode;
  children: ReactNode;
  accessibilityLabel?: string;
};

function checkerPair(titleBar: TitleBar, t: ReturnType<typeof useTokens>): [string, string] {
  switch (titleBar) {
    case 'mint':
      return [t.c4, t.c5];
    case 'butter':
      return [t.c3, t.c1];
    case 'lilac':
      return [t.c2, t.c5];
    case 'sky':
      return [t.c5, t.c4];
    case 'holo':
      return [HOLO[0] ?? t.c1, HOLO[2] ?? t.c2];
    case 'pink':
    default:
      return [t.c1, t.c2];
  }
}

/** Retro window with checker title bar, heart badge and hard shadow. */
export function RetroWindow({
  title,
  titleBar = 'pink',
  right,
  children,
  accessibilityLabel,
}: RetroWindowProps) {
  const t = useTokens();
  const [a, b] = checkerPair(titleBar, t);
  const label = accessibilityLabel ?? title;

  return (
    <HardShadow radius={20} accessibilityLabel={label}>
      <View style={{ backgroundColor: t.outline, borderRadius: 20, padding: 2 }}>
        <View style={{ backgroundColor: t.surface, borderRadius: 18, overflow: 'hidden' }}>
          <View className="h-titlebar flex-row items-center gap-2 overflow-hidden border-b-2 border-outline px-2">
            <CheckerBar a={a} b={b} patternId={`checker-${titleBar}`} height={36} />
            <View className="z-10 h-6 w-6 items-center justify-center rounded-[7px] border-2 border-outline bg-surface">
              <Svg width={14} height={14} viewBox="0 0 14 14" accessibilityRole="image">
                <Path
                  d="M3.5 2.5h2v1h1v1h1v-1h1v-1h2v1h1v3h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-3h1z"
                  fill={t.c1}
                  stroke={t.outline}
                  strokeWidth={1}
                />
              </Svg>
            </View>
            <View className="z-10 rounded-full border-2 border-outline bg-surface px-2.5 py-0.5">
              <Text className="font-pixel text-[13px] uppercase tracking-tag text-ink">
                {title}
              </Text>
            </View>
            <View className="z-10 flex-1" />
            {typeof right === 'string' || typeof right === 'number' ? (
              <View className="z-10 rounded-full border-2 border-outline bg-surface px-2 py-0.5">
                <Text
                  style={{ fontFamily: 'PixelifySans_600SemiBold', fontSize: 13, color: t.text }}
                >
                  {right}
                </Text>
              </View>
            ) : right ? (
              <View className="z-10">{right}</View>
            ) : null}
          </View>
          <View className="px-4 py-3.5">{children}</View>
        </View>
      </View>
    </HardShadow>
  );
}
