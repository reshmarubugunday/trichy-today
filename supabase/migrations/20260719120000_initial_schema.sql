-- Trichy Today — initial schema
-- Tables per ARCHITECTURE.md / ROADMAP.md Phase 1.

create extension if not exists pgcrypto;

-- ── Enums ──────────────────────────────────────────────────────────

create type user_role as enum ('user', 'editor', 'admin');

create type news_category as enum (
  'local', 'business', 'sports', 'politics', 'entertainment', 'education', 'health'
);
create type news_status as enum ('draft', 'pending_review', 'published', 'archived');

create type classified_category as enum (
  'jobs', 'real-estate', 'vehicles', 'electronics', 'services', 'matrimony', 'education', 'other'
);
create type listing_condition as enum ('new', 'like-new', 'good', 'fair', 'for-parts');
create type price_type as enum ('fixed', 'negotiable', 'free', 'on-request');
create type listing_status as enum ('pending', 'active', 'sold', 'expired', 'removed');

create type ad_placement as enum (
  'homepage-hero', 'header-leaderboard', 'sidebar-rectangle',
  'article-inline', 'classifieds-inline', 'footer-banner'
);

-- ── updated_at helper ─────────────────────────────────────────────

create function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ── users ─────────────────────────────────────────────────────────

create table users (
  id uuid primary key default gen_random_uuid(),
  phone varchar(15) unique,
  email varchar,
  name varchar,
  is_verified boolean not null default false,
  role user_role not null default 'user',
  created_at timestamptz not null default now()
);

-- ── news_articles ─────────────────────────────────────────────────

create table news_articles (
  id uuid primary key default gen_random_uuid(),
  slug varchar unique not null,
  title varchar not null,
  title_tamil varchar,
  excerpt text not null,
  body text not null,
  category news_category not null,
  tags text[] not null default '{}',
  hero_image_url varchar,
  author_id uuid references users(id) on delete set null,
  source_url varchar,
  source_name varchar,
  status news_status not null default 'draft',
  is_featured boolean not null default false,
  is_breaking boolean not null default false,
  view_count integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    to_tsvector('english',
      coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(body, '')
    )
  ) stored
);

create index news_articles_status_idx on news_articles (status);
create index news_articles_category_idx on news_articles (category);
create index news_articles_published_at_idx on news_articles (published_at desc);
create index news_articles_search_idx on news_articles using gin (search_vector);

create trigger news_articles_set_updated_at
  before update on news_articles
  for each row execute function set_updated_at();

-- ── classified_listings ───────────────────────────────────────────

create table classified_listings (
  id uuid primary key default gen_random_uuid(),
  slug varchar unique not null,
  title varchar not null,
  description text not null,
  category classified_category not null,
  sub_category varchar,
  price numeric,
  price_type price_type not null default 'negotiable',
  area varchar not null,
  pincode varchar(6),
  images text[] not null default '{}',
  condition listing_condition,
  contact_name varchar not null,
  contact_phone varchar not null,
  contact_email varchar,
  whatsapp_enabled boolean not null default false,
  posted_by uuid references users(id) on delete set null,
  status listing_status not null default 'pending',
  is_verified boolean not null default false,
  is_premium boolean not null default false,
  view_count integer not null default 0,
  expires_at timestamptz,
  posted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
  ) stored
);

create index classified_listings_status_idx on classified_listings (status);
create index classified_listings_category_idx on classified_listings (category);
create index classified_listings_area_idx on classified_listings (area);
create index classified_listings_expires_at_idx on classified_listings (expires_at);
create index classified_listings_search_idx on classified_listings using gin (search_vector);

create trigger classified_listings_set_updated_at
  before update on classified_listings
  for each row execute function set_updated_at();

-- ── company_ads ───────────────────────────────────────────────────

create table company_ads (
  id uuid primary key default gen_random_uuid(),
  company_name varchar not null,
  tagline varchar,
  image_url varchar not null,
  link_url varchar not null,
  placement ad_placement not null,
  is_active boolean not null default true,
  priority integer not null default 0,
  start_date date not null,
  end_date date not null,
  impression_count integer not null default 0,
  click_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index company_ads_placement_idx on company_ads (placement);
create index company_ads_active_idx on company_ads (is_active);

-- ── rss_ingestion_log ─────────────────────────────────────────────

create table rss_ingestion_log (
  id uuid primary key default gen_random_uuid(),
  source_url varchar not null,
  item_guid varchar unique not null,
  ingested_at timestamptz not null default now()
);
