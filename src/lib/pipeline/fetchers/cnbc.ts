import Parser from 'rss-parser';
import { NewsItem } from '../types';

const parser = new Parser();

export async function fetchCnbc(): Promise<{ items: NewsItem[]; urls: string[] }> {
  const feeds = [
    { name: 'CNBC Finance', url: 'https://search.cnbc.com/rs/search/view.xml?partnerId=2000&keywords=finance' },
    { name: 'CNBC Investing', url: 'https://www.cnbc.com/id/15839069/device/rss/rss.html' },
    { name: 'CNBC World', url: 'https://www.cnbc.com/id/100727362/device/rss/rss.html' },
    { name: 'CNBC Business', url: 'https://www.cnbc.com/id/10001147/device/rss/rss.html' },
    { name: 'CNBC Tech', url: 'https://www.cnbc.com/id/19854910/device/rss/rss.html' },
    { name: 'CNBC Economy', url: 'https://www.cnbc.com/id/20910258/device/rss/rss.html' },
    { name: 'CNBC Real Estate', url: 'https://www.cnbc.com/id/10000115/device/rss/rss.html' }
  ];

  const allItems: NewsItem[] = [];

  try {
    const results = await Promise.all(
      feeds.map(async (f) => {
        try {
          const feed = await parser.parseURL(f.url);
          return feed.items.slice(0, 50).map((item: any) => ({
            source: f.name,
            type: 'media' as const,
            title: item.title ?? 'No title',
            link: item.link ?? '',
            pubDate: item.pubDate ?? new Date().toISOString(),
            summary: item.contentSnippet,
          }));
        } catch (e) {
          console.error(`Error fetching CNBC Feed ${f.name}:`, e);
          return [];
        }
      })
    );

    results.forEach(items => allItems.push(...items));
    return { items: allItems, urls: feeds.map(f => f.url) };
  } catch (error: any) {
    console.error('CNBC fetch error:', error);
    return { items: [], urls: [] };
  }
}
