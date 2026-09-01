'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { slugify } from '@/lib/utils';
import { ClassifiedCategory, ListingCondition, PriceType } from '@/types/classifieds';

const MAX_IMAGES = 6;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const LISTING_DAYS = 60;

type CreateListingResult = { id: string; error?: undefined } | { id?: undefined; error: string };

// Images upload through the user's own session (not the service-role client), so
// each upload is subject to the "classified-images owner upload" RLS policy —
// storage.foldername(name)[1] = auth.uid() — same as the listing insert below.
export async function createListing(formData: FormData): Promise<CreateListingResult> {
  const user = await getCurrentUser();
  if (!user) return { error: 'You must be logged in to post an ad.' };

  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const category = String(formData.get('category') ?? '') as ClassifiedCategory;
  const subCategory = String(formData.get('subCategory') ?? '').trim() || null;
  const priceType = String(formData.get('priceType') ?? 'negotiable') as PriceType;
  const priceRaw = String(formData.get('price') ?? '').trim();
  const price = priceRaw && !Number.isNaN(Number(priceRaw)) ? Number(priceRaw) : null;
  const area = String(formData.get('area') ?? '').trim();
  const condition = (String(formData.get('condition') ?? '').trim() || null) as ListingCondition | null;
  const contactName = String(formData.get('name') ?? '').trim();
  const contactPhone = String(formData.get('phone') ?? '').trim();
  const contactEmail = String(formData.get('email') ?? '').trim() || null;
  const whatsappEnabled = formData.get('whatsapp') === 'true';

  if (!title || !description || !category || !area || !contactName || !contactPhone) {
    return { error: 'Please fill in all required fields.' };
  }

  const supabase = await createClient();

  const imageFiles = formData
    .getAll('images')
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, MAX_IMAGES);

  const imageUrls: string[] = [];
  for (const file of imageFiles) {
    if (file.size > MAX_IMAGE_BYTES) continue;
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('classified-images')
      .upload(path, file, { contentType: file.type || 'image/jpeg' });
    if (uploadError) continue;
    imageUrls.push(supabase.storage.from('classified-images').getPublicUrl(path).data.publicUrl);
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + LISTING_DAYS);

  const { data, error } = await supabase
    .from('classified_listings')
    .insert({
      slug: `${slugify(title)}-${crypto.randomUUID().slice(0, 8)}`,
      title,
      description,
      category,
      sub_category: subCategory,
      price,
      price_type: priceType,
      area,
      images: imageUrls,
      condition,
      contact_name: contactName,
      contact_phone: contactPhone,
      contact_email: contactEmail,
      whatsapp_enabled: whatsappEnabled,
      posted_by: user.id,
      expires_at: expiresAt.toISOString(),
    })
    .select('id')
    .single();

  if (error || !data) {
    return { error: 'Something went wrong submitting your ad. Please try again.' };
  }

  revalidatePath('/classifieds');
  revalidatePath('/admin/moderation');
  return { id: data.id };
}
