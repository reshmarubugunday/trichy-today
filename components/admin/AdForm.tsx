import { Button } from '@/components/ui/Button';
import { AD_PLACEMENTS } from '@/lib/constants';
import { AdminAd } from '@/lib/admin/ads';

const inputCls =
  'mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30';
const labelCls = 'block text-sm font-medium text-text-primary';

interface AdFormProps {
  action: (formData: FormData) => void;
  ad?: AdminAd;
}

export function AdForm({ action, ad }: AdFormProps) {
  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="max-w-xl space-y-4">
      <div>
        <label className={labelCls} htmlFor="companyName">
          Company name
        </label>
        <input
          id="companyName"
          name="companyName"
          defaultValue={ad?.companyName}
          required
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls} htmlFor="tagline">
          Tagline
        </label>
        <input id="tagline" name="tagline" defaultValue={ad?.tagline ?? ''} className={inputCls} />
      </div>

      <div>
        <label className={labelCls} htmlFor="imageUrl">
          Image URL
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          defaultValue={ad?.imageUrl}
          required
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls} htmlFor="linkUrl">
          Link URL
        </label>
        <input id="linkUrl" name="linkUrl" defaultValue={ad?.linkUrl} required className={inputCls} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls} htmlFor="placement">
            Placement
          </label>
          <select id="placement" name="placement" defaultValue={ad?.placement} className={inputCls}>
            {AD_PLACEMENTS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="priority">
            Priority
          </label>
          <input
            id="priority"
            name="priority"
            type="number"
            defaultValue={ad?.priority ?? 0}
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls} htmlFor="startDate">
            Start date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={ad?.startDate ?? todayIso}
            required
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="endDate">
            End date
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            defaultValue={ad?.endDate}
            required
            className={inputCls}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-text-primary">
        <input type="checkbox" name="isActive" defaultChecked={ad?.isActive ?? true} />
        Active
      </label>

      <Button type="submit" variant="primary">
        Save
      </Button>
    </form>
  );
}
