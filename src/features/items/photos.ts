import { Directory, File, Paths } from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

/** Pick a library photo, resize to 1080 px JPEG 0.8, store under item-photos/. */
export async function pickAndStoreItemPhoto(itemId: string): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 1,
    allowsEditing: true,
    aspect: [1, 1],
  });
  if (result.canceled || !result.assets[0]?.uri) return null;

  const sourceUri = result.assets[0].uri;
  const manipulated = await manipulateAsync(sourceUri, [{ resize: { width: 1080 } }], {
    compress: 0.8,
    format: SaveFormat.JPEG,
  });

  const dir = new Directory(Paths.document, 'item-photos');
  if (!dir.exists) {
    dir.create();
  }

  const dest = new File(dir, `${itemId}.jpg`);
  if (dest.exists) {
    dest.delete();
  }

  const source = new File(manipulated.uri);
  await source.copy(dest);
  return dest.uri;
}
