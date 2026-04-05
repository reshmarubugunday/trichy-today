import { NewsArticle } from '@/types/news';
import Link from 'next/link';

interface BreakingNewsTickerProps {
  articles: NewsArticle[];
}

export function BreakingNewsTicker({ articles }: BreakingNewsTickerProps) {
  if (articles.length === 0) return null;

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
        <span className="shrink-0 bg-white text-red-600 text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
          Breaking
        </span>
        <div className="overflow-hidden flex-1">
          <div className="ticker-animate flex items-center gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.category}/${article.slug}`}
                className="text-sm whitespace-nowrap hover:underline opacity-90 hover:opacity-100"
              >
                {article.title}
              </Link>
            ))}
            {/* Duplicate for seamless loop */}
            {articles.map((article) => (
              <Link
                key={`${article.id}-dup`}
                href={`/news/${article.category}/${article.slug}`}
                className="text-sm whitespace-nowrap hover:underline opacity-90 hover:opacity-100"
              >
                {article.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
