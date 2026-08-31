import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { isEditorOrAdmin, isAdmin } from '@/lib/auth/roles';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!isEditorOrAdmin(user)) redirect('/');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
        <Link href="/admin" className="text-2xl font-bold text-text-primary">
          Admin
        </Link>
        <nav className="flex gap-5 text-sm font-medium">
          <Link href="/admin/moderation" className="text-text-secondary hover:text-primary">
            Moderation
          </Link>
          <Link href="/admin/news" className="text-text-secondary hover:text-primary">
            News
          </Link>
          <Link href="/admin/classifieds" className="text-text-secondary hover:text-primary">
            Classifieds
          </Link>
          <Link href="/admin/ads" className="text-text-secondary hover:text-primary">
            Ads
          </Link>
          {isAdmin(user) && (
            <Link href="/admin/users" className="text-text-secondary hover:text-primary">
              Users
            </Link>
          )}
        </nav>
      </div>
      {children}
    </div>
  );
}
