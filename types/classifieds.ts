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
  phone?: string;
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
