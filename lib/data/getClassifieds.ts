import { ClassifiedListing, ClassifiedCategory } from '@/types/classifieds';
import { createClient } from '@/lib/supabase/server';

// RLS scopes rows already (public: active only; owner: + their own listings;
// editors/admins: everything) — see auth_and_rls.sql.
//
// contact.phone is intentionally left out of the mapped shape: full phone
// numbers must never be rendered in HTML (masked reveal via API is Phase 3,
// not built yet — see CLAUDE.md "Key Conventions"). Leaving it undefined
// here means the existing UI's `listing.contact.phone ? … : …` branches
// already degrade to the no-phone state with no component changes needed.

type ListingRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ClassifiedCategory;
  sub_category: string | null;
  price: number | null;
  price_type: ClassifiedListing['priceType'];
  area: string;
  pincode: string | null;
  images: string[];
  condition: ClassifiedListing['condition'] | null;
  contact_name: string;
  contact_email: string | null;
  whatsapp_enabled: boolean;
  posted_at: string;
  expires_at: string | null;
  is_verified: boolean;
  is_premium: boolean;
  view_count: number;
};

const LISTING_SELECT =
  'id, slug, title, description, category, sub_category, price, price_type, area, pincode, images, condition, contact_name, contact_email, whatsapp_enabled, posted_at, expires_at, is_verified, is_premium, view_count';

function mapListing(row: ListingRow): ClassifiedListing {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    subCategory: row.sub_category ?? undefined,
    price: row.price ?? undefined,
    priceType: row.price_type,
    currency: 'INR',
    location: {
      area: row.area,
      city: 'Tiruchirappalli',
      pincode: row.pincode ?? undefined,
    },
    images: row.images ?? [],
    condition: row.condition ?? undefined,
    contact: {
      name: row.contact_name,
      email: row.contact_email ?? undefined,
      whatsappEnabled: row.whatsapp_enabled,
    },
    postedAt: row.posted_at,
    expiresAt: row.expires_at ?? undefined,
    isVerified: row.is_verified,
    isPremium: row.is_premium,
    viewCount: row.view_count,
  };
}

export async function getFeaturedListings(limit = 6): Promise<ClassifiedListing[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('classified_listings')
    .select(LISTING_SELECT)
    .order('posted_at', { ascending: false })
    .limit(limit);
  return ((data as ListingRow[]) ?? []).map(mapListing);
}

export async function getPremiumListings(category?: ClassifiedCategory): Promise<ClassifiedListing[]> {
  const supabase = await createClient();
  let query = supabase
    .from('classified_listings')
    .select(LISTING_SELECT)
    .eq('is_premium', true)
    .order('posted_at', { ascending: false });
  if (category) query = query.eq('category', category);
  const { data } = await query;
  return ((data as ListingRow[]) ?? []).map(mapListing);
}

export async function getListingsByCategory(
  category: ClassifiedCategory,
  page = 1,
  limit = 12
): Promise<{ listings: ClassifiedListing[]; total: number }> {
  const supabase = await createClient();
  const start = (page - 1) * limit;
  const { data, count } = await supabase
    .from('classified_listings')
    .select(LISTING_SELECT, { count: 'exact' })
    .eq('category', category)
    .order('posted_at', { ascending: false })
    .range(start, start + limit - 1);
  return { listings: ((data as ListingRow[]) ?? []).map(mapListing), total: count ?? 0 };
}

export async function getListingById(id: string): Promise<ClassifiedListing | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('classified_listings')
    .select(LISTING_SELECT)
    .eq('id', id)
    .maybeSingle();
  return data ? mapListing(data as ListingRow) : null;
}

export async function getAllListings(
  page = 1,
  limit = 12
): Promise<{ listings: ClassifiedListing[]; total: number }> {
  const supabase = await createClient();
  const start = (page - 1) * limit;
  const { data, count } = await supabase
    .from('classified_listings')
    .select(LISTING_SELECT, { count: 'exact' })
    .order('posted_at', { ascending: false })
    .range(start, start + limit - 1);
  return { listings: ((data as ListingRow[]) ?? []).map(mapListing), total: count ?? 0 };
}
