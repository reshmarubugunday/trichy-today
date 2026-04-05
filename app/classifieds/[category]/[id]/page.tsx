import { getListingById, getListingsByCategory } from '@/lib/data/getClassifieds';
import { getTopAd } from '@/lib/data/getAds';
import { ClassifiedCard } from '@/components/classifieds/ClassifiedCard';
import { SponsoredBanner } from '@/components/ads/SponsoredBanner';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { CLASSIFIED_CATEGORIES } from '@/lib/constants';
import { ClassifiedCategory } from '@/types/classifieds';
import { formatPrice, formatDate, categoryLabel } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Calendar, Eye, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ category: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) return { title: 'Listing Not Found' };
  return { title: listing.title, description: listing.description.slice(0, 160) };
}

export default async function ClassifiedDetailPage({ params }: Props) {
  const { id, category } = await params;
  const [listing, ad] = await Promise.all([
    getListingById(id),
    getTopAd('sidebar-rectangle'),
  ]);

  if (!listing) notFound();

  const { listings: related } = await getListingsByCategory(listing.category as ClassifiedCategory);
  const relatedFiltered = related.filter((l) => l.id !== listing.id).slice(0, 4);

  const catInfo = CLASSIFIED_CATEGORIES.find((c) => c.value === listing.category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-text-secondary mb-4 flex items-center gap-2">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>›</span>
        <Link href="/classifieds" className="hover:text-primary">Classifieds</Link>
        <span>›</span>
        <Link href={`/classifieds/${listing.category}`} className="hover:text-primary">{catInfo?.label}</Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2">
          {/* Image gallery */}
          {listing.images.length > 0 ? (
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-5">
              <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" priority />
              {listing.isPremium && (
                <div className="absolute top-3 left-3">
                  <Badge label="Premium" variant="premium" />
                </div>
              )}
            </div>
          ) : (
            <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl flex items-center justify-center mb-5">
              <span className="text-text-secondary text-sm">No image provided</span>
            </div>
          )}

          {/* Additional images */}
          {listing.images.length > 1 && (
            <div className="flex gap-3 mb-5 overflow-x-auto pb-1">
              {listing.images.slice(1).map((img, i) => (
                <div key={i} className="relative w-24 h-20 shrink-0 rounded-lg overflow-hidden">
                  <Image src={img} alt={`${listing.title} ${i + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge label={catInfo?.label ?? listing.category} variant="category" category={listing.category} />
            {listing.subCategory && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{listing.subCategory}</span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-text-primary mb-3">{listing.title}</h1>

          {/* Price */}
          <div className="mb-4">
            {listing.priceType === 'free' ? (
              <span className="text-2xl font-bold text-green-600">Free</span>
            ) : listing.priceType === 'on-request' ? (
              <span className="text-lg text-text-secondary">Price on Request</span>
            ) : listing.price ? (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">{formatPrice(listing.price)}</span>
                {listing.priceType === 'negotiable' && (
                  <span className="text-sm text-text-secondary">Negotiable</span>
                )}
              </div>
            ) : null}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-5 py-3 border-t border-b border-border">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> {listing.location.area}, {listing.location.city}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {formatDate(listing.postedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> {listing.viewCount.toLocaleString()} views
            </span>
            {listing.isVerified && (
              <span className="flex items-center gap-1.5 text-green-600 font-medium">
                <CheckCircle className="w-4 h-4" /> Verified Listing
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-base font-semibold text-text-primary mb-2">Description</h2>
            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>

          {ad && <SponsoredBanner ad={ad} variant="billboard" />}

          {/* Related */}
          {relatedFiltered.length > 0 && (
            <div className="mt-6">
              <SectionHeader title={`More ${catInfo?.label} Listings`} href={`/classifieds/${listing.category}`} />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedFiltered.map((l) => (
                  <ClassifiedCard key={l.id} listing={l} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar – Contact */}
        <aside className="lg:col-span-1">
          <div className="bg-white border border-border rounded-xl p-5 sticky top-24">
            <h3 className="text-base font-semibold text-text-primary mb-1">Contact Seller</h3>
            <p className="text-sm text-text-secondary mb-4">{listing.contact.name}</p>

            {listing.contact.phone ? (
              <Button
                href={`tel:${listing.contact.phone}`}
                variant="primary"
                fullWidth
                className="mb-3"
              >
                <Phone className="w-4 h-4 mr-2" />
                Show Phone Number
              </Button>
            ) : null}

            {listing.contact.whatsappEnabled && listing.contact.phone && (
              <Button
                href={`https://wa.me/${listing.contact.phone.replace(/\D/g, '')}`}
                variant="secondary"
                fullWidth
                className="mb-3"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat on WhatsApp
              </Button>
            )}

            {listing.contact.email && (
              <Button
                href={`mailto:${listing.contact.email}`}
                variant="ghost"
                fullWidth
              >
                Send Email
              </Button>
            )}

            <p className="text-[10px] text-text-secondary mt-4 leading-relaxed">
              Always meet in a safe, public place. Verify identity before any transaction.
              Trichy Today is not responsible for transactions between buyers and sellers.
            </p>
          </div>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <p className="font-medium mb-1">⚠️ Safety Tip</p>
            <p className="text-xs">Beware of advance payment requests. Never share your OTP or banking details.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
