import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';

import { Screen } from '@/components';
import { db } from '@/db/client';
import { DeleteConfirmSheet } from '@/features/items/DeleteConfirmSheet';
import { ItemDetailScreen } from '@/features/items/ItemDetailScreen';
import { pickAndStoreItemPhoto } from '@/features/items/photos';
import {
  getItem,
  markBoughtAfterAll,
  softDelete,
  undoBoughtAfterAll,
  updateItem,
  type Item,
  type ItemTag,
} from '@/features/items/repository';
import { getLocalUserId } from '@/lib/localUser';

export default function ItemDetailRoute() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [item, setItem] = useState<Item | null>(null);
  const [missing, setMissing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const refresh = useCallback(async () => {
    if (!id) {
      setMissing(true);
      return;
    }
    const row = await getItem(db, getLocalUserId(), id);
    if (!row) {
      setMissing(true);
      setItem(null);
      return;
    }
    setMissing(false);
    setItem(row);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  if (missing) {
    return (
      <Screen accessibilityLabel="Item detail">
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>item not found</Text>
        </View>
      </Screen>
    );
  }

  if (!item) {
    return (
      <Screen accessibilityLabel="Item detail">
        <View style={{ flex: 1 }} />
      </Screen>
    );
  }

  return (
    <>
      <ItemDetailScreen
        item={item}
        onAddPhoto={() => {
          void pickAndStoreItemPhoto(item.id)
            .then(async (path) => {
              if (!path) return;
              const next = await updateItem(db, getLocalUserId(), item.id, { photoPath: path });
              setItem(next);
            })
            .catch(() => undefined);
        }}
        onToggleTag={(tag: ItemTag) => {
          void updateItem(db, getLocalUserId(), item.id, {
            tag: item.tag === tag ? null : tag,
          }).then(setItem);
        }}
        onBoughtAfterAll={() => {
          void markBoughtAfterAll(db, getLocalUserId(), item.id).then(setItem);
        }}
        onUndoBought={() => {
          void undoBoughtAfterAll(db, getLocalUserId(), item.id).then(setItem);
        }}
        onRequestDelete={() => setDeleteOpen(true)}
      />
      <DeleteConfirmSheet
        visible={deleteOpen}
        name={item.name}
        onKeep={() => setDeleteOpen(false)}
        onDelete={() => {
          void softDelete(db, getLocalUserId(), item.id).then(() => {
            setDeleteOpen(false);
            router.back();
          });
        }}
      />
    </>
  );
}
