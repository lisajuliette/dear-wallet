import * as AppleAuthentication from 'expo-apple-authentication';
import { useState } from 'react';
import { Platform, Pressable, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { IconButton, PixelIcon, PillButton, RetroWindow, Screen, ScriptText } from '@/components';
import {
  requestPasswordReset,
  signInWithApple,
  signInWithEmail,
  signUpWithEmail,
} from '@/features/sync/authActions';
import { useTokens } from '@/theme';

type SignInScreenProps = {
  onBack: () => void;
  onSignedIn: () => void;
};

export function SignInScreen({ onBack, onSignedIn }: SignInScreenProps) {
  const t = useTokens();
  const { height } = useWindowDimensions();
  const compact = height < 740;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    const result =
      mode === 'signin'
        ? await signInWithEmail(email.trim(), password)
        : await signUpWithEmail(email.trim(), password);
    setLoading(false);
    if (result.error) {
      setError(
        result.error.includes('Invalid')
          ? "hmm, that password didn't match. try again, or reset it below. nothing's lost ♡"
          : result.error,
      );
      return;
    }
    onSignedIn();
  };

  const forgot = async () => {
    if (!email.trim()) {
      setError('add ur email first');
      return;
    }
    setLoading(true);
    const result = await requestPasswordReset(email.trim());
    setLoading(false);
    if (result.error) setError(result.error);
    else setError(null);
  };

  return (
    <Screen accessibilityLabel="Sign in">
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconButton
            accessibilityLabel="Back"
            icon={<PixelIcon name="back" size={22} />}
            onPress={onBack}
          />
          <ScriptText size={compact ? 26 : 30}>Dear Wallet</ScriptText>
        </View>

        {!compact ? (
          <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 14, color: t.text }}>
            back up ur tally + diary, and pick up on any phone
          </Text>
        ) : null}

        <RetroWindow title="SIGN_IN.EXE" titleBar="mint">
          <View style={{ gap: 10, paddingVertical: 6, opacity: loading ? 0.6 : 1 }}>
            {Platform.OS === 'ios' ? (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={16}
                style={{ width: '100%', height: 44 }}
                onPress={() => {
                  void (async () => {
                    setLoading(true);
                    setError(null);
                    const result = await signInWithApple();
                    setLoading(false);
                    if (result.error) setError(result.error);
                    else onSignedIn();
                  })();
                }}
              />
            ) : null}

            <Text
              style={{
                fontFamily: 'PixelifySans_500Medium',
                fontSize: 12,
                letterSpacing: 0.6,
                color: t.text,
                textAlign: 'center',
              }}
            >
              OR
            </Text>

            <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 12, color: t.text }}>
              EMAIL
            </Text>
            <TextInput
              accessibilityLabel="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
              value={email}
              onChangeText={setEmail}
              style={{
                height: 44,
                borderRadius: 14,
                borderWidth: 2,
                borderColor: error ? t.c1 : t.outline,
                backgroundColor: t.surface,
                paddingHorizontal: 12,
                fontFamily: 'Nunito_700Bold',
                color: t.text,
              }}
            />

            <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 12, color: t.text }}>
              PASSWORD
            </Text>
            <TextInput
              accessibilityLabel="Password"
              secureTextEntry
              editable={!loading}
              value={password}
              onChangeText={setPassword}
              style={{
                height: 44,
                borderRadius: 14,
                borderWidth: error ? 3 : 2,
                borderColor: error ? t.c1 : t.outline,
                backgroundColor: t.surface,
                paddingHorizontal: 12,
                fontFamily: 'Nunito_700Bold',
                color: t.text,
              }}
            />

            {error ? (
              <View
                style={{
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: t.outline,
                  backgroundColor: t.c1,
                  padding: 10,
                }}
              >
                <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: t.text }}>
                  ! {error}
                </Text>
              </View>
            ) : null}

            <PillButton
              label={
                loading
                  ? 'signing u in'
                  : error
                    ? 'try again'
                    : mode === 'signin'
                      ? 'sign in'
                      : 'make an account'
              }
              disabled={loading || !email || !password}
              onPress={() => {
                void submit();
              }}
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Forgot password"
              onPress={() => {
                void forgot();
              }}
              style={{ minHeight: 44, justifyContent: 'center' }}
            >
              <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 13, color: t.text }}>
                forgot password?
              </Text>
            </Pressable>
          </View>
        </RetroWindow>

        {!compact ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={mode === 'signin' ? 'make an account' : 'sign in instead'}
            onPress={() => setMode((m) => (m === 'signin' ? 'signup' : 'signin'))}
            style={{ minHeight: 44, justifyContent: 'center' }}
          >
            <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: t.text }}>
              {mode === 'signin' ? 'new here? make an account' : 'already have one? sign in'}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </Screen>
  );
}
