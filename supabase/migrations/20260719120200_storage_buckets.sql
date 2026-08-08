-- Trichy Today — storage buckets
-- Two public-read buckets, one per vertical (per ARCHITECTURE.md: same
-- bucket pattern, different folders/policies). Uploads are always
-- server-mediated (service role) after moderation, so no anon/authenticated
-- insert policy is needed yet — only public read.

insert into storage.buckets (id, name, public)
values
  ('news-images', 'news-images', true),
  ('classified-images', 'classified-images', true)
on conflict (id) do nothing;

create policy "news-images public read" on storage.objects
  for select using (bucket_id = 'news-images');

create policy "classified-images public read" on storage.objects
  for select using (bucket_id = 'classified-images');

-- Authenticated users may upload into their own folder, named by their
-- user id, e.g. classified-images/<user_id>/photo.jpg — enforced by
-- checking the first path segment against auth.uid().
create policy "classified-images owner upload" on storage.objects
  for insert with check (
    bucket_id = 'classified-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "classified-images owner delete" on storage.objects
  for delete using (
    bucket_id = 'classified-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
