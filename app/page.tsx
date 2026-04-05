import { getFeaturedArticles, getBreakingNews, getAllArticles, getMostReadArticles } from '@/lib/data/getNews';
import { getFeaturedListings } from '@/lib/data/getClassifieds';
import { getTopAd } from '@/lib/data/getAds';
import { BreakingNewsTicker } from '@/components/layout/BreakingNewsTicker';
import { NewsCard } from '@/components/news/NewsCard';
import { ClassifiedCard } from '@/components/classifieds/ClassifiedCard';
import { ClassifiedCategoryGrid } from '@/components/classifieds/ClassifiedCategoryGrid';
import { SponsoredBanner } from '@/components/ads/SponsoredBanner';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { TrendingUp, Plus } from 'lucide-react';

export default async function HomePage() {
  const [breakingNews, featuredArticles, { articles: latestArticles }, mostRead, classifiedListings, heroAd, classifiedsAd] =
    await Promise.all([
      getBreakingNews(),
      getFeaturedArticles(3),
      getAllArticles(1, 6),
      getMostReadArticles(5),
      getFeaturedListings(6),
      getTopAd('homepage-hero'),
      getTopAd('classifieds-inline'),
    ]);

  const heroArticle = featuredArticles[0];
  const secondaryArticles = featuredArticles.slice(1);

  return (
    <>
      {breakingNews.length > 0 && <BreakingNewsTicker articles={breakingNews} />}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero + Secondary grid */}
        <section className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hero story */}
            <div className="lg:col-span-2">
              {heroArticle && <NewsCard article={heroArticle} size="hero" />}
            </div>
            {/* Secondary stories */}
            <div className="flex flex-col gap-4">
              {secondaryArticles.map((article) => (
                <NewsCard key={article.id} article={article} size="large" />
              ))}
            </div>
          </div>
        </section>

        {/* Ad banner */}
        {heroAd && <SponsoredBanner ad={heroAd} variant="billboard" />}

        {/* Latest News */}
        <section className="mb-10">
          <SectionHeader title="Latest News" href="/news" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestArticles.map((article) => (
              <NewsCard key={article.id} article={article} size="medium" />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Most Read */}
          <div className="lg:col-span-1">
            <SectionHeader title="Most Read" />
            <div className="space-y-4">
              {mostRead.map((article, idx) => (
                <div key={article.id} className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-border leading-none mt-0.5 w-6 shrink-0">{idx + 1}</span>
                  <NewsCard article={article} size="small" />
                </div>
              ))}
            </div>
          </div>

          {/* Classifieds Preview */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 rounded-full bg-accent" />
                <h2 className="text-xl font-bold text-text-primary tracking-tight">Classifieds</h2>
              </div>
              <Button href="/post/classified" size="sm" variant="secondary">
                <Plus className="w-3.5 h-3.5 mr-1" /> Post Free Ad
              </Button>
            </div>

            <ClassifiedCategoryGrid />

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {classifiedListings.slice(0, 4).map((listing) => (
                <ClassifiedCard key={listing.id} listing={listing} variant="row" />
              ))}
            </div>

            <div className="mt-4 text-center">
              <Button href="/classifieds" variant="outline" size="md">
                Browse All Classifieds →
              </Button>
            </div>
          </div>
        </div>

        {/* Classifieds Ad */}
        {classifiedsAd && <SponsoredBanner ad={classifiedsAd} variant="leaderboard" />}

        {/* Featured Classifieds Cards */}
        <section className="mb-10">
          <SectionHeader title="Featured Listings" href="/classifieds" accentColor />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {classifiedListings.map((listing) => (
              <ClassifiedCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
