import type { NewsCategory } from '@/types/news';

export interface RssFeedConfig {
  name: string;
  url: string;
  category: NewsCategory;
}

// Per ROADMAP.md Phase 2 — Dinamalar and Dinakaran are on the target list
// but neither currently exposes a discoverable RSS feed; add them here once
// a working feed URL is confirmed.
export const RSS_FEEDS: RssFeedConfig[] = [
  {
    name: 'The Hindu – Tamil Nadu',
    url: 'https://www.thehindu.com/news/national/tamil-nadu/feeder/default.rss',
    category: 'local',
  },
  {
    name: 'Times of India – Chennai',
    url: 'https://timesofindia.indiatimes.com/rssfeeds/2950623.cms',
    category: 'local',
  },
];
