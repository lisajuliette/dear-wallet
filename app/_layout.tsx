import '../global.css';

import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { db } from '@/db/client';
import { ThemeProvider, useAppFonts } from '@/theme';

import migrations from '../drizzle/migrations';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const fontsLoaded = useAppFonts();
  const { success: migrationsOk, error: migrationError } = useMigrations(db, migrations);

  useEffect(() => {
    if (fontsLoaded && migrationsOk) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, migrationsOk]);

  if (migrationError) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text>Migration error: {migrationError.message}</Text>
      </View>
    );
  }

  if (!fontsLoaded || !migrationsOk) {
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
