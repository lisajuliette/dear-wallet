import { router, useLocalSearchParams } from 'expo-router';

import type { StickerId } from '@/components/stickerAssets';
import { STICKER_ASSETS } from '@/components/stickerAssets';
import { RewardMoment } from '@/features/reward/RewardMoment';

function parseSticker(id: string | undefined): StickerId | null {
  if (!id) return null;
  return id in STICKER_ASSETS ? (id as StickerId) : null;
}

export default function RewardRoute() {
  const params = useLocalSearchParams<{
    amountCents?: string;
    monthCents?: string;
    starAwarded?: string;
    starCount?: string;
    stickerId?: string;
    rare?: string;
  }>();

  const amountRaw = params.amountCents ?? '';
  const amountCents = amountRaw === '' ? null : Number.parseInt(amountRaw, 10);

  return (
    <RewardMoment
      amountCents={Number.isFinite(amountCents) ? amountCents : null}
      monthCents={Number.parseInt(params.monthCents ?? '0', 10) || 0}
      starAwarded={params.starAwarded === '1'}
      starCount={Number.parseInt(params.starCount ?? '0', 10) || 0}
      stickerId={parseSticker(params.stickerId)}
      rare={params.rare === '1'}
      onClose={() => router.replace('/(tabs)')}
    />
  );
}
