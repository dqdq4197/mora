export interface NewsItem {
  source: string;
  type: 'media' | 'community';
  title: string;
  link: string;
  pubDate: string;
  summary?: string;
}

export interface FetcherResult {
  source: string;
  items: NewsItem[];
  fetchedUrls: string[];
  success: boolean;
  error?: string;
}

export type FetcherFunction = () => Promise<{ items: NewsItem[]; urls: string[] }>;
