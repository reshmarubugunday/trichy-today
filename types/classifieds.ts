export type ClassifiedCategory =
  | 'jobs'
  | 'real-estate'
  | 'vehicles'
  | 'electronics'
  | 'services'
  | 'matrimony'
  | 'education'
  | 'other';

export type ListingCondition = 'new' | 'like-new' | 'good' | 'fair' | 'for-parts';
export type PriceType = 'fixed' | 'negotiable' | 'free' | 'on-request';

export interface ClassifiedContact {
  name: string;
  // Masked form only (e.g. "●●●● ●●●● 34") — the full number is never
  // sent to the client in the initial page payload. It's fetched on
  // demand via the reveal-phone API route, which logs the reveal.
  phoneMasked: string;
  email?: string;
  whatsappEnabled: boolean;
}

export interface ClassifiedListing {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ClassifiedCategory;
  subCategory?: string;
  price?: number;
  priceType: PriceType;
  currency: 'INR';
  location: {
    area: string;
    city: string;
    pincode?: string;
  };
  images: string[];
  condition?: ListingCondition;
  contact: ClassifiedContact;
  postedAt: string;
  expiresAt?: string;
  isVerified: boolean;
  isPremium: boolean;
  viewCount: number;
}
