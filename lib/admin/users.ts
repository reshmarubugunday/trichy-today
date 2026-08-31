import { createClient } from '@/lib/supabase/server';

export type UserRole = 'user' | 'editor' | 'admin';

export interface AdminUser {
  id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  role: UserRole;
  isVerified: boolean;
  isBanned: boolean;
  createdAt: string;
}

const ADMIN_SELECT = 'id, email, name, phone, role, is_verified, is_banned, created_at';

function mapAdminUser(row: Record<string, unknown>): AdminUser {
  return {
    id: row.id as string,
    email: (row.email as string) ?? null,
    name: (row.name as string) ?? null,
    phone: (row.phone as string) ?? null,
    role: row.role as UserRole,
    isVerified: row.is_verified as boolean,
    isBanned: row.is_banned as boolean,
    createdAt: row.created_at as string,
  };
}

export async function getAllUsersAdmin(): Promise<AdminUser[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('users')
    .select(ADMIN_SELECT)
    .order('created_at', { ascending: false })
    .limit(200);
  return (data ?? []).map(mapAdminUser);
}
