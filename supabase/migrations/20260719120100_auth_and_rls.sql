-- Trichy Today — auth sync + row level security
-- Phone OTP auth creates rows in `auth.users`; this mirrors them into
-- `public.users` (our app-facing table with role/verification state).

create function handle_new_auth_user() returns trigger as $$
begin
  insert into public.users (id, phone, is_verified)
  values (new.id, new.phone, new.phone_confirmed_at is not null)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_auth_user();

-- Re-declare users.id to reference auth.users so ids line up 1:1.
alter table public.users
  add constraint users_id_fkey foreign key (id) references auth.users(id) on delete cascade;

-- ── Row Level Security ────────────────────────────────────────────
-- Server-side code (RSS worker, admin panel) uses the service_role key,
-- which bypasses RLS entirely — so policies below only govern what the
-- browser (anon/authenticated) can do directly via the Supabase client.

alter table users enable row level security;
alter table news_articles enable row level security;
alter table classified_listings enable row level security;
alter table company_ads enable row level security;
alter table rss_ingestion_log enable row level security;

create function is_editor_or_admin() returns boolean as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role in ('editor', 'admin')
  );
$$ language sql security definer stable;

-- users: read/update own row only
create policy "users read own row" on users
  for select using (auth.uid() = id);
create policy "users update own row" on users
  for update using (auth.uid() = id);

-- news_articles: public reads published only; editors/admins read + write everything
create policy "news_articles public read published" on news_articles
  for select using (status = 'published');
create policy "news_articles editor read all" on news_articles
  for select using (is_editor_or_admin());
create policy "news_articles editor write" on news_articles
  for insert with check (is_editor_or_admin());
create policy "news_articles editor update" on news_articles
  for update using (is_editor_or_admin());

-- classified_listings: public reads active only; posters manage their own; editors/admins manage all
create policy "classified_listings public read active" on classified_listings
  for select using (status = 'active');
create policy "classified_listings owner read own" on classified_listings
  for select using (auth.uid() = posted_by);
create policy "classified_listings owner insert" on classified_listings
  for insert with check (auth.uid() = posted_by);
create policy "classified_listings owner update" on classified_listings
  for update using (auth.uid() = posted_by or is_editor_or_admin());
create policy "classified_listings editor read all" on classified_listings
  for select using (is_editor_or_admin());

-- company_ads: public reads only currently-active campaigns; writes are admin-only (service role)
create policy "company_ads public read active" on company_ads
  for select using (
    is_active and current_date between start_date and end_date
  );
create policy "company_ads editor read all" on company_ads
  for select using (is_editor_or_admin());

-- rss_ingestion_log: no anon/authenticated access at all (service_role only, via bypass)
