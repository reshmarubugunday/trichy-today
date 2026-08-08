import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

// Service-role client: bypasses Row Level Security entirely.
// Server-only — the RSS ingestion worker and admin panel use this.
// NEVER import this from a Client Component or expose the key to the browser.
export function createAdminClient() {
  return createSupabaseClient(env.supabaseUrl(), env.supabaseServiceRoleKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
