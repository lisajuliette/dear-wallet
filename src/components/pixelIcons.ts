import Back from '@/assets/icons/back.svg';
import Category from '@/assets/icons/category.svg';
import Check from '@/assets/icons/check.svg';
import Close from '@/assets/icons/close.svg';
import Coin from '@/assets/icons/coin.svg';
import Collection from '@/assets/icons/collection.svg';
import DeleteKey from '@/assets/icons/delete-key.svg';
import Diary from '@/assets/icons/diary.svg';
import Download from '@/assets/icons/download.svg';
import Edit from '@/assets/icons/edit.svg';
import Forward from '@/assets/icons/forward.svg';
import Heart from '@/assets/icons/heart.svg';
import Home from '@/assets/icons/home.svg';
import Lock from '@/assets/icons/lock.svg';
import Note from '@/assets/icons/note.svg';
import Offline from '@/assets/icons/offline.svg';
import Photo from '@/assets/icons/photo.svg';
import Plus from '@/assets/icons/plus.svg';
import Resize from '@/assets/icons/resize.svg';
import Settings from '@/assets/icons/settings.svg';
import Share from '@/assets/icons/share.svg';
import Shuffle from '@/assets/icons/shuffle.svg';
import Sparkle from '@/assets/icons/sparkle.svg';
import Tally from '@/assets/icons/tally.svg';
import Trash from '@/assets/icons/trash.svg';

import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

export type PixelIconName =
  | 'back'
  | 'category'
  | 'check'
  | 'close'
  | 'coin'
  | 'collection'
  | 'delete-key'
  | 'diary'
  | 'download'
  | 'edit'
  | 'forward'
  | 'heart'
  | 'home'
  | 'lock'
  | 'note'
  | 'offline'
  | 'photo'
  | 'plus'
  | 'resize'
  | 'settings'
  | 'share'
  | 'shuffle'
  | 'sparkle'
  | 'tally'
  | 'trash';

export const PIXEL_ICONS: Record<PixelIconName, FC<SvgProps>> = {
  back: Back,
  category: Category,
  check: Check,
  close: Close,
  coin: Coin,
  collection: Collection,
  'delete-key': DeleteKey,
  diary: Diary,
  download: Download,
  edit: Edit,
  forward: Forward,
  heart: Heart,
  home: Home,
  lock: Lock,
  note: Note,
  offline: Offline,
  photo: Photo,
  plus: Plus,
  resize: Resize,
  settings: Settings,
  share: Share,
  shuffle: Shuffle,
  sparkle: Sparkle,
  tally: Tally,
  trash: Trash,
};
