import { getArticlesByCategory, getMostReadArticles } from '@/lib/data/getNews';
import { getTopAd } from '@/lib/data/getAds';
import { NewsCard } from '@/components/news/NewsCard';
import { SponsoredBanner } from '@/components/ads/SponsoredBanner';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { NEWS_CATEGORIES } from '@/lib/constants';
import { NewsCategory } from '@/types/news';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = NEWS_CATEGORIES.find((c) => c.value === category);
  return { title: cat ? `${cat.label} News` : 'News' };
}

export default async function NewsCategoryPage({ params }: Props) {
  const { category } = await params;
  const validCategories = NEWS_CATEGORIES.map((c) => c.value);
  if (!validCategories.includes(category as NewsCategory)) notFound();

  const [{ articles }, mostRead, ad] = await Promise.all([
    getArticlesByCategory(category as NewsCategory),
    getMostReadArticles(5),
    getTopAd('article-inline'),
  ]);

  const catLabel = NEWS_CATEGORIES.find((c) => c.value === category)?.label ?? category;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap mb-6">
        <Link href="/news" className="px-4 py-1.5 rounded-full border border-border text-sm text-text-secondary hover:border-primary hover:text-primary transition-colors">
          All
        </Link>
        {NEWS_CATEGORIES.map((cat) => (
          <Link
            key={cat.value}
            href={`/news/${cat.value}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              cat.value === category
                ? 'bg-primary text-white'
                : 'border border-border text-text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <SectionHeader title={`${catLabel} News`} />
          {articles.length === 0 ? (
            <p className="text-text-secondary py-12 text-center">No articles in this category yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {articles.map((article) => (
                <NewsCard key={article.id} article={article} size="medium" />
              ))}
            </div>
          )}
        </div>

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
