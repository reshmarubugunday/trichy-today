'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireEditor } from '@/lib/auth/getCurrentUser';

function revalidatePublicPaths() {
  revalidatePath('/');
  revalidatePath('/classifieds');
  revalidatePath('/admin/moderation');
}

export async function approveListing(id: string) {
  await requireEditor();
  const supabase = await createClient();
  await supabase.from('classified_listings').update({ status: 'active' }).eq('id', id);
  revalidatePublicPaths();
}

export async function rejectListing(id: string) {
  await requireEditor();
  const supabase = await createClient();
  await supabase.from('classified_listings').update({ status: 'removed' }).eq('id', id);
  revalidatePublicPaths();
}
