export type AdPlacement =
  | 'header-leaderboard'
  | 'homepage-hero'
  | 'sidebar-rectangle'
  | 'article-inline'
  | 'classifieds-inline'
  | 'footer-banner';

export interface CompanyAd {
  id: string;
  companyName: string;
  tagline?: string;
  imageUrl: string;
  linkUrl: string;
  placement: AdPlacement;
  isActive: boolean;
  priority: number;
  startDate: string;
  endDate: string;
  bgColor?: string;
}
