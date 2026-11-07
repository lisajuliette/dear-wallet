import '../global.css';

import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { db } from '@/db/client';
import { LockScreen, useAppLock } from '@/features/lock';
import { hydratePrefs } from '@/features/settings/hydratePrefs';
import { ThemeProvider, useAppFonts } from '@/theme';

import migrations from '../drizzle/migrations';

SplashScreen.preventAutoHideAsync();

function AppShell() {
  const { locked, unlock } = useAppLock();
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="log"
          options={{ presentation: 'transparentModal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="reward"
          options={{ presentation: 'transparentModal', animation: 'fade' }}
        />
        <Stack.Screen name="item/[id]" />
        <Stack.Screen name="loved" />
        <Stack.Screen name="recap" />
        <Stack.Screen name="diary/entry/[id]" />
        <Stack.Screen name="diary/decorate/[id]" />
        <Stack.Screen
          name="milestone/[id]"
          options={{ presentation: 'transparentModal', animation: 'fade' }}
        />
        <Stack.Screen name="goal" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="dev/theme" options={{ headerShown: true, title: 'Theme' }} />
        <Stack.Screen name="dev/components" options={{ headerShown: true, title: 'Components' }} />
      </Stack>
      {locked ? <LockScreen onUnlocked={unlock} /> : null}
    </>
  );
}

export default function RootLayout() {
  const fontsLoaded = useAppFonts();
  const { success: migrationsOk, error: migrationError } = useMigrations(db, migrations);
  const [prefsReady, setPrefsReady] = useState(false);

  useEffect(() => {
    if (!migrationsOk) return;
    void hydratePrefs(db)
      .catch(() => undefined)
      .finally(() => setPrefsReady(true));
  }, [migrationsOk]);

  useEffect(() => {
    if (fontsLoaded && migrationsOk && prefsReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, migrationsOk, prefsReady]);

  if (migrationError) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text>Migration error: {migrationError.message}</Text>
      </View>
    );
  }

  if (!fontsLoaded || !migrationsOk || !prefsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
