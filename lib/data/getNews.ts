import { NewsArticle, NewsCategory } from '@/types/news';
import { mockNews } from '@/lib/mock-data/news';

export async function getFeaturedArticles(limit = 4): Promise<NewsArticle[]> {
  return mockNews.filter((a) => a.isFeatured).slice(0, limit);
}

export async function getBreakingNews(): Promise<NewsArticle[]> {
  return mockNews.filter((a) => a.isBreaking);
}

export async function getAllArticles(page = 1, limit = 12): Promise<{ articles: NewsArticle[]; total: number }> {
  const sorted = [...mockNews].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const start = (page - 1) * limit;
  return { articles: sorted.slice(start, start + limit), total: sorted.length };
}

export async function getArticlesByCategory(
  category: NewsCategory,
  page = 1,
  limit = 12
): Promise<{ articles: NewsArticle[]; total: number }> {
  const filtered = mockNews
    .filter((a) => a.category === category)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const start = (page - 1) * limit;
  return { articles: filtered.slice(start, start + limit), total: filtered.length };
}

export async function getArticleBySlug(slug: string): Promise<NewsArticle | null> {
  return mockNews.find((a) => a.slug === slug) ?? null;
}

export async function getRelatedArticles(articleId: string, category: NewsCategory, limit = 3): Promise<NewsArticle[]> {
  return mockNews
    .filter((a) => a.id !== articleId && a.category === category)
    .slice(0, limit);
}

export async function getMostReadArticles(limit = 5): Promise<NewsArticle[]> {
  return [...mockNews].sort((a, b) => b.viewCount - a.viewCount).slice(0, limit);
}
