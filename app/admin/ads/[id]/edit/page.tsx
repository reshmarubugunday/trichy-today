import { notFound } from 'next/navigation';
import { AdForm } from '@/components/admin/AdForm';
import { getAdByIdAdmin } from '@/lib/admin/ads';
import { updateAd } from '@/lib/admin/adsActions';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAdPage({ params }: Props) {
  const { id } = await params;
  const ad = await getAdByIdAdmin(id);
  if (!ad) notFound();

  return <AdForm action={updateAd.bind(null, ad.id)} ad={ad} />;
}
