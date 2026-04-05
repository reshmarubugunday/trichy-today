import { CompanyAd } from '@/types/ads';
import Link from 'next/link';
import Image from 'next/image';

interface SponsoredBannerProps {
  ad: CompanyAd;
  variant?: 'leaderboard' | 'billboard' | 'sidebar';
}

export function SponsoredBanner({ ad, variant = 'billboard' }: SponsoredBannerProps) {
  const heightClass = {
    leaderboard: 'h-20',
    billboard: 'h-32 md:h-44',
    sidebar: 'h-52',
  }[variant];

  return (
    <div className="my-4">
      <p className="text-[10px] text-gray-400 uppercase tracking-widest text-right mb-1">
        Advertisement
      </p>
      <Link
        href={ad.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`block relative w-full ${heightClass} rounded-lg overflow-hidden group`}
      >
        <Image
          src={ad.imageUrl}
          alt={ad.companyName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div
          className="absolute inset-0 flex flex-col justify-end p-4"
          style={{ background: `linear-gradient(to top, ${ad.bgColor ?? '#000'}cc, transparent)` }}
        >
          <p className="text-white font-bold text-lg leading-tight">{ad.companyName}</p>
          {ad.tagline && (
            <p className="text-white/80 text-sm mt-0.5">{ad.tagline}</p>
          )}
        </div>
      </Link>
    </div>
  );
}
