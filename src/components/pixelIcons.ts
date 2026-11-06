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
import { resolveSvg } from '@/components/resolveSvg';

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
  back: resolveSvg(Back),
  category: resolveSvg(Category),
  check: resolveSvg(Check),
  close: resolveSvg(Close),
  coin: resolveSvg(Coin),
  collection: resolveSvg(Collection),
  'delete-key': resolveSvg(DeleteKey),
  diary: resolveSvg(Diary),
  download: resolveSvg(Download),
  edit: resolveSvg(Edit),
  forward: resolveSvg(Forward),
  heart: resolveSvg(Heart),
  home: resolveSvg(Home),
  lock: resolveSvg(Lock),
  note: resolveSvg(Note),
  offline: resolveSvg(Offline),
  photo: resolveSvg(Photo),
  plus: resolveSvg(Plus),
  resize: resolveSvg(Resize),
  settings: resolveSvg(Settings),
  share: resolveSvg(Share),
  shuffle: resolveSvg(Shuffle),
  sparkle: resolveSvg(Sparkle),
  tally: resolveSvg(Tally),
  trash: resolveSvg(Trash),
};
