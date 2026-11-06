import '../global.css';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { ThemeProvider, useAppFonts } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="dev/theme" options={{ headerShown: true, title: 'Theme' }} />
        <Stack.Screen name="dev/components" options={{ headerShown: true, title: 'Components' }} />
      </Stack>
    </ThemeProvider>
  );
}
