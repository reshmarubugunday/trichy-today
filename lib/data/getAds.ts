import { CompanyAd, AdPlacement } from '@/types/ads';
import { createClient } from '@/lib/supabase/server';

// RLS already restricts public reads to is_active campaigns within their
// date range — see auth_and_rls.sql "company_ads public read active".

type AdRow = {
  id: string;
  company_name: string;
  tagline: string | null;
  image_url: string;
  link_url: string;
  placement: AdPlacement;
  is_active: boolean;
  priority: number;
  start_date: string;
  end_date: string;
};

function mapAd(row: AdRow): CompanyAd {
  return {
    id: row.id,
    companyName: row.company_name,
    tagline: row.tagline ?? undefined,
    imageUrl: row.image_url,
    linkUrl: row.link_url,
    placement: row.placement,
    isActive: row.is_active,
    priority: row.priority,
    startDate: row.start_date,
    endDate: row.end_date,
  };
}

export async function getAdsByPlacement(placement: AdPlacement): Promise<CompanyAd[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('company_ads')
    .select('*')
    .eq('placement', placement)
    .order('priority', { ascending: false });
  return ((data as AdRow[]) ?? []).map(mapAd);
}

export async function getTopAd(placement: AdPlacement): Promise<CompanyAd | null> {
  const ads = await getAdsByPlacement(placement);
  return ads[0] ?? null;
}
