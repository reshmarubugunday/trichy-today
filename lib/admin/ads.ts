import { AdPlacement } from '@/types/ads';
import { createClient } from '@/lib/supabase/server';

export interface AdminAd {
  id: string;
  companyName: string;
  tagline: string | null;
  imageUrl: string;
  linkUrl: string;
  placement: AdPlacement;
  isActive: boolean;
  priority: number;
  startDate: string;
  endDate: string;
  impressionCount: number;
  clickCount: number;
}

const ADMIN_SELECT =
  'id, company_name, tagline, image_url, link_url, placement, is_active, priority, start_date, end_date, impression_count, click_count';

function mapAdminAd(row: Record<string, unknown>): AdminAd {
  return {
    id: row.id as string,
    companyName: row.company_name as string,
    tagline: (row.tagline as string) ?? null,
    imageUrl: row.image_url as string,
    linkUrl: row.link_url as string,
    placement: row.placement as AdPlacement,
    isActive: row.is_active as boolean,
    priority: row.priority as number,
    startDate: row.start_date as string,
    endDate: row.end_date as string,
    impressionCount: row.impression_count as number,
    clickCount: row.click_count as number,
  };
}

export async function getAllAdsAdmin(): Promise<AdminAd[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('company_ads')
    .select(ADMIN_SELECT)
    .order('created_at', { ascending: false });
  return (data ?? []).map(mapAdminAd);
}

export async function getAdByIdAdmin(id: string): Promise<AdminAd | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('company_ads').select(ADMIN_SELECT).eq('id', id).maybeSingle();
  return data ? mapAdminAd(data) : null;
}
