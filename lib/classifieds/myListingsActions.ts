'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { ClassifiedCategory, ListingCondition, PriceType } from '@/types/classifieds';

const RENEWAL_DAYS = 60;

function revalidateListingPaths() {
  revalidatePath('/');
  revalidatePath('/classifieds');
  revalidatePath('/account/listings');
}

// Soft-delete, same convention as the admin moderation queue's "reject" —
// nothing hard-deletes classified_listings. Scoped to posted_by so this
// can't touch another user's row even if the id is guessed.
//
// Uses the service-role client deliberately: the "classified_listings
// owner update" RLS policy has no column restriction, so the regular
// session-bound client can't be trusted to only ever reach 'removed' from
// here — a lock_owner_listing_update trigger pins status back to 'pending'
// for any non-editor write through that path. This function is the
// trusted, already-authorized-and-scoped caller the trigger carves out.
export async function deleteMyListing(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authorized');

  const admin = createAdminClient();
  await admin
    .from('classified_listings')
    .update({ status: 'removed' })
    .eq('id', id)
    .eq('posted_by', user.id);

  revalidateListingPaths();
}

// Free self-service renewal (Phase 3) — just pushes expires_at out and
// brings an expired listing back to active. Paid renewal (Phase 4) is a
// separate, later concern. Restricted to active/expired: renewing a
// pending listing makes no sense (it isn't live yet), and renewing a
// sold/removed one would misrepresent it as available again.
//
// Service-role client for the same reason as deleteMyListing above — the
// owner-update lock trigger would otherwise reset status back to 'pending'.
export async function renewMyListing(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authorized');

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + RENEWAL_DAYS);

  const admin = createAdminClient();
  await admin
    .from('classified_listings')
    .update({ expires_at: expiresAt.toISOString(), status: 'active' })
    .eq('id', id)
    .eq('posted_by', user.id)
    .in('status', ['active', 'expired']);

  revalidateListingPaths();
}

// Editing sends the listing back through moderation (status → 'pending') —
// otherwise an owner could swap in different content after approval with
// no review, making the original approval meaningless. Status itself,
// is_verified, and posted_by are intentionally not accepted from the form.
export async function updateMyListing(id: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authorized');

  const priceRaw = String(formData.get('price') ?? '').trim();

  const supabase = await createClient();
  await supabase
    .from('classified_listings')
    .update({
      title: String(formData.get('title') ?? '').trim(),
      description: String(formData.get('description') ?? '').trim(),
      category: String(formData.get('category') ?? '') as ClassifiedCategory,
      sub_category: String(formData.get('subCategory') ?? '').trim() || null,
      price: priceRaw && !Number.isNaN(Number(priceRaw)) ? Number(priceRaw) : null,
      price_type: String(formData.get('priceType') ?? 'negotiable') as PriceType,
      area: String(formData.get('area') ?? '').trim(),
      condition: (String(formData.get('condition') ?? '').trim() || null) as ListingCondition | null,
      contact_name: String(formData.get('contactName') ?? '').trim(),
      contact_phone: String(formData.get('contactPhone') ?? '').trim(),
      contact_email: String(formData.get('contactEmail') ?? '').trim() || null,
      whatsapp_enabled: formData.get('whatsappEnabled') === 'on',
      status: 'pending',
    })
    .eq('id', id)
    .eq('posted_by', user.id);

  revalidateListingPaths();
  redirect('/account/listings');
}
