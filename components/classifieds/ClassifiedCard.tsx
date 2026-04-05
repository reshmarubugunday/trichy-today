import { ClassifiedListing } from '@/types/classifieds';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Eye } from 'lucide-react';
import { formatPrice, formatRelativeTime } from '@/lib/utils';

interface ClassifiedCardProps {
  listing: ClassifiedListing;
  variant?: 'card' | 'row';
}

const placeholderImg = 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&q=60';

export function ClassifiedCard({ listing, variant = 'card' }: ClassifiedCardProps) {
  const href = `/classifieds/${listing.category}/${listing.id}`;
  const image = listing.images[0] ?? placeholderImg;

  if (variant === 'row') {
    return (
      <Link href={href} className="group flex items-center gap-4 p-3 rounded-lg border border-border bg-white hover:shadow-sm hover:border-primary/30 transition-all">
        <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden">
          <Image src={image} alt={listing.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-text-primary line-clamp-1 group-hover:text-primary transition-colors">
            {listing.title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            {listing.priceType === 'free' ? (
              <span className="text-sm font-bold text-green-600">Free</span>
            ) : listing.priceType === 'on-request' ? (
              <span className="text-sm text-text-secondary">On Request</span>
            ) : listing.price ? (
              <span className="text-sm font-bold text-primary">{formatPrice(listing.price)}</span>
            ) : null}
            <span className="text-gray-300">·</span>
            <span className="text-xs text-text-secondary flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {listing.location.area}
            </span>
          </div>
        </div>
        <span className="text-xs text-text-secondary shrink-0">{formatRelativeTime(listing.postedAt)}</span>
      </Link>
    );
  }

  return (
    <Link href={href} className="group block bg-white rounded-xl overflow-hidden border border-border hover:shadow-md hover:border-primary/20 transition-all duration-200">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={image} alt={listing.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        {listing.isPremium && (
          <div className="absolute top-2 left-2">
            <Badge label="Premium" variant="premium" />
          </div>
        )}
        {listing.images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
            +{listing.images.length - 1} photos
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-text-primary leading-snug group-hover:text-primary transition-colors line-clamp-2 flex-1">
            {listing.title}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-2">
          {listing.priceType === 'free' ? (
            <span className="text-base font-bold text-green-600">Free</span>
          ) : listing.priceType === 'on-request' ? (
            <span className="text-sm text-text-secondary italic">On Request</span>
          ) : listing.price ? (
            <div>
              <span className="text-base font-bold text-primary">{formatPrice(listing.price)}</span>
              {listing.priceType === 'negotiable' && (
                <span className="text-xs text-text-secondary ml-1">Neg.</span>
              )}
            </div>
          ) : (
            <span className="text-sm text-text-secondary">Price N/A</span>
          )}
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {listing.location.area}
          </span>
          <div className="flex items-center gap-2">
            {listing.isVerified && (
              <span className="text-green-600 font-medium">✓ Verified</span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {listing.viewCount}
            </span>
          </div>
        </div>
        <p className="text-xs text-text-secondary mt-1">{formatRelativeTime(listing.postedAt)}</p>
      </div>
    </Link>
  );
}
