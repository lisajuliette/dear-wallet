import { Redirect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { db } from '@/db/client';
import {
  SplashHandOff,
  hasSplashDoneThisLaunch,
  isOnboarded,
  markSplashDoneThisLaunch,
  resolvePostSplashHref,
} from '@/features/onboarding';

export default function Index() {
  const [splashDone, setSplashDone] = useState(hasSplashDoneThisLaunch);
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    void isOnboarded(db).then(setOnboarded);
  }, []);

  const onSplashDone = useCallback(() => {
    markSplashDoneThisLaunch();
    setSplashDone(true);
  }, []);

  if (!splashDone) {
    return <SplashHandOff onDone={onSplashDone} />;
  }

  if (onboarded == null) {
    return null;
  }

  return <Redirect href={resolvePostSplashHref(onboarded)} />;
}
