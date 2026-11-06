import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';
import { Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import { PixelifySans_500Medium, PixelifySans_600SemiBold } from '@expo-google-fonts/pixelify-sans';
import { useFonts } from 'expo-font';

export const fontMap = {
  Pacifico_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
  PixelifySans_500Medium,
  PixelifySans_600SemiBold,
};

/** Loads Dear Wallet fonts. Keep the splash visible until this returns true. */
export function useAppFonts(): boolean {
  const [loaded] = useFonts(fontMap);
  return loaded;
}
