import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

import { useAuthStore } from '@/features/sync/authStore';
import { supabase, supabaseConfigured } from '@/features/sync/supabase';

function applyUser(
  user: {
    id: string;
    is_anonymous?: boolean | null;
    email?: string | null;
  } | null,
) {
  if (!user) return;
  useAuthStore.getState().setSession({
    userId: user.id,
    isAnonymous: !!user.is_anonymous,
    email: user.email ?? null,
  });
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<{ error: string | null }> {
  if (!supabaseConfigured) return { error: 'supabase is not configured' };

  // Prefer linking to the current anonymous user so local data stays on the same id.
  const session = await supabase.auth.getSession();
  if (session.data.session?.user?.is_anonymous) {
    const { data, error } = await supabase.auth.updateUser({ email, password });
    if (!error && data.user) {
      applyUser(data.user);
      return { error: null };
    }
    // Fall through to normal sign-in if updateUser is unavailable for anon.
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  applyUser(data.user);
  return { error: null };
}

export async function signUpWithEmail(
  email: string,
  password: string,
): Promise<{ error: string | null }> {
  if (!supabaseConfigured) return { error: 'supabase is not configured' };
  const session = await supabase.auth.getSession();
  if (session.data.session?.user?.is_anonymous) {
    const { data, error } = await supabase.auth.updateUser({ email, password });
    if (error) return { error: error.message };
    applyUser(data.user);
    return { error: null };
  }
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: error.message };
  applyUser(data.user);
  return { error: null };
}

export async function requestPasswordReset(email: string): Promise<{ error: string | null }> {
  if (!supabaseConfigured) return { error: 'supabase is not configured' };
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  return { error: error?.message ?? null };
}

export async function signInWithApple(): Promise<{ error: string | null }> {
  if (!supabaseConfigured) return { error: 'supabase is not configured' };
  if (Platform.OS !== 'ios') return { error: 'Sign in with Apple is on iPhone only' };

  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    if (!credential.identityToken) {
      return { error: 'Apple did not return a token' };
    }
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
    });
    if (error) return { error: error.message };
    applyUser(data.user);
    return { error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Apple sign-in cancelled';
    if (String(message).includes('ERR_REQUEST_CANCELED')) return { error: null };
    return { error: message };
  }
}

export async function signOut(): Promise<void> {
  if (!supabaseConfigured) return;
  await supabase.auth.signOut();
}
