import { createClient } from '@/lib/supabase/server';
import { ClassifiedCategory, ListingCondition, PriceType } from '@/types/classifieds';
import { ListingStatus } from '@/lib/admin/classifieds';

// Owner-scoped reads for the /account/listings self-service pages. Every
// query here filters on posted_by in addition to whatever RLS already
// enforces ("classified_listings owner read own") — belt and suspenders,
// and it means getMyListingById can't be used to peek at someone else's
// listing by guessing an id.

export interface MyListing {
  id: string;
  slug: string;
  title: string;
  thumbnail: string | null;
  category: ClassifiedCategory;
  price: number | null;
  priceType: PriceType;
  area: string;
  status: ListingStatus;
  postedAt: string;
  expiresAt: string | null;
  viewCount: number;
}

const MY_LISTING_SELECT =
  'id, slug, title, images, category, price, price_type, area, status, posted_at, expires_at, view_count';

function mapMyListing(row: Record<string, unknown>): MyListing {
  const images = (row.images as string[]) ?? [];
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    thumbnail: images[0] ?? null,
    category: row.category as ClassifiedCategory,
    price: (row.price as number) ?? null,
    priceType: row.price_type as PriceType,
    area: row.area as string,
    status: row.status as ListingStatus,
    postedAt: row.posted_at as string,
    expiresAt: (row.expires_at as string) ?? null,
    viewCount: row.view_count as number,
  };
}

export async function getMyListings(userId: string): Promise<MyListing[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('classified_listings')
    .select(MY_LISTING_SELECT)
    .eq('posted_by', userId)
    .order('posted_at', { ascending: false });
  return (data ?? []).map(mapMyListing);
}

export interface MyListingDetail {
  id: string;
  title: string;
  description: string;
  category: ClassifiedCategory;
  subCategory: string | null;
  price: number | null;
  priceType: PriceType;
  area: string;
  condition: ListingCondition | null;
  contactName: string;
  contactPhone: string;
  contactEmail: string | null;
  whatsappEnabled: boolean;
  status: ListingStatus;
  images: string[];
}

const MY_LISTING_DETAIL_SELECT =
  'id, title, description, category, sub_category, price, price_type, area, condition, contact_name, contact_phone, contact_email, whatsapp_enabled, status, images';

function mapMyListingDetail(row: Record<string, unknown>): MyListingDetail {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    category: row.category as ClassifiedCategory,
    subCategory: (row.sub_category as string) ?? null,
    price: (row.price as number) ?? null,
    priceType: row.price_type as PriceType,
    area: row.area as string,
    condition: (row.condition as ListingCondition) ?? null,
    contactName: row.contact_name as string,
    contactPhone: row.contact_phone as string,
    contactEmail: (row.contact_email as string) ?? null,
    whatsappEnabled: row.whatsapp_enabled as boolean,
    status: row.status as ListingStatus,
    images: (row.images as string[]) ?? [],
  };
}

export async function getMyListingById(id: string, userId: string): Promise<MyListingDetail | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('classified_listings')
    .select(MY_LISTING_DETAIL_SELECT)
    .eq('id', id)
    .eq('posted_by', userId)
    .maybeSingle();
  return data ? mapMyListingDetail(data) : null;
}
