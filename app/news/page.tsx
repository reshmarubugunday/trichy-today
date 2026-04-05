import { getAllArticles, getMostReadArticles } from '@/lib/data/getNews';
import { getTopAd } from '@/lib/data/getAds';
import { NewsCard } from '@/components/news/NewsCard';
import { SponsoredBanner } from '@/components/ads/SponsoredBanner';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { NEWS_CATEGORIES } from '@/lib/constants';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'All News' };

export default async function NewsPage() {
  const [{ articles }, mostRead, ad] = await Promise.all([
    getAllArticles(1, 12),
    getMostReadArticles(5),
    getTopAd('article-inline'),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap mb-6">
        <Link href="/news" className="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-medium">
          All
        </Link>
        {NEWS_CATEGORIES.map((cat) => (
          <Link
            key={cat.value}
            href={`/news/${cat.value}`}
            className="px-4 py-1.5 rounded-full border border-border text-sm text-text-secondary hover:border-primary hover:text-primary transition-colors"
          >
            {cat.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main content */}
        <div className="lg:col-span-3">
          <SectionHeader title="Latest News" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} size="medium" />
            ))}
          </div>
        </div>

        {/* Sidebar */}
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
          {ad && (
            <div className="mt-6">
              <SponsoredBanner ad={ad} variant="sidebar" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
