import Link from 'next/link';
import { getPendingArticles } from '@/lib/admin/news';
import { getPendingListings } from '@/lib/admin/classifieds';
import { publishArticle, archiveArticle } from '@/lib/admin/newsActions';
import { approveListing, rejectListing } from '@/lib/admin/classifiedsActions';
import { Button } from '@/components/ui/Button';
import { formatRelativeTime, formatPrice, categoryLabel } from '@/lib/utils';

export default async function ModerationPage() {
  const [articles, listings] = await Promise.all([getPendingArticles(), getPendingListings()]);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-lg font-bold text-text-primary mb-4">
          Pending News ({articles.length})
        </h2>
        {articles.length === 0 ? (
          <p className="text-sm text-text-secondary">Nothing waiting on review.</p>
        ) : (
          <div className="space-y-3">
            {articles.map((article) => (
              <div
                key={article.id}
                className="border border-border rounded-lg p-4 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-text-primary truncate">{article.title}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {categoryLabel(article.category)} · {article.sourceName ?? 'Manual'} ·{' '}
                    {formatRelativeTime(article.createdAt)}
                    {article.sourceUrl && (
                      <>
                        {' · '}
                        <a
                          href={article.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline"
                        >
                          View source
                        </a>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/news/${article.id}/edit`}
                    className="text-sm text-text-secondary hover:text-primary font-medium px-3 py-1.5"
                  >
                    Edit
                  </Link>
                  <form action={archiveArticle.bind(null, article.id)}>
                    <Button type="submit" variant="outline" size="sm">
                      Reject
                    </Button>
                  </form>
                  <form action={publishArticle.bind(null, article.id)}>
                    <Button type="submit" variant="primary" size="sm">
                      Approve
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold text-text-primary mb-4">
          Pending Classifieds ({listings.length})
        </h2>
        {listings.length === 0 ? (
          <p className="text-sm text-text-secondary">Nothing waiting on review.</p>
        ) : (
          <div className="space-y-3">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="border border-border rounded-lg p-4 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-text-primary truncate">{listing.title}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {categoryLabel(listing.category)} · {listing.area} ·{' '}
                    {listing.price ? formatPrice(listing.price) : 'No price'} · {listing.contactName} ·{' '}
                    {formatRelativeTime(listing.postedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <form action={rejectListing.bind(null, listing.id)}>
                    <Button type="submit" variant="outline" size="sm">
                      Reject
                    </Button>
                  </form>
                  <form action={approveListing.bind(null, listing.id)}>
                    <Button type="submit" variant="primary" size="sm">
                      Approve
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
