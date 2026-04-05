import { getListingsByCategory } from '@/lib/data/getClassifieds';
import { getTopAd } from '@/lib/data/getAds';
import { ClassifiedCard } from '@/components/classifieds/ClassifiedCard';
import { ClassifiedCategoryGrid } from '@/components/classifieds/ClassifiedCategoryGrid';
import { SponsoredBanner } from '@/components/ads/SponsoredBanner';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { CLASSIFIED_CATEGORIES } from '@/lib/constants';
import { ClassifiedCategory } from '@/types/classifieds';
import { notFound } from 'next/navigation';
import { Plus } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = CLASSIFIED_CATEGORIES.find((c) => c.value === category);
  return { title: cat ? `${cat.label} Classifieds in Trichy` : 'Classifieds' };
}

export default async function ClassifiedsCategoryPage({ params }: Props) {
  const { category } = await params;
  const validCategories = CLASSIFIED_CATEGORIES.map((c) => c.value);
  if (!validCategories.includes(category as ClassifiedCategory)) notFound();

  const [{ listings }, ad] = await Promise.all([
    getListingsByCategory(category as ClassifiedCategory),
    getTopAd('classifieds-inline'),
  ]);

  const catInfo = CLASSIFIED_CATEGORIES.find((c) => c.value === category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{catInfo?.label} in Trichy</h1>
          <p className="text-sm text-text-secondary mt-1">{listings.length} listing{listings.length !== 1 ? 's' : ''} found</p>
        </div>
        <Button href="/post/classified" variant="primary" size="md">
          <Plus className="w-4 h-4 mr-1.5" /> Post Free Ad
        </Button>
      </div>

      {/* Category quick nav */}
      <div className="mb-6">
        <ClassifiedCategoryGrid />
      </div>

      {listings.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-text-secondary mb-4">No listings in this category yet.</p>
          <Button href="/post/classified" variant="primary">Post the First Ad</Button>
        </div>
      ) : (
        <>
          {ad && <SponsoredBanner ad={ad} variant="leaderboard" />}
          <SectionHeader title={`${catInfo?.label} Listings`} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {listings.map((listing) => (
              <ClassifiedCard key={listing.id} listing={listing} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
