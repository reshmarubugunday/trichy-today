import { notFound } from 'next/navigation';
import { getListingByIdAdmin } from '@/lib/admin/classifieds';
import { updateListing } from '@/lib/admin/classifiedsActions';
import { Button } from '@/components/ui/Button';
import { CLASSIFIED_CATEGORIES, TRICHY_AREAS } from '@/lib/constants';

const STATUSES = ['pending', 'active', 'sold', 'expired', 'removed'] as const;
const CONDITIONS = ['new', 'like-new', 'good', 'fair', 'for-parts'] as const;

const inputCls =
  'mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30';
const labelCls = 'block text-sm font-medium text-text-primary';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: Props) {
  const { id } = await params;
  const listing = await getListingByIdAdmin(id);
  if (!listing) notFound();

  return (
    <form action={updateListing.bind(null, listing.id)} className="max-w-2xl space-y-4">
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
          <input
            id="price"
            name="price"
            type="number"
            defaultValue={listing.price ?? ''}
            className={inputCls}
          />
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls} htmlFor="status">
            Status
          </label>
          <select id="status" name="status" defaultValue={listing.status} className={inputCls}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-6 pb-2.5">
          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input type="checkbox" name="whatsappEnabled" defaultChecked={listing.whatsappEnabled} />
            WhatsApp enabled
          </label>
          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input type="checkbox" name="isVerified" defaultChecked={listing.isVerified} />
            Verified
          </label>
        </div>
      </div>

      <Button type="submit" variant="primary">
        Save
      </Button>
    </form>
  );
}
