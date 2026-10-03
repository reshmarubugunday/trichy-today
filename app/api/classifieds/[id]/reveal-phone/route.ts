import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

interface Params {
  params: Promise<{ id: string }>;
}

// Phone numbers are never included in the page's initial HTML (see
// lib/data/getClassifieds.ts) — the client calls this route only after the
// user explicitly asks to see the number. The listing read goes through
// the caller's own session so the same RLS that scopes listing visibility
// (public: active only; owner/editor: more) also scopes who can reveal a
// phone number. The log write uses the service-role client since
// classified_phone_reveals has no anon/authenticated policies at all.
export async function POST(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const supabase = await createClient();
  const [{ data: listing }, { data: auth }] = await Promise.all([
    supabase.from('classified_listings').select('id, contact_phone').eq('id', id).maybeSingle(),
    supabase.auth.getUser(),
  ]);

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  const admin = createAdminClient();
  await admin.from('classified_phone_reveals').insert({
    listing_id: id,
    viewer_id: auth?.user?.id ?? null,
  });

  return NextResponse.json({ phone: listing.contact_phone });
}
