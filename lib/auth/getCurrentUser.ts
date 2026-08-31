import { createClient } from '@/lib/supabase/server';
import { isAdmin, isEditorOrAdmin, type CurrentUser } from '@/lib/auth/roles';

export type { CurrentUser };
export { isEditorOrAdmin };

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('users')
    .select('id, role, name, phone, is_banned')
    .eq('id', user.id)
    .maybeSingle();

  // Treat a banned user as signed out everywhere this is the source of
  // truth: admin access, posting, the header's account state.
  if (!data || data.is_banned) return null;
  return data as CurrentUser;
}

// Every admin Server Action must call this first — Server Actions are
// reachable directly (not gated by the /admin layout's redirect), so
// authorization has to be re-checked at the action itself, not assumed.
export async function requireEditor(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user || !isEditorOrAdmin(user)) {
    throw new Error('Not authorized');
  }
  return user;
}

// Role/ban changes are more sensitive than ordinary moderation — require
// the stricter admin role, not just editor-or-admin.
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user || !isAdmin(user)) {
    throw new Error('Not authorized');
  }
  return user;
}
