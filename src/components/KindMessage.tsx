import { type ReactNode } from 'react';
import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { CloudCard } from '@/components/CloudCard';
import { useTokens, type TokenName } from '@/theme';

type KindMessageProps = {
  children: ReactNode;
  fill?: Extract<TokenName, 'c2' | 'c4'>;
  accessibilityLabel?: string;
};

/** Soft encouragement in a cloud card with a sparkle. */
export function KindMessage({ children, fill = 'c4', accessibilityLabel }: KindMessageProps) {
  const t = useTokens();

  return (
    <CloudCard fill={fill} height={88} accessibilityLabel={accessibilityLabel ?? 'kind message'}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Svg width={26} height={26} viewBox="0 0 24 24" accessibilityElementsHidden>
          <Path
            d="M12 1C12.9 7.6 16.4 11.1 23 12C16.4 12.9 12.9 16.4 12 23C11.1 16.4 7.6 12.9 1 12C7.6 11.1 11.1 7.6 12 1Z"
            fill={t.surface}
            stroke={t.outline}
            strokeWidth={2}
          />
        </Svg>
        <Text
          style={{
            flex: 1,
            fontFamily: 'Nunito_900Black',
            fontSize: 15,
            color: t.text,
            lineHeight: 20,
          }}
        >
          {children}
        </Text>
      </View>
    </CloudCard>
  );
}
