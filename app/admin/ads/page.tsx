import Link from 'next/link';
import { getAllAdsAdmin } from '@/lib/admin/ads';
import { toggleAdActive } from '@/lib/admin/adsActions';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { AD_PLACEMENTS } from '@/lib/constants';

export default async function AdminAdsPage() {
  const ads = await getAllAdsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-secondary">{ads.length} campaigns</p>
        <Link href="/admin/ads/new">
          <Button variant="primary" size="sm">
            New Ad
          </Button>
        </Link>
      </div>

      {ads.length === 0 ? (
        <p className="text-sm text-text-secondary">No ad campaigns yet.</p>
      ) : (
        <div className="space-y-2">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="border border-border rounded-lg p-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-text-primary truncate">{ad.companyName}</p>
                  {ad.isActive ? (
                    <Badge label="Active" variant="verified" />
                  ) : (
                    <Badge label="Inactive" variant="sponsored" />
                  )}
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  {AD_PLACEMENTS.find((p) => p.value === ad.placement)?.label ?? ad.placement} · Priority{' '}
                  {ad.priority} · {formatDate(ad.startDate)} – {formatDate(ad.endDate)} · {ad.impressionCount}{' '}
                  impressions
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/ads/${ad.id}/edit`}
                  className="text-sm text-text-secondary hover:text-primary font-medium px-3 py-1.5"
                >
                  Edit
                </Link>
                <form action={toggleAdActive.bind(null, ad.id, !ad.isActive)}>
                  <Button type="submit" variant="outline" size="sm">
                    {ad.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
