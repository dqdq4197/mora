import { FetcherResult, FetcherFunction, NewsItem } from './types';
import { fetchYahooFinance } from './fetchers/yahoo';
import { fetchReddit } from './fetchers/reddit';
import { fetchCnbc } from './fetchers/cnbc';
import { fetchMarketWatch } from './fetchers/marketwatch';
import { fetchGoogleNews } from './fetchers/google_news';
import { fetchMockSources } from './fetchers/mock';

import { logFetchActivity } from './logger';

/**
 * Executes a given fetcher securely and wraps the result in FetcherResult.
 */
async function runFetcher(name: string, fn: FetcherFunction): Promise<FetcherResult> {
  try {
    // Assuming fn() now returns { items: NewsItem[], urls: string[] }
    const { items, urls } = await fn();
    return {
      source: name,
      items,
      fetchedUrls: urls, // Added fetchedUrls
      success: true
    };
  } catch (error: any) {
    console.error(`Aggregator Error - ${name}:`, error);
    return {
      source: name,
      items: [],
      fetchedUrls: [], // Added fetchedUrls
      success: false,
      error: error?.message || String(error)
    };
  }
}

/**
 * Orchestrates all registered fetchers concurrently.
 * If one fails, the aggregator still returns the successful ones (Isolating partial failure).
 */
export async function aggregateAllNews(): Promise<{ items: NewsItem[], errors: string[] }> {
  // Define active fetchers
  const fetchers: { name: string, fn: FetcherFunction }[] = [
    { name: 'Yahoo Finance', fn: fetchYahooFinance },
    { name: 'Reddit', fn: fetchReddit },
    { name: 'CNBC', fn: fetchCnbc },
    { name: 'MarketWatch', fn: fetchMarketWatch },
    { name: 'Google News', fn: fetchGoogleNews },
    { name: 'Mock Sources', fn: fetchMockSources }
  ];

  // Execute in parallel
  const results = await Promise.all(
    fetchers.map(f => runFetcher(f.name, f.fn))
  );

  const rawItems: NewsItem[] = [];
  const errors: string[] = [];
  // Added sourceReports array to collect detailed fetch activity
  const sourceReports: { source: string; itemCount: number; urls: string[]; success: boolean; error?: string }[] = [];

  // Compile final results & reports
  for (const result of results) {
    // Populate sourceReports with details from each fetcher's result
    sourceReports.push({
      source: result.source,
      itemCount: result.items.length,
      urls: result.fetchedUrls,
      success: result.success,
      error: result.error
    });

    if (result.success) {
      rawItems.push(...result.items);
    } else {
      errors.push(`[${result.source}] Failed: ${result.error}`);
    }
  }

  // 1. Deduplicate by link
  const uniqueItems = Array.from(new Map(rawItems.map(item => [item.link, item])).values());

  // 2. Sort by pubDate descending (Newest first)
  const sortedItems = uniqueItems.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime();
    const dateB = new Date(b.pubDate).getTime();
    return dateB - dateA;
  });

  console.log(`Aggregator: ${sortedItems.length} unique news items compiled for analysis.`);
  
  // 3. Log detailed fetch activity to file
  logFetchActivity(sortedItems.length, sourceReports);

  return { items: sortedItems, errors };
}
