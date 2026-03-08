import Parser from 'rss-parser';
import { NewsItem } from '../types';

const parser = new Parser();

export async function fetchYahooFinance(): Promise<{ items: NewsItem[]; urls: string[] }> {
  const feeds = [
    { name: 'Yahoo Top News', url: 'https://finance.yahoo.com/news/rss' },
    { name: 'Yahoo Crypto', url: 'https://finance.yahoo.com/news/crypto/rss' },
    { name: 'Yahoo Stock Market', url: 'https://finance.yahoo.com/news/category-stock-market/rss' },
    { name: 'Yahoo Tech', url: 'https://finance.yahoo.com/news/category-technology/rss' },
    { name: 'Yahoo Economy', url: 'https://finance.yahoo.com/news/category-economy/rss' },
    { name: 'Yahoo Personal Finance', url: 'https://finance.yahoo.com/news/category-personal-finance/rss' },
    { name: 'Yahoo Ratings', url: 'https://finance.yahoo.com/news/category-ratings-analysis/rss' }
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
          console.error(`Error fetching Yahoo Feed ${f.name}:`, e);
          return [];
        }
      })
    );

    results.forEach(items => allItems.push(...items));
    return { items: allItems, urls: feeds.map(f => f.url) };
  } catch (error: any) {
    console.error('Yahoo Finance aggregate fetch error:', error);
    throw new Error(`Yahoo Finance Failed: ${error?.message || String(error)}`);
  }
}
