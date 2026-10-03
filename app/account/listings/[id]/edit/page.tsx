import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { getMyListingById } from '@/lib/classifieds/myListings';
import { updateMyListing } from '@/lib/classifieds/myListingsActions';
import { Button } from '@/components/ui/Button';
import { CLASSIFIED_CATEGORIES, TRICHY_AREAS } from '@/lib/constants';

const CONDITIONS = ['new', 'like-new', 'good', 'fair', 'for-parts'] as const;

const inputCls =
  'mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30';
const labelCls = 'block text-sm font-medium text-text-primary';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditMyListingPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/account/listings/${id}/edit`);

  const listing = await getMyListingById(id, user.id);
  if (!listing) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-2 text-2xl font-semibold text-text-primary">Edit Listing</h1>
      <p className="mb-6 text-sm text-text-secondary">
        Saving sends this listing back for moderation — it won&apos;t be visible to buyers again until an
        editor reviews the changes.
      </p>

      <form action={updateMyListing.bind(null, listing.id)} className="space-y-4">
        {listing.images.length > 0 && (
          <div>
            <p className={labelCls}>Photos</p>
            <div className="mt-2 grid grid-cols-4 gap-3">
              {listing.images.map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={url} src={url} alt="" className="aspect-square rounded-lg object-cover border border-border" />
              ))}
            </div>
          </div>
        )}

        <div>
          <label className={labelCls} htmlFor="title">
            Title
          </label>
          <input id="title" name="title" defaultValue={listing.title} required className={inputCls} />
        </div>

        <div>
          <label className={labelCls} htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={listing.description}
            rows={5}
            required
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} htmlFor="category">
              Category
            </label>
            <select id="category" name="category" defaultValue={listing.category} className={inputCls}>
              {CLASSIFIED_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="subCategory">
              Sub-category
            </label>
            <input id="subCategory" name="subCategory" defaultValue={listing.subCategory ?? ''} className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} htmlFor="priceType">
              Price Type
            </label>
            <select id="priceType" name="priceType" defaultValue={listing.priceType} className={inputCls}>
              <option value="fixed">Fixed Price</option>
              <option value="negotiable">Negotiable</option>
              <option value="free">Free</option>
              <option value="on-request">On Request</option>
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="price">
              Price (₹)
            </label>
            <input id="price" name="price" type="number" defaultValue={listing.price ?? ''} className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} htmlFor="area">
              Area
            </label>
            <select id="area" name="area" defaultValue={listing.area} className={inputCls}>
              {TRICHY_AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="condition">
              Condition
            </label>
            <select id="condition" name="condition" defaultValue={listing.condition ?? ''} className={inputCls}>
              <option value="">Not specified</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls} htmlFor="contactName">
            Contact Name
          </label>
          <input id="contactName" name="contactName" defaultValue={listing.contactName} required className={inputCls} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} htmlFor="contactPhone">
              Contact Phone
            </label>
            <input
              id="contactPhone"
              name="contactPhone"
              defaultValue={listing.contactPhone}
              required
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="contactEmail">
              Contact Email
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={listing.contactEmail ?? ''}
              className={inputCls}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-text-primary">
          <input type="checkbox" name="whatsappEnabled" defaultChecked={listing.whatsappEnabled} />
          WhatsApp enabled
        </label>

        <div className="flex gap-3">
          <Button type="submit" variant="primary">
            Save changes
          </Button>
          <Button href="/account/listings" variant="ghost">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
