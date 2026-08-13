import { ClassifiedCategory } from '@/types/classifieds';
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
