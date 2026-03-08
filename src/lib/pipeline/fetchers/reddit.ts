import { NewsItem } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchReddit(): Promise<{ items: NewsItem[]; urls: string[] }> {
  const subreddits = [
    // --- Core Investing ---
    'investing', 'wallstreetbets', 'stocks', 'options', 'stockmarket',
    'dividends', 'etfs', 'SecurityAnalysis', 'ValueInvesting', 'Daytrading',

    // --- Macro & Economy ---
    'economy', 'finance', 'Economics', 'worldnews', 'geopolitics',
    'business', 'personalfinance',

    // --- Sector: Tech & AI ---
    'technology', 'artificial', 'MachineLearning', 'nvidia', 'Semiconductors',

    // --- Sector: Crypto ---
    'cryptocurrency', 'Bitcoin', 'defi', 'CryptoMarkets',

    // --- Sector: Energy & Commodities ---
    'energy', 'RenewableEnergy', 'Gold', 'oil',

    // --- Sector: Real Estate ---
    'RealEstate', 'realestateinvesting', 'REITs',

    // --- Sector: Biotech & Healthcare ---
    'Biotech', 'biotech_stocks',

    // --- Asia / Korea Adjacent ---
    'korea', 'japanfinance', 'AsianMarkets', 'chinastocksusa',
  ];
  const items: NewsItem[] = [];
  const urls: string[] = [];

  for (const sub of subreddits) {
    const url = `https://www.reddit.com/r/${sub}/hot.json?limit=15`;
    urls.push(url);
    try {
      const res = await fetch(url, {
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        },
        next: { revalidate: 3600 }
      });
      
      if (!res.ok) {
        console.warn(`[Reddit] r/${sub} returned ${res.status}`);
        continue;
      }
      
      const json = await res.json();
      const posts = json.data?.children || [];
      
      for (const post of posts) {
        const data = post.data;
        // Skip stickied posts and low-quality posts (< 5 upvotes)
        if (data.stickied) continue;
        if (data.score < 5) continue;

        const flair = data.link_flair_text ? `[${data.link_flair_text}] ` : '';
        const bodySnippet = data.selftext?.trim()
          ? data.selftext.substring(0, 400) + '...'
          : '';

        items.push({
          source: `Reddit (r/${sub})`,
          type: 'community',
          title: data.title,
          link: `https://reddit.com${data.permalink}`,
          pubDate: new Date(data.created_utc * 1000).toISOString(),
          summary: `${flair}👍 ${data.score} upvotes | ${bodySnippet}`,
        });
      }
    } catch (error: any) {
      console.error(`[Reddit] r/${sub} fetch error:`, error.message);
    }
  }

  // If we couldn't get anything, we warn but don't crash the whole pipeline
  if (items.length === 0) {
     console.error("[Reddit] Failed to fetch any data from Reddit across all subreddits.");
  }

  return { items, urls };
}
