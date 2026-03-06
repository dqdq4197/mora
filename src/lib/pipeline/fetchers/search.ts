import Parser from 'rss-parser';
import { NewsItem } from '../types';

const parser = new Parser();

export async function searchReddit(query: string): Promise<NewsItem[]> {
  const items: NewsItem[] = [];
  // Try relevance first, then top if empty
  const sorts = ['relevance', 'top'];
  
  for (const sort of sorts) {
    try {
      const res = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=${sort}&t=week&limit=15`, {
        headers: { 'User-Agent': 'MoraFinanceBot/1.0' },
        next: { revalidate: 0 }
      });
      
      if (!res.ok) continue;
      const json = await res.json();
      const posts = json.data?.children || [];
      
      for (const post of posts) {
        const data = post.data;
        items.push({
          source: `Reddit (r/${data.subreddit})`,
          type: 'community',
          title: data.title,
          link: `https://reddit.com${data.permalink}`,
          pubDate: new Date(data.created_utc * 1000).toISOString(),
          summary: data.selftext ? data.selftext.substring(0, 300) : '',
        });
      }
      if (items.length > 0) break; // Found enough
    } catch (error) {
      console.error(`Reddit search (${sort}) error:`, error);
    }
  }
  return items;
}

export async function searchNews(query: string): Promise<NewsItem[]> {
  const items: NewsItem[] = [];
  try {
    // Google News RSS is a great free structured search source
    const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    const feed = await parser.parseURL(feedUrl);
    
    for (const item of feed.items.slice(0, 20)) {
      items.push({
        source: 'Google News',
        type: 'media',
        title: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate || new Date().toISOString(),
        summary: item.contentSnippet || '',
      });
    }
  } catch (error) {
    console.error('News search error:', error);
  }
  return items;
}
