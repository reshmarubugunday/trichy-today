import { AdForm } from '@/components/admin/AdForm';
import { createAd } from '@/lib/admin/adsActions';

export default function NewAdPage() {
  return <AdForm action={createAd} />;
}
