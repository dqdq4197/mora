import Parser from 'rss-parser';
import { NewsItem } from '../types';

const parser = new Parser();

/**
 * Fetches domestic Korean economic/financial news via public RSS feeds.
 * Covers: 연합뉴스, 한국경제, 매일경제, 이데일리, 조선비즈
 */
export async function fetchKoreanNews(): Promise<{ items: NewsItem[]; urls: string[] }> {
  const feeds = [
    // 연합뉴스 (Yonhap) - 가장 신뢰도 높은 공신력 있는 뉴스통신
    { name: '연합뉴스 경제', url: 'https://www.yna.co.kr/rss/economy.xml' },
    { name: '연합뉴스 금융', url: 'https://www.yna.co.kr/rss/economy_finance.xml' },
    { name: '연합뉴스 국제', url: 'https://www.yna.co.kr/rss/international.xml' },

    // 한국경제 (Korea Economic Daily)
    { name: '한국경제', url: 'https://www.hankyung.com/feed/all-news' },
    { name: '한국경제 증권', url: 'https://www.hankyung.com/feed/finance' },

    // 매일경제 (Maeil Economy)
    { name: '매일경제', url: 'https://www.mk.co.kr/rss/40300001/' },
    { name: '매일경제 증권', url: 'https://www.mk.co.kr/rss/40200001/' },

    // 이데일리 (Edaily)
    { name: '이데일리 경제', url: 'https://www.edaily.co.kr/rss/economy.xml' },
    { name: '이데일리 증권', url: 'https://www.edaily.co.kr/rss/stock.xml' },

    // 조선비즈 (Chosun Biz)
    { name: '조선비즈', url: 'https://biz.chosun.com/site/data/rss/rss.xml' },

    // 헤럴드경제
    { name: '헤럴드경제', url: 'http://biz.heraldkorea.co.kr/rss/allArticle.xml' },
  ];

  const allItems: NewsItem[] = [];
  const allUrls: string[] = feeds.map(f => f.url);

  const results = await Promise.all(
    feeds.map(async (f) => {
      try {
        const feed = await parser.parseURL(f.url);
        return feed.items.slice(0, 20).map((item: any) => ({
          source: f.name,
          type: 'media' as const,
          title: item.title ?? 'No title',
          link: item.link ?? '',
          pubDate: item.pubDate ?? new Date().toISOString(),
          summary: item.contentSnippet ?? item.content ?? '',
        }));
      } catch (e) {
        console.warn(`[Korean News] Failed to fetch ${f.name}:`, (e as Error).message);
        return [];
      }
    })
  );

  results.forEach(items => allItems.push(...items));
  console.log(`[Korean News] Fetched ${allItems.length} articles from ${feeds.length} sources.`);
  return { items: allItems, urls: allUrls };
}
