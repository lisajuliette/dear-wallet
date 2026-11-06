import { type ReactNode } from 'react';
import { Text, View } from 'react-native';
import Svg, { Defs, Pattern, Path, Rect } from 'react-native-svg';

import { HardShadow } from '@/components/HardShadow';
import { HOLO, useTokens } from '@/theme';

type TitleBar = 'pink' | 'mint' | 'butter' | 'holo';

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
      <View className="overflow-hidden rounded-window border-2 border-outline bg-surface">
        <View className="h-titlebar flex-row items-center gap-2 border-b-2 border-outline px-2">
          <View className="absolute inset-0">
            <Svg width="100%" height="100%">
              <Defs>
                <Pattern
                  id={`checker-${titleBar}`}
                  width={12}
                  height={12}
                  patternUnits="userSpaceOnUse"
                >
                  <Rect width={6} height={6} fill={a} />
                  <Rect x={6} y={6} width={6} height={6} fill={a} />
                  <Rect x={6} width={6} height={6} fill={b} />
                  <Rect y={6} width={6} height={6} fill={b} />
                </Pattern>
              </Defs>
              <Rect width="100%" height="100%" fill={`url(#checker-${titleBar})`} />
            </Svg>
          </View>
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
            <Text className="font-pixel text-[13px] uppercase tracking-tag text-ink">{title}</Text>
          </View>
          <View className="z-10 flex-1" />
          {right ? <View className="z-10">{right}</View> : null}
        </View>
        <View className="px-4 py-3.5">{children}</View>
      </View>
    </HardShadow>
  );
}
