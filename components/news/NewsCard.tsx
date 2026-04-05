import { NewsArticle } from '@/types/news';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { NEWS_CATEGORIES } from '@/lib/constants';
import { formatRelativeTime, truncateText } from '@/lib/utils';

interface NewsCardProps {
  article: NewsArticle;
  size?: 'hero' | 'large' | 'medium' | 'small';
}

export function NewsCard({ article, size = 'medium' }: NewsCardProps) {
  const href = `/news/${article.category}/${article.slug}`;
  const categoryLabel = NEWS_CATEGORIES.find((c) => c.value === article.category)?.label ?? article.category;

  if (size === 'hero') {
    return (
      <Link href={href} className="group block relative w-full aspect-[16/7] rounded-xl overflow-hidden">
        <Image
          src={article.heroImageUrl}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            {article.isBreaking && <Badge label="Breaking" variant="breaking" />}
            <Badge label={categoryLabel} variant="category" category={article.category} />
          </div>
          <h2 className="text-white font-bold text-2xl md:text-3xl leading-tight mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            {article.title}
          </h2>
          <p className="text-white/70 text-sm hidden md:block line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 mt-3 text-white/60 text-xs">
            <span>{article.author.name}</span>
            <span>·</span>
            <span>{formatRelativeTime(article.publishedAt)}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (size === 'small') {
    return (
      <Link href={href} className="group flex items-start gap-3">
        <div className="relative w-20 h-16 shrink-0 rounded overflow-hidden">
          <Image src={article.heroImageUrl} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">{categoryLabel}</p>
          <h4 className="text-sm font-semibold text-text-primary leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h4>
          <p className="text-xs text-text-secondary mt-1">{formatRelativeTime(article.publishedAt)}</p>
        </div>
      </Link>
    );
  }

  // medium (default) and large
  return (
    <Link href={href} className="group block bg-white rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow duration-200">
      <div className={`relative w-full ${size === 'large' ? 'aspect-[16/9]' : 'aspect-[3/2]'} overflow-hidden`}>
        <Image
          src={article.heroImageUrl}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {article.isBreaking && (
          <div className="absolute top-2 left-2">
            <Badge label="Breaking" variant="breaking" />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge label={categoryLabel} variant="category" category={article.category} />
        </div>
        <h3
          className={`font-bold text-text-primary leading-snug group-hover:text-primary transition-colors line-clamp-2 ${size === 'large' ? 'text-xl mb-2' : 'text-base mb-1'}`}
          style={size === 'large' ? { fontFamily: 'Georgia, serif' } : {}}
        >
          {article.title}
        </h3>
        {size === 'large' && (
          <p className="text-sm text-text-secondary line-clamp-2 mb-3">{article.excerpt}</p>
        )}
        <div className="flex items-center justify-between text-xs text-text-secondary mt-2">
          <span>{article.author.name}</span>
          <span>{formatRelativeTime(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
