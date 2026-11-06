import CommonButterfly from '@/assets/stickers/svg/common-butterfly.svg';
import CommonDearWalletLetter from '@/assets/stickers/svg/common-dear-wallet-letter.svg';
import CommonFlipPhone from '@/assets/stickers/svg/common-flip-phone.svg';
import CommonGoldStar from '@/assets/stickers/svg/common-gold-star.svg';
import CommonKeptStack from '@/assets/stickers/svg/common-kept-stack.svg';
import CommonLilCloud from '@/assets/stickers/svg/common-lil-cloud.svg';
import CommonLipGloss from '@/assets/stickers/svg/common-lip-gloss.svg';
import CommonMixtape from '@/assets/stickers/svg/common-mixtape.svg';
import CommonNvmBubble from '@/assets/stickers/svg/common-nvm-bubble.svg';
import CommonNvmdBoba from '@/assets/stickers/svg/common-nvmd-boba.svg';
import CommonPixelHeart from '@/assets/stickers/svg/common-pixel-heart.svg';
import CommonSparkleTrio from '@/assets/stickers/svg/common-sparkle-trio.svg';
import MoodChill from '@/assets/stickers/svg/mood-chill.svg';
import MoodMeh from '@/assets/stickers/svg/mood-meh.svg';
import MoodProud from '@/assets/stickers/svg/mood-proud.svg';
import MoodTempted from '@/assets/stickers/svg/mood-tempted.svg';
import MoodWobbly from '@/assets/stickers/svg/mood-wobbly.svg';
import RareHoloButterfly from '@/assets/stickers/svg/rare-holo-butterfly.svg';
import RareHoloCd from '@/assets/stickers/svg/rare-holo-cd.svg';
import RareHoloStar from '@/assets/stickers/svg/rare-holo-star.svg';

import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

export type StickerId =
  | 'common-butterfly'
  | 'common-dear-wallet-letter'
  | 'common-flip-phone'
  | 'common-gold-star'
  | 'common-kept-stack'
  | 'common-lil-cloud'
  | 'common-lip-gloss'
  | 'common-mixtape'
  | 'common-nvm-bubble'
  | 'common-nvmd-boba'
  | 'common-pixel-heart'
  | 'common-sparkle-trio'
  | 'mood-chill'
  | 'mood-meh'
  | 'mood-proud'
  | 'mood-tempted'
  | 'mood-wobbly'
  | 'rare-holo-butterfly'
  | 'rare-holo-cd'
  | 'rare-holo-star';

export const STICKER_ASSETS: Record<StickerId, FC<SvgProps>> = {
  'common-butterfly': CommonButterfly,
  'common-dear-wallet-letter': CommonDearWalletLetter,
  'common-flip-phone': CommonFlipPhone,
  'common-gold-star': CommonGoldStar,
  'common-kept-stack': CommonKeptStack,
  'common-lil-cloud': CommonLilCloud,
  'common-lip-gloss': CommonLipGloss,
  'common-mixtape': CommonMixtape,
  'common-nvm-bubble': CommonNvmBubble,
  'common-nvmd-boba': CommonNvmdBoba,
  'common-pixel-heart': CommonPixelHeart,
  'common-sparkle-trio': CommonSparkleTrio,
  'mood-chill': MoodChill,
  'mood-meh': MoodMeh,
  'mood-proud': MoodProud,
  'mood-tempted': MoodTempted,
  'mood-wobbly': MoodWobbly,
  'rare-holo-butterfly': RareHoloButterfly,
  'rare-holo-cd': RareHoloCd,
  'rare-holo-star': RareHoloStar,
};

export function isRareSticker(id: StickerId): boolean {
  return id.startsWith('rare-');
}
