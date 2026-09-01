'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { requireEditor } from '@/lib/auth/getCurrentUser';
import { ClassifiedCategory, ListingCondition, PriceType } from '@/types/classifieds';
import { ListingStatus } from '@/lib/admin/classifieds';

function revalidatePublicPaths() {
  revalidatePath('/');
  revalidatePath('/classifieds');
  revalidatePath('/admin/moderation');
  revalidatePath('/admin/classifieds');
}

export async function approveListing(id: string) {
  await requireEditor();
  const supabase = await createClient();
  await supabase.from('classified_listings').update({ status: 'active' }).eq('id', id);
  revalidatePublicPaths();
}

export async function rejectListing(id: string) {
  await requireEditor();
  const supabase = await createClient();
  await supabase.from('classified_listings').update({ status: 'removed' }).eq('id', id);
  revalidatePublicPaths();
}

export async function toggleListingVerified(id: string, nextVerified: boolean) {
  await requireEditor();
  const supabase = await createClient();
  await supabase.from('classified_listings').update({ is_verified: nextVerified }).eq('id', id);
  revalidatePublicPaths();
}

export async function updateListing(id: string, formData: FormData) {
  await requireEditor();
  const supabase = await createClient();

  const priceRaw = String(formData.get('price') ?? '').trim();

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
      status: String(formData.get('status') ?? 'pending') as ListingStatus,
      is_verified: formData.get('isVerified') === 'on',
    })
    .eq('id', id);

  revalidatePublicPaths();
  redirect('/admin/classifieds');
}
