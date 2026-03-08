import { NewsItem } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchReddit(): Promise<{ items: NewsItem[]; urls: string[] }> {
  const subreddits = [
    'investing', 'wallstreetbets', 'stocks', 'options', 'cryptocurrency', 
    'economy', 'finance', 'worldnews', 'technology', 'business',
    'stockmarket', 'dividends', 'etfs', 'personalfinance', 'pennystocks'
  ];
  const items: NewsItem[] = [];
  const urls: string[] = [];

  for (const sub of subreddits) {
    const url = `https://www.reddit.com/r/${sub}/hot.json?limit=40`;
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
        if (data.stickied) continue;

        items.push({
          source: `Reddit (r/${sub})`,
          type: 'community',
          title: data.title,
          link: `https://reddit.com${data.permalink}`,
          pubDate: new Date(data.created_utc * 1000).toISOString(),
          summary: data.selftext ? data.selftext.substring(0, 300) + '...' : '',
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
