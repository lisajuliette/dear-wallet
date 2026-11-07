import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ScriptText } from '@/components';
import { checkPasscode } from '@/features/lock/passcodeStore';
import { useTokens } from '@/theme';

type LockScreenProps = {
  onUnlocked: () => void;
};

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'face', '0', 'del'] as const;

/** Face ID first, then six-digit passcode keypad. */
export function LockScreen({ onUnlocked }: LockScreenProps) {
  const t = useTokens();
  const [mode, setMode] = useState<'face' | 'passcode'>('face');
  const [digits, setDigits] = useState('');
  const [hint, setHint] = useState('looking for u…');

  useEffect(() => {
    if (mode !== 'face') return;
    let cancelled = false;
    void (async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !enrolled) {
        if (!cancelled) setMode('passcode');
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'ur diary is locked ♡',
        fallbackLabel: 'use passcode instead',
        disableDeviceFallback: true,
      });
      if (cancelled) return;
      if (result.success) onUnlocked();
      else setMode('passcode');
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, onUnlocked]);

  const pressKey = async (key: (typeof KEYS)[number]) => {
    if (key === 'face') {
      setMode('face');
      setHint('looking for u…');
      return;
    }
    if (key === 'del') {
      setDigits((d) => d.slice(0, -1));
      return;
    }
    const next = (digits + key).slice(0, 6);
    setDigits(next);
    if (next.length === 6) {
      const ok = await checkPasscode(next);
      if (ok) onUnlocked();
      else {
        setDigits('');
        setHint('try again ♡');
      }
    }
  };

  return (
    <View
      style={{
        ...({ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } as const),
        backgroundColor: t.bg1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        zIndex: 100,
      }}
      accessibilityLabel="App lock"
    >
      <ScriptText size={36}>Dear Wallet</ScriptText>
      <Text
        style={{
          marginTop: 12,
          fontFamily: 'Nunito_800ExtraBold',
          fontSize: 18,
          color: t.text,
          textAlign: 'center',
        }}
      >
        ur diary is locked ♡
      </Text>

      {mode === 'face' ? (
        <View style={{ marginTop: 28, alignItems: 'center', gap: 16 }}>
          <View
            style={{
              width: 160,
              height: 160,
              borderRadius: 28,
              borderWidth: 3,
              borderColor: t.outline,
              backgroundColor: t.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontFamily: 'PixelifySans_500Medium', fontSize: 14, color: t.text }}>
              FACE
            </Text>
          </View>
          <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 14, color: t.text }}>{hint}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="use passcode instead"
            onPress={() => setMode('passcode')}
            style={{ minHeight: 44, justifyContent: 'center' }}
          >
            <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: t.text }}>
              use passcode instead
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ marginTop: 24, alignItems: 'center', gap: 16, width: '100%' }}>
          <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 14, color: t.text }}>
            enter ur passcode
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {Array.from({ length: 6 }, (_, i) => (
              <View
                key={i}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  borderWidth: 2,
                  borderColor: t.outline,
                  backgroundColor: i < digits.length ? t.btn : t.surface,
                }}
              />
            ))}
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: 260,
              justifyContent: 'center',
              gap: 10,
            }}
          >
            {KEYS.map((key) => (
              <Pressable
                key={key}
                accessibilityRole="button"
                accessibilityLabel={key === 'del' ? 'delete' : key === 'face' ? 'Face ID' : key}
                onPress={() => {
                  void pressKey(key);
                }}
                style={{
                  width: 74,
                  height: 74,
                  borderRadius: 37,
                  borderWidth: 2,
                  borderColor: t.outline,
                  backgroundColor: t.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'PixelifySans_600SemiBold',
                    fontSize: key === 'face' || key === 'del' ? 12 : 22,
                    color: t.text,
                  }}
                >
                  {key === 'del' ? '⌫' : key === 'face' ? 'face' : key}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 12, color: t.text }}>
            forgot passcode? reset with ur account
          </Text>
        </View>
      )}
    </View>
  );
}
