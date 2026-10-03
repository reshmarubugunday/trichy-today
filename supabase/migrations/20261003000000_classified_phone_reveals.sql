-- Trichy Today — log classified listing phone number reveals
-- Phase 3: phone numbers are masked in the UI (e.g. "●●●● ●●●● 34") and the
-- full number is only ever returned by the reveal-phone API route, which
-- logs every reveal here for audit/abuse purposes.

create table classified_phone_reveals (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references classified_listings(id) on delete cascade,
  viewer_id uuid references users(id) on delete set null,
  revealed_at timestamptz not null default now()
);

create index classified_phone_reveals_listing_id_idx on classified_phone_reveals (listing_id);

-- No anon/authenticated access at all — only the reveal-phone API route
-- (service_role, via bypass) writes here, same as rss_ingestion_log.
alter table classified_phone_reveals enable row level security;
