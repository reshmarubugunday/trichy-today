import Link from 'next/link';
import { getArticlesAdmin, NewsStatus } from '@/lib/admin/news';
import { Badge } from '@/components/ui/Badge';
import { formatDate, categoryLabel } from '@/lib/utils';

const STATUS_TABS: { value: NewsStatus | undefined; label: string }[] = [
  { value: undefined, label: 'All' },
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminNewsPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const articles = await getArticlesAdmin(status as NewsStatus | undefined);

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap mb-6">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.label}
            href={tab.value ? `/admin/news?status=${tab.value}` : '/admin/news'}
            className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
              status === tab.value
                ? 'border-primary bg-red-50 text-primary font-semibold'
                : 'border-border text-text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {articles.length === 0 ? (
        <p className="text-sm text-text-secondary">No articles.</p>
      ) : (
        <div className="space-y-2">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/admin/news/${article.id}/edit`}
              className="block border border-border rounded-lg p-4 hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-text-primary truncate">{article.title}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {categoryLabel(article.category)} · {formatDate(article.createdAt)}
                  </p>
                </div>
                <Badge label={article.status.replace('_', ' ')} variant="category" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
