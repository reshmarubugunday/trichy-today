import Link from 'next/link';
import { getPendingArticles } from '@/lib/admin/news';
import { getPendingListings, getListingsAdmin } from '@/lib/admin/classifieds';
import { getAllAdsAdmin } from '@/lib/admin/ads';
import { getAllUsersAdmin } from '@/lib/admin/users';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { isAdmin } from '@/lib/auth/roles';

export default async function AdminDashboardPage() {
  const viewer = await getCurrentUser();
  const viewerIsAdmin = isAdmin(viewer);

  const [pendingArticles, pendingListings, activeListings, ads, users] = await Promise.all([
    getPendingArticles(),
    getPendingListings(),
    getListingsAdmin('active'),
    getAllAdsAdmin(),
    viewerIsAdmin ? getAllUsersAdmin() : Promise.resolve([]),
  ]);

  const activeAds = ads.filter((ad) => ad.isActive).length;
  const bannedUsers = users.filter((u) => u.isBanned).length;

  const tiles = [
    { label: 'Pending news', value: pendingArticles.length, href: '/admin/moderation' },
    { label: 'Pending classifieds', value: pendingListings.length, href: '/admin/moderation' },
    { label: 'Active listings', value: activeListings.length, href: '/admin/classifieds?status=active' },
    { label: 'Active ad campaigns', value: activeAds, href: '/admin/ads' },
    ...(viewerIsAdmin
      ? [
          { label: 'Registered users', value: users.length, href: '/admin/users' },
          { label: 'Banned users', value: bannedUsers, href: '/admin/users' },
        ]
      : []),
  ];

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {tiles.map((tile) => (
          <Link
            key={tile.label}
            href={tile.href}
            className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
          >
            <p className="text-2xl font-bold text-text-primary">{tile.value}</p>
            <p className="text-sm text-text-secondary mt-1">{tile.label}</p>
          </Link>
        ))}
      </div>

      {(pendingArticles.length > 0 || pendingListings.length > 0) && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-text-primary">
          <Link href="/admin/moderation" className="font-medium text-primary hover:underline">
            {pendingArticles.length + pendingListings.length} item
            {pendingArticles.length + pendingListings.length === 1 ? '' : 's'} waiting on review →
          </Link>
        </div>
      )}
    </div>
  );
}
