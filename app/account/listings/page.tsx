import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { getMyListings } from '@/lib/classifieds/myListings';
import { deleteMyListing, renewMyListing } from '@/lib/classifieds/myListingsActions';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { formatDate, formatPrice, categoryLabel } from '@/lib/utils';

export default async function MyListingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/account/listings');

  const listings = await getMyListings(user.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-text-primary">My Listings</h1>
        <div className="flex items-center gap-4">
          <Link href="/account" className="text-sm text-text-secondary hover:underline">
            ← Back to account
          </Link>
          <LogoutButton />
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-lg border border-border p-8 text-center">
          <p className="text-sm text-text-secondary mb-4">You haven&apos;t posted any classifieds yet.</p>
          <Button href="/post/classified">Post a Free Ad</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <div key={listing.id} className="flex gap-4 rounded-lg border border-border p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
                {listing.thumbnail && (
                  <Image src={listing.thumbnail} alt={listing.title} fill className="object-cover" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-text-primary truncate">{listing.title}</p>
                  <Badge label={listing.status} variant="category" />
                </div>
                <p className="mt-1 text-xs text-text-secondary">
                  {categoryLabel(listing.category)} · {listing.area} ·{' '}
                  {listing.price ? formatPrice(listing.price) : 'No price'}
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  Posted {formatDate(listing.postedAt)}
                  {listing.expiresAt && <> · Expires {formatDate(listing.expiresAt)}</>}
                  {' · '}
                  {listing.viewCount.toLocaleString()} views
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button href={`/account/listings/${listing.id}/edit`} variant="outline" size="sm">
                    Edit
                  </Button>
                  {(listing.status === 'active' || listing.status === 'expired') && (
                    <form action={renewMyListing.bind(null, listing.id)}>
                      <Button type="submit" variant="secondary" size="sm">
                        Renew
                      </Button>
                    </form>
                  )}
                  {listing.status !== 'removed' && (
                    <form action={deleteMyListing.bind(null, listing.id)}>
                      <Button type="submit" variant="ghost" size="sm">
                        Delete
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
