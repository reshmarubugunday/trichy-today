# Trichy Today – Production Roadmap

## Current State
Frontend only, mock data, no users, no backend, not deployed.

---

## Phase 1 — Foundation
> Nothing else works without these.

- [ ] **Database setup** — Supabase project, run schema migrations (news, classifieds, ads, users tables)
- [ ] **Authentication** — Email OTP login via Supabase Auth (built-in email sending, no SMS provider)
- [ ] **Image storage** — Supabase Storage buckets for classified images and news hero images
- [ ] **Environment config** — `.env.local` for secrets, Supabase keys, etc.
- [ ] **Replace mock data** — Swap `lib/data/` functions to hit Supabase instead of in-memory arrays

---

## Phase 2 — Admin & Content
> You need a way to manage content before you can go live.

- [ ] **Admin panel** — Protected `/admin` route (editor/admin roles only)
  - News article editor (create, edit, publish, archive)
  - Classifieds moderation queue (approve / reject listings)
  - Ad campaign manager (create ads, set dates, placement)
- [ ] **RSS ingestion worker** — Cron job that pulls from 3–5 Tamil Nadu news RSS feeds, deduplicates, puts articles into moderation queue
- [ ] **Image upload** — Wire up the classified post form to actually upload photos to Storage

---

## Phase 3 — Core User Flows
> The two things users come to do: read news and post/browse classifieds.

- [ ] **Classified post flow** — End-to-end: user logs in → posts ad with images → goes to pending → approved → live → expires after 60 days
- [ ] **Phone number masking** — Show `●●●● ●●●● 34` in UI, reveal full number only via API call (logged)
- [ ] **Search** — Full-text search across news and classifieds (Postgres `tsvector`)
- [ ] **Classifieds filters** — Price range, area, condition, sort by date/price
- [ ] **My Listings page** — Logged-in user can see, edit, renew, or delete their own listings

---

## Phase 4 — Monetization
> How the site makes money.

- [ ] **Premium listings** — Paid boosted classifieds (highlighted, shown first) via Razorpay
- [ ] **Ad billing** — Invoice generation for company ad campaigns (PDF invoice + Razorpay or bank transfer)
- [ ] **Listing renewal** — User pays to extend an active listing by 30 or 60 days

---

## Phase 5 — SEO & Performance
> Critical for a news site — Google is the main traffic source.

- [ ] **Sitemap** — Auto-generated `/sitemap.xml` listing all news articles and classifieds
- [ ] **Structured data** — `schema.org` JSON-LD for `NewsArticle` and `ItemPage` (classifieds) for Google rich results
- [ ] **ISR caching strategy** — News pages revalidate every 5 min, classifieds on-demand, homepage every 2 min
- [ ] **OG images** — Dynamic Open Graph images per article so WhatsApp/Facebook share previews look good
- [ ] **Core Web Vitals** — LCP, CLS audit; primarily image optimization (already using `next/image`)

---

## Phase 6 — Notifications & Engagement

- [ ] **SMS notifications** via MSG91 — listing live confirmation, "50 people viewed your ad", expiry reminders
- [ ] **Transactional email** via Resend or SendGrid — listing confirmation, weekly digest for subscribers
- [ ] **WhatsApp Business API** — listing confirmations and alerts (high-impact in India, optional)

---

## Phase 7 — Deployment & Operations

- [ ] **Deploy to Vercel** — Connect GitHub repo, set env vars, custom domain
- [ ] **Domain + SSL** — `trichytoday.in` or `.com`, Cloudflare for DNS + free CDN
- [ ] **Error monitoring** — Sentry (free tier)
- [ ] **Analytics** — Plausible or PostHog (privacy-friendly, no cookie banner needed)
- [ ] **Uptime monitoring** — UptimeRobot (free), SMS alert if site goes down

---

## Phase 8 — Legal & Trust
> Required before going public.

- [ ] **Privacy Policy** — Covers data collected, phone numbers, how ads work
- [ ] **Terms of Use** — Prohibited items, liability disclaimer for classifieds
- [ ] **IT Act compliance** — Grievance officer contact (required under IT Rules 2021)
- [ ] **Content moderation policy** — What gets removed and why (scams, fake news, hate speech)

---

## Dependency Order

```
Phase 1 (DB + Auth + Storage)
    └─→ Phase 2 (Admin needs auth; RSS ingestion needs DB)
            └─→ Phase 3 (User flows need auth + DB + storage)
                    └─→ Phase 4 (Monetization needs user accounts)

Phase 5 (SEO)           ── can run in parallel with Phase 3
Phase 6 (Notifications) ── needs Phase 3 complete
Phase 7 (Deploy)        ── deploy early for staging; finalize after Phase 3
Phase 8 (Legal)         ── draft in parallel; must complete before public launch
```

---

## Effort & Risk Assessment

| Item | Effort | Risk |
|------|--------|------|
| Supabase setup + data migration | Low | Low |
| Email OTP auth | Low | Low — Supabase handles all of it, no SMS provider needed |
| Admin panel | High | Medium — lots of UI to build |
| RSS ingestion worker | Medium | Medium — feed quality varies |
| Razorpay integration | Medium | Low |
| SEO / structured data | Low | Low |
| Legal compliance | Low effort | High if skipped |

---

## Database Schema (reference)

```sql
users (
  id uuid PK,
  phone varchar(15) UNIQUE,   -- optional, plain contact field, not auth
  email varchar,              -- OTP verified, primary login identifier
  name varchar,
  is_verified boolean,
  role enum('user', 'editor', 'admin'),
  created_at timestamptz
)

news_articles (
  id uuid PK,
  slug varchar UNIQUE,
  title varchar,
  title_tamil varchar,
  excerpt text,
  body text,
  category enum('local','business','sports','politics','entertainment','education','health'),
  tags text[],
  hero_image_url varchar,
  author_id uuid → users,
  source_url varchar,         -- if ingested from RSS
  source_name varchar,        -- 'The Hindu', 'Dinamalar', etc.
  status enum('draft','pending_review','published','archived'),
  is_featured boolean,
  is_breaking boolean,
  view_count integer DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz,
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', title || ' ' || excerpt)
  ) STORED
)

classified_listings (
  id uuid PK,
  slug varchar UNIQUE,
  title varchar,
  description text,
  category enum('jobs','real-estate','vehicles','electronics','services','matrimony','education','other'),
  sub_category varchar,
  price numeric,
  price_type enum('fixed','negotiable','free','on-request'),
  area varchar,
  pincode varchar(6),
  images text[],              -- Supabase Storage URLs
  condition enum('new','like-new','good','fair','for-parts'),
  contact_name varchar,
  contact_phone varchar,      -- masked in UI, revealed via API
  contact_email varchar,
  whatsapp_enabled boolean,
  posted_by uuid → users,
  status enum('pending','active','sold','expired','removed'),
  is_verified boolean DEFAULT false,
  is_premium boolean DEFAULT false,
  view_count integer DEFAULT 0,
  expires_at timestamptz,     -- posted_at + 60 days
  posted_at timestamptz
)

company_ads (
  id uuid PK,
  company_name varchar,
  tagline varchar,
  image_url varchar,
  link_url varchar,
  placement enum('homepage-hero','header-leaderboard','sidebar-rectangle','article-inline','classifieds-inline','footer-banner'),
  is_active boolean,
  priority integer,
  start_date date,
  end_date date,
  impression_count integer DEFAULT 0,
  click_count integer DEFAULT 0
)

rss_ingestion_log (
  id uuid PK,
  source_url varchar,
  item_guid varchar UNIQUE,   -- RSS <guid>, used for deduplication
  ingested_at timestamptz
)
```

---

## News Data Sources

| Source | Language | Feed type | Pull frequency |
|--------|----------|-----------|----------------|
| The Hindu – Tamil Nadu | English | RSS | Every 30 min |
| Times of India – Chennai | English | RSS | Every 30 min |
| Dinamalar | Tamil | RSS | Every 30 min |
| Dinakaran | Tamil | RSS | Every 30 min |
| TN Government press releases | English | RSS / scrape | Every 60 min |
| Trichy Corporation | English | Scrape | Every 60 min |
| Breaking / editorial | — | Manual (admin) | On publish |
| User submitted | — | Form → queue | Real-time |
