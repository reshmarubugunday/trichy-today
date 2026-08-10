import { NextRequest, NextResponse } from 'next/server';
import { ingestAllFeeds } from '@/lib/rss/ingest';

// Manual/test trigger for the RSS worker — the real schedule is
// netlify/functions/rss-ingest-cron.mts. Requires a bearer token so this
// can't be used by anyone to spam-insert rows into news_articles.
export async function POST(request: NextRequest) {
  const secret = process.env.RSS_INGEST_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'RSS_INGEST_SECRET not configured' }, { status: 500 });
  }

  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results = await ingestAllFeeds();
  return NextResponse.json({ results });
}
