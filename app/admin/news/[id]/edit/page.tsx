import { notFound } from 'next/navigation';
import { getArticleByIdAdmin } from '@/lib/admin/news';
import { updateArticle } from '@/lib/admin/newsActions';
import { Button } from '@/components/ui/Button';
import { NEWS_CATEGORIES } from '@/lib/constants';

const STATUSES = ['draft', 'pending_review', 'published', 'archived'] as const;

const inputCls =
  'mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30';
const labelCls = 'block text-sm font-medium text-text-primary';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await getArticleByIdAdmin(id);
  if (!article) notFound();

  return (
    <form action={updateArticle.bind(null, article.id)} className="max-w-2xl space-y-4">
      <div>
        <label className={labelCls} htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={article.title}
          required
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls} htmlFor="titleTamil">
          Title (Tamil)
        </label>
        <input id="titleTamil" name="titleTamil" defaultValue={article.titleTamil ?? ''} className={inputCls} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls} htmlFor="category">
            Category
          </label>
          <select id="category" name="category" defaultValue={article.category} className={inputCls}>
            {NEWS_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="status">
            Status
          </label>
          <select id="status" name="status" defaultValue={article.status} className={inputCls}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="excerpt">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={article.excerpt}
          rows={3}
          required
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls} htmlFor="body">
          Body
        </label>
        <textarea id="body" name="body" defaultValue={article.body} rows={10} required className={inputCls} />
      </div>

      <div>
        <label className={labelCls} htmlFor="heroImageUrl">
          Hero image URL
        </label>
        <input
          id="heroImageUrl"
          name="heroImageUrl"
          defaultValue={article.heroImageUrl ?? ''}
          className={inputCls}
        />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-text-primary">
          <input type="checkbox" name="isFeatured" defaultChecked={article.isFeatured} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-text-primary">
          <input type="checkbox" name="isBreaking" defaultChecked={article.isBreaking} />
          Breaking
        </label>
      </div>

      {article.sourceUrl && (
        <p className="text-xs text-text-secondary">
          Sourced from {article.sourceName ?? 'RSS'} —{' '}
          <a href={article.sourceUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
            {article.sourceUrl}
          </a>
        </p>
      )}

      <Button type="submit" variant="primary">
        Save
      </Button>
    </form>
  );
}
