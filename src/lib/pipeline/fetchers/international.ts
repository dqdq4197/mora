import Parser from 'rss-parser';
import { NewsItem } from '../types';

const parser = new Parser();

/**
 * Fetches from major international financial news sources via RSS.
 * Covers: Reuters, Financial Times, WSJ, Bloomberg, The Economist, AP, BBC Business
 */
export async function fetchInternationalNews(): Promise<{ items: NewsItem[]; urls: string[] }> {
  const feeds = [
    // Reuters
    { name: 'Reuters Business', url: 'https://feeds.reuters.com/reuters/businessNews' },
    { name: 'Reuters Finance', url: 'https://feeds.reuters.com/reuters/financials' },
    { name: 'Reuters Tech', url: 'https://feeds.reuters.com/reuters/technologyNews' },
    
    // WSJ (Public RSS)
    { name: 'WSJ Markets', url: 'https://feeds.content.dowjones.io/public/rss/mw_marketsnarrative' },
    { name: 'WSJ Economy', url: 'https://feeds.content.dowjones.io/public/rss/mw_economy' },

    // BBC Business
    { name: 'BBC Business', url: 'https://feeds.bbci.co.uk/news/business/rss.xml' },
    { name: 'BBC Technology', url: 'https://feeds.bbci.co.uk/news/technology/rss.xml' },

    // AP News
    { name: 'AP Business', url: 'https://apnews.com/rss/business' },
    { name: 'AP Finance', url: 'https://apnews.com/rss/financial-markets' },

    // The Guardian Business
    { name: 'Guardian Business', url: 'https://www.theguardian.com/business/rss' },
    { name: 'Guardian Technology', url: 'https://www.theguardian.com/technology/rss' },

    // Seeking Alpha
    { name: 'Seeking Alpha Markets', url: 'https://seekingalpha.com/market_currents.xml' },
    
    // Investopedia
    { name: 'Investopedia News', url: 'https://www.investopedia.com/feedbuilder/feed/getfeed/?feedName=rss_headline' },
  ];

  const allItems: NewsItem[] = [];
  const allUrls: string[] = feeds.map(f => f.url);

  const results = await Promise.all(
    feeds.map(async (f) => {
      try {
        const feed = await parser.parseURL(f.url);
        return feed.items.slice(0, 30).map((item: any) => ({
          source: f.name,
          type: 'media' as const,
          title: item.title ?? 'No title',
          link: item.link ?? '',
          pubDate: item.pubDate ?? new Date().toISOString(),
          summary: item.contentSnippet ?? item.content ?? '',
        }));
      } catch (e) {
        console.warn(`[International] Failed to fetch ${f.name}:`, (e as Error).message);
        return [];
      }
    })
  );

  results.forEach(items => allItems.push(...items));
  console.log(`[International] Fetched ${allItems.length} articles from ${feeds.length} sources.`);
  return { items: allItems, urls: allUrls };
}
