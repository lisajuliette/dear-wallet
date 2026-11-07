import { requestPermissionsAsync, saveToLibraryAsync } from 'expo-media-library/legacy';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

import type { RefObject } from 'react';

/** Loose ref type — view-shot's CaptureTarget disagrees with RN 0.88 View refs. */
export type CaptureTarget = RefObject<unknown>;

/** Capture the off-screen 360×640 card resized to 1080×1920 PNG. */
export async function captureRecapCard(target: CaptureTarget): Promise<string> {
  if (!target.current) throw new Error('recap card not ready');
  return captureRef(target as never, {
    format: 'png',
    quality: 1,
    result: 'tmpfile',
    width: 1080,
    height: 1920,
  });
}

/** Ask Photos permission only when saving, then write the PNG. */
export async function saveRecapToPhotos(uri: string): Promise<void> {
  const permission = await requestPermissionsAsync(true);
  if (!permission.granted) {
    throw new Error('photos permission needed to save ur recap');
  }
  await saveToLibraryAsync(uri);
}

export async function shareRecap(uri: string): Promise<void> {
  const available = await Sharing.isAvailableAsync();
  if (!available) throw new Error('sharing is not available on this device');
  await Sharing.shareAsync(uri, {
    mimeType: 'image/png',
    UTI: 'public.png',
    dialogTitle: 'share ur recap ♡',
  });
}
