'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/getCurrentUser';
import type { UserRole } from '@/lib/admin/users';

const ROLES: UserRole[] = ['user', 'editor', 'admin'];

export async function setUserRole(id: string, formData: FormData) {
  const admin = await requireAdmin();
  const role = String(formData.get('role') ?? '');
  if (!ROLES.includes(role as UserRole)) return;
  // Prevent an admin locking themselves out by demoting their own account.
  if (id === admin.id && role !== 'admin') return;

  const supabase = await createClient();
  await supabase.from('users').update({ role }).eq('id', id);
  revalidatePath('/admin/users');
}

export async function setUserBanned(id: string, banned: boolean) {
  const admin = await requireAdmin();
  if (id === admin.id) return; // can't ban yourself

  const supabase = await createClient();
  await supabase.from('users').update({ is_banned: banned }).eq('id', id);
  revalidatePath('/admin/users');
}
