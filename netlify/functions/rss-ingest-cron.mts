import type { Config } from '@netlify/functions';
import { ingestAllFeeds } from '../../lib/rss/ingest';

async function handler() {
  const results = await ingestAllFeeds();
  for (const r of results) {
    console.log(`[rss-ingest] ${r.feed}: fetched ${r.fetched}, inserted ${r.inserted}`);
    for (const err of r.errors) console.error(`[rss-ingest] ${r.feed}: ${err}`);
  }
}

export default handler;

export const config: Config = {
  schedule: '*/30 * * * *',
};
