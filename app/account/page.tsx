import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { LogoutButton } from '@/components/auth/LogoutButton';

const roleLabels: Record<string, string> = {
  user: 'Member',
  editor: 'Editor',
  admin: 'Admin',
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/account');

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="mb-6 text-2xl font-semibold text-text-primary">My Account</h1>

      <dl className="divide-y divide-border rounded-lg border border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <dt className="text-sm text-text-secondary">Name</dt>
          <dd className="text-sm font-medium text-text-primary">{user.name || '—'}</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <dt className="text-sm text-text-secondary">Email</dt>
          <dd className="text-sm font-medium text-text-primary">{user.email || '—'}</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <dt className="text-sm text-text-secondary">Phone</dt>
          <dd className="text-sm font-medium text-text-primary">{user.phone || '—'}</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <dt className="text-sm text-text-secondary">Account type</dt>
          <dd className="text-sm font-medium text-text-primary">{roleLabels[user.role] ?? user.role}</dd>
        </div>
      </dl>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
}
