'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { requireEditor } from '@/lib/auth/getCurrentUser';
import { slugify } from '@/lib/utils';
import { NewsCategory } from '@/types/news';

function revalidatePublicPaths() {
  revalidatePath('/');
  revalidatePath('/news');
  revalidatePath('/admin/moderation');
  revalidatePath('/admin/news');
}

export async function publishArticle(id: string) {
  await requireEditor();
  const supabase = await createClient();
  await supabase
    .from('news_articles')
    .update({ status: 'published', published_at: new Date().toISOString() })
    .eq('id', id);
  revalidatePublicPaths();
}

export async function archiveArticle(id: string) {
  await requireEditor();
  const supabase = await createClient();
  await supabase.from('news_articles').update({ status: 'archived' }).eq('id', id);
  revalidatePublicPaths();
}

export async function updateArticle(id: string, formData: FormData) {
  await requireEditor();
  const supabase = await createClient();

  const title = String(formData.get('title') ?? '').trim();
  const status = String(formData.get('status') ?? 'draft');

  // Only stamp published_at the first time an article becomes published —
  // re-saving an already-published article (or archiving it later) must not
  // reset its date and jump it to the top of every published_at-ordered list.
  const { data: existing } = await supabase
    .from('news_articles')
    .select('published_at')
    .eq('id', id)
    .maybeSingle();
  const publishedAt =
    status === 'published' && !existing?.published_at
      ? new Date().toISOString()
      : (existing?.published_at ?? null);

  await supabase
    .from('news_articles')
    .update({
      title,
      slug: slugify(title),
      title_tamil: String(formData.get('titleTamil') ?? '').trim() || null,
      excerpt: String(formData.get('excerpt') ?? '').trim(),
      body: String(formData.get('body') ?? '').trim(),
      category: String(formData.get('category') ?? '') as NewsCategory,
      hero_image_url: String(formData.get('heroImageUrl') ?? '').trim() || null,
      is_featured: formData.get('isFeatured') === 'on',
      is_breaking: formData.get('isBreaking') === 'on',
      status,
      published_at: publishedAt,
    })
    .eq('id', id);

  revalidatePublicPaths();
  redirect('/admin/news');
}
