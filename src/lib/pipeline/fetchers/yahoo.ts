import Parser from 'rss-parser';
import { NewsItem } from '../types';

const parser = new Parser();

export async function fetchYahooFinance(): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL('https://finance.yahoo.com/news/rss');
    return feed.items.slice(0, 10).map((item: any) => ({
      source: 'Yahoo Finance',
      type: 'media',
      title: item.title ?? 'No title',
      link: item.link ?? '',
      pubDate: item.pubDate ?? new Date().toISOString(),
      summary: item.contentSnippet,
    }));
  } catch (error: any) {
    console.error('Yahoo Finance fetch error:', error);
    throw new Error(`Yahoo Finance Failed: ${error?.message || String(error)}`);
  }
}
