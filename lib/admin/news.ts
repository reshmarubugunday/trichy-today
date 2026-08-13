import { NewsCategory } from '@/types/news';
import { createClient } from '@/lib/supabase/server';

export type NewsStatus = 'draft' | 'pending_review' | 'published' | 'archived';

export interface AdminArticle {
  id: string;
  slug: string;
  title: string;
  titleTamil: string | null;
  excerpt: string;
  body: string;
  category: NewsCategory;
  heroImageUrl: string | null;
  sourceUrl: string | null;
  sourceName: string | null;
  status: NewsStatus;
  isFeatured: boolean;
  isBreaking: boolean;
  createdAt: string;
  publishedAt: string | null;
}

const ADMIN_SELECT =
  'id, slug, title, title_tamil, excerpt, body, category, hero_image_url, source_url, source_name, status, is_featured, is_breaking, created_at, published_at';

function mapAdminArticle(row: Record<string, unknown>): AdminArticle {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    titleTamil: (row.title_tamil as string) ?? null,
    excerpt: row.excerpt as string,
    body: row.body as string,
    category: row.category as NewsCategory,
    heroImageUrl: (row.hero_image_url as string) ?? null,
    sourceUrl: (row.source_url as string) ?? null,
    sourceName: (row.source_name as string) ?? null,
    status: row.status as NewsStatus,
    isFeatured: row.is_featured as boolean,
    isBreaking: row.is_breaking as boolean,
    createdAt: row.created_at as string,
    publishedAt: (row.published_at as string) ?? null,
  };
}

export async function getPendingArticles(): Promise<AdminArticle[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('news_articles')
    .select(ADMIN_SELECT)
    .eq('status', 'pending_review')
    .order('created_at', { ascending: true });
  return (data ?? []).map(mapAdminArticle);
}

export async function getArticlesAdmin(status?: NewsStatus): Promise<AdminArticle[]> {
  const supabase = await createClient();
  let query = supabase
    .from('news_articles')
    .select(ADMIN_SELECT)
    .order('created_at', { ascending: false })
    .limit(100);
  if (status) query = query.eq('status', status);
  const { data } = await query;
  return (data ?? []).map(mapAdminArticle);
}

export async function getArticleByIdAdmin(id: string): Promise<AdminArticle | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('news_articles').select(ADMIN_SELECT).eq('id', id).maybeSingle();
  return data ? mapAdminArticle(data) : null;
}
