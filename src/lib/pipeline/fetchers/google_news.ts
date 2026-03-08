import Parser from 'rss-parser';
import { NewsItem } from '../types';

const parser = new Parser();

export async function fetchGoogleNews(): Promise<{ items: NewsItem[]; urls: string[] }> {
  const categories = [
    { name: 'Google Business', q: 'business' },
    { name: 'Google Technology', q: 'technology' },
    { name: 'Google Finance', q: 'finance' },
    { name: 'Google World', q: 'world' },
    { name: 'Global Economy News', q: 'global+economy+breaking' },
    { name: 'Stock Market Breaking', q: 'stock+market+breaking' }
  ];

  const allItems: NewsItem[] = [];

  try {
    const results = await Promise.all(
      categories.map(async (cat) => {
        try {
          const feedUrl = `https://news.google.com/rss/search?q=${cat.q}&hl=en-US&gl=US&ceid=US:en`;
          const feed = await parser.parseURL(feedUrl);
          return feed.items.slice(0, 40).map((item: any) => ({
            source: cat.name,
            type: 'media' as const,
            title: item.title ?? 'No title',
            link: item.link ?? '',
            pubDate: item.pubDate ?? new Date().toISOString(),
            summary: item.contentSnippet,
          }));
        } catch (e) {
          console.error(`Error fetching Google News ${cat.name}:`, e);
          return [];
        }
      })
    );

    results.forEach(items => allItems.push(...items));
    return { 
      items: allItems, 
      urls: categories.map(cat => `https://news.google.com/rss/search?q=${cat.q}&hl=en-US&gl=US&ceid=US:en`) 
    };
  } catch (error: any) {
    console.error('Google News fetch error:', error);
    return { items: [], urls: [] };
  }
}
