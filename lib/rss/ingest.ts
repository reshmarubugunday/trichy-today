import Parser from 'rss-parser';
import { createAdminClient } from '@/lib/supabase/admin';
import { slugify, truncateText } from '@/lib/utils';
import { RSS_FEEDS, type RssFeedConfig } from '@/lib/rss/feeds';

type ItemWithMedia = Parser.Item & { mediaContent?: { $?: { url?: string } } };

const parser: Parser<unknown, ItemWithMedia> = new Parser({
  timeout: 15000,
  customFields: { item: [['media:content', 'mediaContent']] },
});

interface FeedResult {
  feed: string;
  fetched: number;
  inserted: number;
  errors: string[];
}

export async function ingestAllFeeds(): Promise<FeedResult[]> {
  return Promise.all(RSS_FEEDS.map(ingestFeed));
}

async function ingestFeed(feed: RssFeedConfig): Promise<FeedResult> {
  const result: FeedResult = { feed: feed.name, fetched: 0, inserted: 0, errors: [] };
  const supabase = createAdminClient();

  let items: ItemWithMedia[];
  try {
    items = (await parser.parseURL(feed.url)).items;
  } catch (err) {
    result.errors.push(`fetch/parse failed: ${(err as Error).message}`);
    return result;
  }
  result.fetched = items.length;

  for (const item of items) {
    const guid = item.guid ?? item.link;
    if (!guid || !item.title || !item.link) continue;

    // Atomic dedupe: only proceeds past this if the guid is genuinely new.
    const { data: logRow, error: logError } = await supabase
      .from('rss_ingestion_log')
      .upsert(
        { source_url: feed.url, item_guid: guid },
        { onConflict: 'item_guid', ignoreDuplicates: true }
      )
      .select()
      .maybeSingle();

    if (logError) {
      result.errors.push(`${item.title}: log upsert failed — ${logError.message}`);
      continue;
    }
    if (!logRow) continue; // already ingested

    // These feeds only ever include a title + link, no real body text — the
    // excerpt/body fall back to the title so nothing is stored blank; an
    // editor fills in the real content during moderation before publishing.
    const rawText = stripHtml(item.contentSnippet ?? item.content ?? '');
    const excerpt = truncateText(rawText, 280) || item.title;
    const slug = `${slugify(item.title)}-${guid.toString().slice(-8).replace(/[^a-z0-9]/gi, '')}`;

    const { error: insertError } = await supabase.from('news_articles').insert({
      slug,
      title: item.title,
      excerpt,
      body: rawText || excerpt,
      category: feed.category,
      hero_image_url: extractImageUrl(item),
      source_url: item.link,
      source_name: feed.name,
      status: 'pending_review',
    });

    if (insertError) {
      result.errors.push(`${item.title}: article insert failed — ${insertError.message}`);
      continue;
    }
    result.inserted++;
  }

  return result;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function extractImageUrl(item: ItemWithMedia): string | undefined {
  return item.enclosure?.url ?? item.mediaContent?.$?.url;
}
