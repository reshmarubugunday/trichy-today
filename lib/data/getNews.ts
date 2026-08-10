import { NewsArticle, NewsCategory } from '@/types/news';
import { createClient } from '@/lib/supabase/server';

// RLS already scopes rows to what the caller may see (public: published only;
// editors/admins signed in: everything) — see auth_and_rls.sql. Queries below
// don't re-filter by status so an editor's session naturally previews drafts.

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  title_tamil: string | null;
  excerpt: string;
  body: string;
  category: NewsCategory;
  tags: string[];
  hero_image_url: string | null;
  author_id: string | null;
  source_url: string | null;
  source_name: string | null;
  is_featured: boolean;
  is_breaking: boolean;
  view_count: number;
  published_at: string | null;
  updated_at: string;
  author: { name: string } | null;
};

const ARTICLE_SELECT = '*, author:users(name)';

function mapArticle(row: ArticleRow): NewsArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    titleTamil: row.title_tamil ?? undefined,
    excerpt: row.excerpt,
    body: row.body,
    category: row.category,
    tags: row.tags ?? [],
    heroImageUrl: row.hero_image_url ?? '',
    author: {
      id: row.author_id ?? '',
      name: row.author?.name ?? row.source_name ?? 'Trichy Today',
    },
    publishedAt: row.published_at ?? row.updated_at,
    updatedAt: row.updated_at,
    isFeatured: row.is_featured,
    isBreaking: row.is_breaking,
    viewCount: row.view_count,
    sourceUrl: row.source_url ?? undefined,
  };
}

export async function getFeaturedArticles(limit = 4): Promise<NewsArticle[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('news_articles')
    .select(ARTICLE_SELECT)
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit);
  return ((data as ArticleRow[]) ?? []).map(mapArticle);
}

export async function getBreakingNews(): Promise<NewsArticle[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('news_articles')
    .select(ARTICLE_SELECT)
    .eq('is_breaking', true)
    .order('published_at', { ascending: false });
  return ((data as ArticleRow[]) ?? []).map(mapArticle);
}

export async function getAllArticles(
  page = 1,
  limit = 12
): Promise<{ articles: NewsArticle[]; total: number }> {
  const supabase = await createClient();
  const start = (page - 1) * limit;
  const { data, count } = await supabase
    .from('news_articles')
    .select(ARTICLE_SELECT, { count: 'exact' })
    .order('published_at', { ascending: false })
    .range(start, start + limit - 1);
  return { articles: ((data as ArticleRow[]) ?? []).map(mapArticle), total: count ?? 0 };
}

export async function getArticlesByCategory(
  category: NewsCategory,
  page = 1,
  limit = 12
): Promise<{ articles: NewsArticle[]; total: number }> {
  const supabase = await createClient();
  const start = (page - 1) * limit;
  const { data, count } = await supabase
    .from('news_articles')
    .select(ARTICLE_SELECT, { count: 'exact' })
    .eq('category', category)
    .order('published_at', { ascending: false })
    .range(start, start + limit - 1);
  return { articles: ((data as ArticleRow[]) ?? []).map(mapArticle), total: count ?? 0 };
}

export async function getArticleBySlug(slug: string): Promise<NewsArticle | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('news_articles')
    .select(ARTICLE_SELECT)
    .eq('slug', slug)
    .maybeSingle();
  return data ? mapArticle(data as ArticleRow) : null;
}

export async function getRelatedArticles(
  articleId: string,
  category: NewsCategory,
  limit = 3
): Promise<NewsArticle[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('news_articles')
    .select(ARTICLE_SELECT)
    .eq('category', category)
    .neq('id', articleId)
    .order('published_at', { ascending: false })
    .limit(limit);
  return ((data as ArticleRow[]) ?? []).map(mapArticle);
}

export async function getMostReadArticles(limit = 5): Promise<NewsArticle[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('news_articles')
    .select(ARTICLE_SELECT)
    .order('view_count', { ascending: false })
    .limit(limit);
  return ((data as ArticleRow[]) ?? []).map(mapArticle);
}
