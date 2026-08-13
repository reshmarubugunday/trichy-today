import { createClient } from '@/lib/supabase/server';

export interface CurrentUser {
  id: string;
  role: 'user' | 'editor' | 'admin';
  name: string | null;
  phone: string | null;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('users')
    .select('id, role, name, phone')
    .eq('id', user.id)
    .maybeSingle();

  return data as CurrentUser | null;
}

export function isEditorOrAdmin(user: CurrentUser | null): boolean {
  return user?.role === 'editor' || user?.role === 'admin';
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
