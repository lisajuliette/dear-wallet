import '../global.css';

import NetInfo from '@react-native-community/netinfo';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { AppState, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { db } from '@/db/client';
import { LockScreen, useAppLock } from '@/features/lock';
import { hydratePrefs } from '@/features/settings/hydratePrefs';
import { ensureSession } from '@/features/sync/ensureSession';
import { runSync } from '@/features/sync/runSync';
import { ThemeProvider, useAppFonts } from '@/theme';

import migrations from '../drizzle/migrations';

SplashScreen.preventAutoHideAsync();

function AppShell() {
  const { locked, unlock } = useAppLock();

  useEffect(() => {
    void runSync(db);
    const interval = setInterval(() => {
      void runSync(db);
    }, 60_000);
    const appSub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void runSync(db);
    });
    const netSub = NetInfo.addEventListener((state) => {
      if (state.isConnected) void runSync(db);
    });
    return () => {
      clearInterval(interval);
      appSub.remove();
      netSub();
    };
  }, []);

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
        <Stack.Screen name="sign-in" options={{ presentation: 'modal' }} />
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
  const [bootReady, setBootReady] = useState(false);

  useEffect(() => {
    if (!migrationsOk) return;
    void (async () => {
      await ensureSession().catch(() => undefined);
      await hydratePrefs(db).catch(() => undefined);
      setBootReady(true);
    })();
  }, [migrationsOk]);

  useEffect(() => {
    if (fontsLoaded && migrationsOk && bootReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, migrationsOk, bootReady]);

  if (migrationError) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text>Migration error: {migrationError.message}</Text>
      </View>
    );
  }

  if (!fontsLoaded || !migrationsOk || !bootReady) {
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
