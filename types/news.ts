export type NewsCategory =
  | 'local'
  | 'business'
  | 'entertainment'
  | 'sports'
  | 'politics'
  | 'education'
  | 'health';

export interface NewsAuthor {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  titleTamil?: string;
  excerpt: string;
  body: string;
  category: NewsCategory;
  tags: string[];
  heroImageUrl: string;
  author: NewsAuthor;
  publishedAt: string;
  updatedAt?: string;
  isFeatured: boolean;
  isBreaking: boolean;
  viewCount: number;
  sourceUrl?: string;
}
