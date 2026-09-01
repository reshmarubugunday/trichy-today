import { ClassifiedCategory, ListingCondition, PriceType } from '@/types/classifieds';
import { createClient } from '@/lib/supabase/server';

export type ListingStatus = 'pending' | 'active' | 'sold' | 'expired' | 'removed';

export interface AdminListing {
  id: string;
  title: string;
  description: string;
  category: ClassifiedCategory;
  price: number | null;
  area: string;
  contactName: string;
  status: ListingStatus;
  isVerified: boolean;
  postedAt: string;
}

const ADMIN_SELECT =
  'id, title, description, category, price, area, contact_name, status, is_verified, posted_at';

function mapAdminListing(row: Record<string, unknown>): AdminListing {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    category: row.category as ClassifiedCategory,
    price: (row.price as number) ?? null,
    area: row.area as string,
    contactName: row.contact_name as string,
    status: row.status as ListingStatus,
    isVerified: row.is_verified as boolean,
    postedAt: row.posted_at as string,
  };
}

export async function getPendingListings(): Promise<AdminListing[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('classified_listings')
    .select(ADMIN_SELECT)
    .eq('status', 'pending')
    .order('posted_at', { ascending: true });
  return (data ?? []).map(mapAdminListing);
}

export async function getListingsAdmin(status?: ListingStatus): Promise<AdminListing[]> {
  const supabase = await createClient();
  let query = supabase
    .from('classified_listings')
    .select(ADMIN_SELECT)
    .order('posted_at', { ascending: false })
    .limit(100);
  if (status) query = query.eq('status', status);
  const { data } = await query;
  return (data ?? []).map(mapAdminListing);
}

export interface AdminListingDetail extends AdminListing {
  subCategory: string | null;
  priceType: PriceType;
  pincode: string | null;
  condition: ListingCondition | null;
  contactPhone: string;
  contactEmail: string | null;
  whatsappEnabled: boolean;
  images: string[];
}

const ADMIN_DETAIL_SELECT =
  'id, title, description, category, sub_category, price, price_type, area, pincode, images, condition, contact_name, contact_phone, contact_email, whatsapp_enabled, status, is_verified, posted_at';

function mapAdminListingDetail(row: Record<string, unknown>): AdminListingDetail {
  return {
    ...mapAdminListing(row),
    subCategory: (row.sub_category as string) ?? null,
    priceType: row.price_type as PriceType,
    pincode: (row.pincode as string) ?? null,
    condition: (row.condition as ListingCondition) ?? null,
    contactPhone: row.contact_phone as string,
    contactEmail: (row.contact_email as string) ?? null,
    whatsappEnabled: row.whatsapp_enabled as boolean,
    images: (row.images as string[]) ?? [],
  };
}

export async function getListingByIdAdmin(id: string): Promise<AdminListingDetail | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('classified_listings')
    .select(ADMIN_DETAIL_SELECT)
    .eq('id', id)
    .maybeSingle();
  return data ? mapAdminListingDetail(data) : null;
}
