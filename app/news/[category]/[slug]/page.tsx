import { getArticleBySlug, getRelatedArticles, getMostReadArticles } from '@/lib/data/getNews';
import { getTopAd } from '@/lib/data/getAds';
import { NewsCard } from '@/components/news/NewsCard';
import { SponsoredBanner } from '@/components/ads/SponsoredBanner';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { NEWS_CATEGORIES } from '@/lib/constants';
import { NewsCategory } from '@/types/news';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Eye, Share2 } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found' };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.heroImageUrl],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug, category } = await params;
  const [article, inlineAd] = await Promise.all([
    getArticleBySlug(slug),
    getTopAd('article-inline'),
  ]);

  if (!article) notFound();

  const [related, mostRead] = await Promise.all([
    getRelatedArticles(article.id, article.category as NewsCategory),
    getMostReadArticles(5),
  ]);

  const catLabel = NEWS_CATEGORIES.find((c) => c.value === article.category)?.label ?? article.category;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Article */}
        <article className="lg:col-span-3">
          {/* Breadcrumb */}
          <nav className="text-xs text-text-secondary mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>›</span>
            <Link href="/news" className="hover:text-primary">News</Link>
            <span>›</span>
            <Link href={`/news/${article.category}`} className="hover:text-primary capitalize">{catLabel}</Link>
          </nav>

          {/* Hero image */}
          <div className="relative w-full aspect-[16/7] rounded-xl overflow-hidden mb-6">
            <Image
              src={article.heroImageUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {article.isBreaking && <Badge label="Breaking" variant="breaking" />}
            <Badge label={catLabel} variant="category" category={article.category} />
            {article.tags.map((tag) => (
              <span key={tag} className="text-xs text-text-secondary bg-gray-100 px-2 py-0.5 rounded">#{tag}</span>
            ))}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            {article.title}
          </h1>
          {article.titleTamil && (
            <p className="text-lg text-text-secondary mb-3" style={{ fontFamily: 'Noto Sans Tamil, sans-serif' }}>
              {article.titleTamil}
            </p>
          )}

          <p className="text-base text-text-secondary leading-relaxed mb-4">{article.excerpt}</p>

          <div className="flex items-center justify-between py-3 border-t border-b border-border mb-6">
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <span className="font-medium text-text-primary">{article.author.name}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {article.viewCount.toLocaleString()} views
              </span>
            </div>
            <button className="flex items-center gap-1.5 text-sm text-primary hover:underline">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </div>

          {/* Body */}
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          {/* Inline ad */}
          {inlineAd && <SponsoredBanner ad={inlineAd} variant="billboard" />}

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-8">
              <SectionHeader title="Related Articles" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((a) => (
                  <NewsCard key={a.id} article={a} size="medium" />
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <SectionHeader title="Most Read" />
          <div className="space-y-4">
            {mostRead.map((a, idx) => (
              <div key={a.id} className="flex items-start gap-3">
                <span className="text-2xl font-bold text-border leading-none mt-0.5 w-6 shrink-0">{idx + 1}</span>
                <NewsCard article={a} size="small" />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
