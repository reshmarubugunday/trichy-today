'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireEditor } from '@/lib/auth/getCurrentUser';
import { AdPlacement } from '@/types/ads';

// company_ads has no RLS write policy for authenticated users — per
// auth_and_rls.sql, ad writes are meant to go through the service role.
// That bypasses RLS entirely, so requireEditor() here is the only
// authorization check standing between a request and the ads table —
// it must run before every mutation in this file.

function adFieldsFromForm(formData: FormData) {
  return {
    company_name: String(formData.get('companyName') ?? '').trim(),
    tagline: String(formData.get('tagline') ?? '').trim() || null,
    image_url: String(formData.get('imageUrl') ?? '').trim(),
    link_url: String(formData.get('linkUrl') ?? '').trim(),
    placement: String(formData.get('placement') ?? '') as AdPlacement,
    is_active: formData.get('isActive') === 'on',
    priority: Number(formData.get('priority') ?? 0),
    start_date: String(formData.get('startDate') ?? ''),
    end_date: String(formData.get('endDate') ?? ''),
  };
}

export async function createAd(formData: FormData) {
  await requireEditor();
  const supabase = createAdminClient();
  await supabase.from('company_ads').insert(adFieldsFromForm(formData));
  revalidatePath('/admin/ads');
  redirect('/admin/ads');
}

export async function updateAd(id: string, formData: FormData) {
  await requireEditor();
  const supabase = createAdminClient();
  await supabase.from('company_ads').update(adFieldsFromForm(formData)).eq('id', id);
  revalidatePath('/admin/ads');
  redirect('/admin/ads');
}

export async function toggleAdActive(id: string, nextActive: boolean) {
  await requireEditor();
  const supabase = createAdminClient();
  await supabase.from('company_ads').update({ is_active: nextActive }).eq('id', id);
  revalidatePath('/admin/ads');
  revalidatePath('/');
}
