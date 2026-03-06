import { NewsItem } from '../types';

export async function fetchReddit(): Promise<NewsItem[]> {
  const subreddits = ['investing', 'wallstreetbets'];
  const items: NewsItem[] = [];

  for (const sub of subreddits) {
    try {
      const res = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=15`, {
        headers: { 'User-Agent': 'MoraFinanceBot/1.0' },
        next: { revalidate: 3600 }
      });
      if (!res.ok) {
        throw new Error(`Reddit API returned ${res.status}`);
      }
      const json = await res.json();
      
      const posts = json.data?.children || [];
      for (const post of posts) {
        const data = post.data;
        items.push({
          source: `Reddit (r/${sub})`,
          type: 'community',
          title: data.title,
          link: `https://reddit.com${data.permalink}`,
          pubDate: new Date(data.created_utc * 1000).toISOString(),
          summary: data.selftext ? data.selftext.substring(0, 200) + '...' : '',
        });
      }
    } catch (error: any) {
      console.error(`Reddit ${sub} fetch error:`, error);
      // We log but don't strictly fail the entire Reddit fetch if only one sub fails.
    }
  }

  if (items.length === 0) {
     throw new Error("Failed to fetch any data from Reddit.");
  }

  return items;
}
