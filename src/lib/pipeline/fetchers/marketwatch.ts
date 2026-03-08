import Parser from 'rss-parser';
import { NewsItem } from '../types';

const parser = new Parser();

export async function fetchMarketWatch(): Promise<{ items: NewsItem[]; urls: string[] }> {
  const feeds = [
    { name: 'MarketWatch Top Stories', url: 'http://feeds.marketwatch.com/marketwatch/topstories/' },
    { name: 'MarketWatch Market Pulse', url: 'http://feeds.marketwatch.com/marketwatch/marketpulse/' },
    { name: 'MarketWatch Stock Market News', url: 'http://feeds.marketwatch.com/marketwatch/stockmarketnews/' },
    { name: 'MarketWatch Economy', url: 'http://feeds.marketwatch.com/marketwatch/economy/' },
    { name: 'MarketWatch Bulletin', url: 'http://feeds.marketwatch.com/marketwatch/bulletins/' },
    { name: 'MarketWatch IPO', url: 'http://feeds.marketwatch.com/marketwatch/ipo/' }
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
          console.error(`Error fetching MarketWatch Feed ${f.name}:`, e);
          return [];
        }
      })
    );

    results.forEach(items => allItems.push(...items));
    return { items: allItems, urls: feeds.map(f => f.url) };
  } catch (error: any) {
    console.error('MarketWatch fetch error:', error);
    return { items: [], urls: [] };
  }
}
