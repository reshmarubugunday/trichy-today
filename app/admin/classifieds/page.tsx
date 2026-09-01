import Link from 'next/link';
import { getListingsAdmin, ListingStatus } from '@/lib/admin/classifieds';
import { Badge } from '@/components/ui/Badge';
import { formatDate, formatPrice, categoryLabel } from '@/lib/utils';

const STATUS_TABS: { value: ListingStatus | undefined; label: string }[] = [
  { value: undefined, label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'sold', label: 'Sold' },
  { value: 'expired', label: 'Expired' },
  { value: 'removed', label: 'Removed' },
];

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminClassifiedsPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const listings = await getListingsAdmin(status as ListingStatus | undefined);

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap mb-6">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.label}
            href={tab.value ? `/admin/classifieds?status=${tab.value}` : '/admin/classifieds'}
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

      {listings.length === 0 ? (
        <p className="text-sm text-text-secondary">No listings.</p>
      ) : (
        <div className="space-y-2">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/admin/classifieds/${listing.id}/edit`}
              className="block border border-border rounded-lg p-4 hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-text-primary truncate">{listing.title}</p>
                    {listing.isVerified && <Badge label="Verified" variant="verified" />}
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    {categoryLabel(listing.category)} · {listing.area} ·{' '}
                    {listing.price ? formatPrice(listing.price) : 'No price'} · {formatDate(listing.postedAt)}
                  </p>
                </div>
                <Badge label={listing.status} variant="category" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
