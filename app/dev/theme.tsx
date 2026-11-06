import { Redirect } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useThemeStore } from '@/theme';
import { palettes, tokens, type PaletteKey, type TokenName } from '@/theme/theme';

const TOKEN_ORDER: TokenName[] = [
  'bg1',
  'bg2',
  'c1',
  'c2',
  'c3',
  'c4',
  'c5',
  'surface',
  'outline',
  'text',
  'btn',
  'btnText',
];

const PALETTE_KEYS = Object.keys(palettes) as PaletteKey[];

export default function DevThemeScreen() {
  const palette = useThemeStore((state) => state.palette);
  const setPalette = useThemeStore((state) => state.setPalette);
  const t = tokens(palette);

  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  return (
    <ScrollView className="flex-1 bg-bg1" contentContainerClassName="gap-6 px-gutter py-6">
      <View className="gap-2">
        <Text className="font-script text-3xl text-ink">theme lab</Text>
        <Text className="font-sans text-base text-ink">
          switch palettes and check token swatches + type
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-2">
        {PALETTE_KEYS.map((key) => {
          const selected = key === palette;
          return (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityLabel={`Use ${palettes[key].name}`}
              accessibilityState={{ selected }}
              onPress={() => setPalette(key)}
              className={`min-h-tap items-center justify-center rounded-key border-2 px-3 ${
                selected ? 'border-outline bg-btn' : 'border-outline/30 bg-surface'
              }`}
              style={{ minWidth: 44 }}
            >
              <Text
                className={`font-sans-semibold text-sm ${selected ? 'text-btn-text' : 'text-ink'}`}
              >
                {palettes[key].name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="gap-3 rounded-card border-2 border-outline bg-surface p-4">
        <Text className="font-pixel-semibold text-sm uppercase tracking-tag text-ink">
          swatches
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {TOKEN_ORDER.map((name) => (
            <View key={name} className="w-20 items-center gap-1">
              <View
                className="h-12 w-12 rounded-key border-2 border-outline"
                style={{ backgroundColor: t[name] }}
              />
              <Text className="font-sans text-xs text-ink">{name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="gap-3 rounded-card border-2 border-outline bg-surface p-4">
        <Text className="font-pixel-semibold text-sm uppercase tracking-tag text-ink">type</Text>
        <Text className="font-script text-3xl text-ink">Pacifico title</Text>
        <Text className="font-sans-semibold text-base text-ink">Nunito 600 body</Text>
        <Text className="font-sans text-base text-ink">Nunito 700 body</Text>
        <Text className="font-sans-extrabold text-base text-ink">Nunito 800 emphasis</Text>
        <Text className="font-sans-black text-base text-ink">Nunito 900 heavy</Text>
        <Text className="font-pixel text-2xl text-ink">$42.00</Text>
        <Text className="font-pixel-semibold text-sm uppercase tracking-tag text-ink">
          kept tag
        </Text>
        <View className="mt-2 items-center rounded-key bg-btn px-4 py-3">
          <Text className="font-sans-black text-base text-btn-text">nvm!</Text>
        </View>
      </View>
    </ScrollView>
  );
}
