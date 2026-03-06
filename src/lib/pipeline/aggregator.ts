import { FetcherResult, FetcherFunction, NewsItem } from './types';
import { fetchYahooFinance } from './fetchers/yahoo';
import { fetchReddit } from './fetchers/reddit';
import { fetchCnbc } from './fetchers/cnbc';
import { fetchMarketWatch } from './fetchers/marketwatch';
import { fetchMockSources } from './fetchers/mock';

/**
 * Executes a given fetcher securely and wraps the result in FetcherResult.
 */
async function runFetcher(name: string, fn: FetcherFunction): Promise<FetcherResult> {
  try {
    const items = await fn();
    return {
      source: name,
      items,
      success: true
    };
  } catch (error: any) {
    console.error(`Aggregator Error - ${name}:`, error);
    return {
      source: name,
      items: [],
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
    { name: 'Mock Sources', fn: fetchMockSources }
  ];

  // Execute in parallel
  const results = await Promise.all(
    fetchers.map(f => runFetcher(f.name, f.fn))
  );

  const aggregatedItems: NewsItem[] = [];
  const errors: string[] = [];

  // Compile final results
  for (const result of results) {
    if (result.success) {
      aggregatedItems.push(...result.items);
    } else {
      errors.push(`[${result.source}] Failed: ${result.error}`);
    }
  }

  return { items: aggregatedItems, errors };
}
