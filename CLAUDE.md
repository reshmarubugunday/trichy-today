@AGENTS.md

# Trichy Today

News and classifieds website for Trichy (Tiruchirappalli), Tamil Nadu. Local community portal for residents — news, classifieds, and company ads. Inspired by indiansinkuwait.com but with a cleaner, modern UX.

## Tech Stack

- **Framework:** Next.js 16 App Router, TypeScript
- **Styling:** Tailwind CSS v4 — configured via `@theme` in `app/globals.css`. There is no `tailwind.config.ts`. Do not create one.
- **Icons:** lucide-react
- **Images:** `next/image`, remote images from `images.unsplash.com` allowed in `next.config.ts`
- **Fonts:** Inter (via `next/font/google`)

## Project Structure

```
app/                        # Next.js App Router pages
  layout.tsx                # Root layout — Header + Footer
  page.tsx                  # Homepage
  news/[category]/[slug]/   # Article detail
  classifieds/[category]/[id]/  # Listing detail
  post/classified/          # 3-step post-an-ad wizard
  post/news/                # Submit news form

components/
  layout/                   # Header, Footer, BreakingNewsTicker
  news/                     # NewsCard (sizes: hero, large, medium, small)
  classifieds/              # ClassifiedCard, ClassifiedCategoryGrid
  ads/                      # SponsoredBanner
  forms/                    # PostClassifiedForm (multi-step)
  ui/                       # Badge, Button, SectionHeader, SearchBar

lib/
  mock-data/                # news.ts, classifieds.ts, ads.ts — all current data
  data/                     # getNews.ts, getClassifieds.ts, getAds.ts — async data access layer
  constants.ts              # NEWS_CATEGORIES, CLASSIFIED_CATEGORIES, TRICHY_AREAS
  utils.ts                  # formatDate, formatPrice, truncateText, slugify

types/
  news.ts                   # NewsArticle, NewsCategory
  classifieds.ts            # ClassifiedListing, ClassifiedCategory
  ads.ts                    # CompanyAd, AdPlacement
```

## Design Tokens

Defined in `app/globals.css` under `@theme`. Use Tailwind utility classes — do not hardcode hex values.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#C8102E` | Buttons, links, accents |
| `--color-primary-dark` | `#9B0C23` | Hover states |
| `--color-accent` | `#F5A623` | Secondary highlights, premium badges |
| `--color-background` | `#FAFAF8` | Page background |
| `--color-text-primary` | `#1A1A1A` | Body text |
| `--color-text-secondary` | `#6B7280` | Meta text, captions |
| `--color-border` | `#E5E7EB` | Card borders, dividers |

## Data Layer

All data is currently **mock** — hardcoded arrays in `lib/mock-data/`. The functions in `lib/data/` wrap them as `async` functions so switching to a real database (Supabase) only requires changing those files. Pages and components do not need to change.

**Do not** add a real database until Phase 1 of `ROADMAP.md` is started.

When adding new data needs, follow this pattern:
1. Add types to `types/`
2. Add mock data to `lib/mock-data/`
3. Add async accessor functions to `lib/data/`
4. Use those functions in server components

## Key Conventions

- **Server components by default.** Only add `'use client'` when the component needs state, effects, or browser APIs (forms, mobile nav, etc.)
- **No hardcoded colors.** Use Tailwind classes that map to CSS variables (`text-primary`, `bg-accent`, `border-border`).
- **Images always via `next/image`** with `fill` + a positioned parent for responsive images.
- **Ads are always labeled.** The `SponsoredBanner` component renders "Advertisement" above every ad. Do not remove this.
- **Phone numbers are sensitive.** Never render a full phone number in HTML. In the listing detail page, the number should be masked and revealed via API call only. (Not yet implemented — tracked in ROADMAP Phase 3.)
- **Do not over-engineer.** Follow the roadmap phases. Don't add features that belong to a later phase.

## Roadmap

See `ROADMAP.md` for the full 8-phase plan. Current status: **Phase 0 complete** (frontend with mock data).

**Next:** Phase 1 — Supabase DB, phone OTP auth, image storage, replace mock data.

## Running Locally

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build check
npx tsc --noEmit  # type check only
```

## Trichy Context

- **Areas:** Srirangam, Woraiyur, Ariyamangalam, Thillai Nagar, KK Nagar, Tennur, Cantonment, Teppakulam, Puthur, Golden Rock, Ponmalai
- **Key landmarks in content:** Rockfort / Ucchi Pillayar Temple, Srirangam, Grand Anicut (Kallanai), BHEL Trichy, NIT-T, Mahatma Gandhi Memorial Hospital, VOC Park
- **Languages:** English primary, Tamil secondary (`title_tamil` field on NewsArticle)
- **Payment gateway for India:** Razorpay (to be integrated in Phase 4)
- **SMS provider for India:** MSG91 (to be integrated in Phase 6)
