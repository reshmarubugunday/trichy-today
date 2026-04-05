import { ClassifiedListing, ClassifiedCategory } from '@/types/classifieds';
import { mockClassifieds } from '@/lib/mock-data/classifieds';

export async function getFeaturedListings(limit = 6): Promise<ClassifiedListing[]> {
  return mockClassifieds.slice(0, limit);
}

export async function getPremiumListings(category?: ClassifiedCategory): Promise<ClassifiedListing[]> {
  let listings = mockClassifieds.filter((l) => l.isPremium);
  if (category) listings = listings.filter((l) => l.category === category);
  return listings;
}

export async function getListingsByCategory(
  category: ClassifiedCategory,
  page = 1,
  limit = 12
): Promise<{ listings: ClassifiedListing[]; total: number }> {
  const filtered = mockClassifieds
    .filter((l) => l.category === category)
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  const start = (page - 1) * limit;
  return { listings: filtered.slice(start, start + limit), total: filtered.length };
}

export async function getListingById(id: string): Promise<ClassifiedListing | null> {
  return mockClassifieds.find((l) => l.id === id) ?? null;
}

export async function getAllListings(page = 1, limit = 12): Promise<{ listings: ClassifiedListing[]; total: number }> {
  const sorted = [...mockClassifieds].sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );
  const start = (page - 1) * limit;
  return { listings: sorted.slice(start, start + limit), total: sorted.length };
}
