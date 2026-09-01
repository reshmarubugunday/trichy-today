import { redirect } from 'next/navigation';
import { getAllUsersAdmin } from '@/lib/admin/users';
import { setUserRole, setUserBanned } from '@/lib/admin/usersActions';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { isAdmin } from '@/lib/auth/roles';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

const ROLES = ['user', 'editor', 'admin'] as const;

export default async function AdminUsersPage() {
  // Role/ban management is admin-only — the /admin layout already lets
  // editors in for content moderation, so re-check the stricter role here.
  const viewer = await getCurrentUser();
  if (!isAdmin(viewer)) redirect('/admin/moderation');

  const users = await getAllUsersAdmin();

  return (
    <div>
      <p className="text-sm text-text-secondary mb-6">{users.length} registered users</p>

      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="border border-border rounded-lg p-4 flex items-center justify-between gap-4 flex-wrap"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-text-primary truncate">{user.name || user.email || user.phone || user.id}</p>
                {user.isVerified && <Badge label="Verified" variant="verified" />}
                {user.isBanned && <Badge label="Banned" variant="sponsored" />}
              </div>
              <p className="text-xs text-text-secondary mt-1">
                {user.email ?? 'No email'} · Joined {formatDate(user.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <form action={setUserRole.bind(null, user.id)} className="flex items-center gap-2">
                <select
                  name="role"
                  defaultValue={user.role}
                  disabled={user.id === viewer!.id}
                  className="border border-border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <Button type="submit" variant="outline" size="sm" disabled={user.id === viewer!.id}>
                  Save
                </Button>
              </form>

              <form action={setUserBanned.bind(null, user.id, !user.isBanned)}>
                <Button type="submit" variant={user.isBanned ? 'primary' : 'outline'} size="sm" disabled={user.id === viewer!.id}>
                  {user.isBanned ? 'Unban' : 'Ban'}
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
