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
import { resolveSvg } from '@/components/resolveSvg';

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
  'common-butterfly': resolveSvg(CommonButterfly),
  'common-dear-wallet-letter': resolveSvg(CommonDearWalletLetter),
  'common-flip-phone': resolveSvg(CommonFlipPhone),
  'common-gold-star': resolveSvg(CommonGoldStar),
  'common-kept-stack': resolveSvg(CommonKeptStack),
  'common-lil-cloud': resolveSvg(CommonLilCloud),
  'common-lip-gloss': resolveSvg(CommonLipGloss),
  'common-mixtape': resolveSvg(CommonMixtape),
  'common-nvm-bubble': resolveSvg(CommonNvmBubble),
  'common-nvmd-boba': resolveSvg(CommonNvmdBoba),
  'common-pixel-heart': resolveSvg(CommonPixelHeart),
  'common-sparkle-trio': resolveSvg(CommonSparkleTrio),
  'mood-chill': resolveSvg(MoodChill),
  'mood-meh': resolveSvg(MoodMeh),
  'mood-proud': resolveSvg(MoodProud),
  'mood-tempted': resolveSvg(MoodTempted),
  'mood-wobbly': resolveSvg(MoodWobbly),
  'rare-holo-butterfly': resolveSvg(RareHoloButterfly),
  'rare-holo-cd': resolveSvg(RareHoloCd),
  'rare-holo-star': resolveSvg(RareHoloStar),
};

export function isRareSticker(id: StickerId): boolean {
  return id.startsWith('rare-');
}
