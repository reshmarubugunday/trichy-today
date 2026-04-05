import { getAllListings } from '@/lib/data/getClassifieds';
import { getTopAd } from '@/lib/data/getAds';
import { ClassifiedCard } from '@/components/classifieds/ClassifiedCard';
import { ClassifiedCategoryGrid } from '@/components/classifieds/ClassifiedCategoryGrid';
import { SponsoredBanner } from '@/components/ads/SponsoredBanner';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Classifieds – Jobs, Real Estate, Vehicles & More' };

export default async function ClassifiedsPage() {
  const [{ listings }, ad] = await Promise.all([
    getAllListings(1, 12),
    getTopAd('classifieds-inline'),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Classifieds</h1>
          <p className="text-sm text-text-secondary mt-1">Buy, sell, find jobs, real estate and more in Trichy</p>
        </div>
        <Button href="/post/classified" variant="primary" size="md">
          <Plus className="w-4 h-4 mr-1.5" /> Post Free Ad
        </Button>
      </div>

      {/* Category grid */}
      <div className="mb-8">
        <SectionHeader title="Browse by Category" />
        <ClassifiedCategoryGrid />
      </div>

      {ad && <SponsoredBanner ad={ad} variant="leaderboard" />}

      {/* All listings */}
      <SectionHeader title="Recent Listings" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {listings.map((listing) => (
          <ClassifiedCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
