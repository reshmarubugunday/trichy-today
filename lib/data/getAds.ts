import { CompanyAd, AdPlacement } from '@/types/ads';
import { mockAds } from '@/lib/mock-data/ads';

export async function getAdsByPlacement(placement: AdPlacement): Promise<CompanyAd[]> {
  return mockAds
    .filter((ad) => ad.placement === placement && ad.isActive)
    .sort((a, b) => b.priority - a.priority);
}

export async function getTopAd(placement: AdPlacement): Promise<CompanyAd | null> {
  const ads = await getAdsByPlacement(placement);
  return ads[0] ?? null;
}
