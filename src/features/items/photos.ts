import * as FileSystem from 'expo-file-system/legacy';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

/** Open the library and return a resized JPEG uri. Null if cancelled or it fails. */
export async function pickItemPhoto(): Promise<string | null> {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: false,
    });
    if (result.canceled || !result.assets[0]?.uri) return null;

    const manipulated = await manipulateAsync(result.assets[0].uri, [{ resize: { width: 1080 } }], {
      compress: 0.8,
      format: SaveFormat.JPEG,
    });
    return manipulated.uri;
  } catch {
    return null;
  }
}

/** Copy a picked JPEG into item-photos/{itemId}.jpg. */
export async function storePickedPhoto(itemId: string, sourceUri: string): Promise<string | null> {
  try {
    const root = FileSystem.documentDirectory;
    if (!root) return null;
    const dir = `${root}item-photos/`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    const dest = `${dir}${itemId}.jpg`;
    await FileSystem.copyAsync({ from: sourceUri, to: dest });
    return dest;
  } catch {
    return null;
  }
}

/** Pick a library photo, resize to 1080 px JPEG 0.8, store under item-photos/. */
export async function pickAndStoreItemPhoto(itemId: string): Promise<string | null> {
  const picked = await pickItemPhoto();
  if (!picked) return null;
  return storePickedPhoto(itemId, picked);
}
