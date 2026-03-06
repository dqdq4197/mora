import Parser from 'rss-parser';
import { NewsItem } from '../types';

const parser = new Parser();

export async function fetchCnbc(): Promise<NewsItem[]> {
  const feeds = [
    { name: 'CNBC Finance', url: 'https://search.cnbc.com/rs/search/view.xml?partnerId=2000&keywords=finance' },
    { name: 'CNBC Investing', url: 'https://www.cnbc.com/id/15839069/device/rss/rss.html' }
  ];

  const allItems: NewsItem[] = [];

  try {
    const results = await Promise.all(
      feeds.map(async (f) => {
        try {
          const feed = await parser.parseURL(f.url);
          return feed.items.slice(0, 25).map((item: any) => ({
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
    return allItems;
  } catch (error: any) {
    console.error('CNBC fetch error:', error);
    return [];
  }
}
