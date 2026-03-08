import { NewsItem } from '../types';

export async function fetchMockSources(): Promise<{ items: NewsItem[]; urls: string[] }> {
  const items: NewsItem[] = [
    {
      source: 'Bloomberg (Mock)',
      type: 'media',
      title: 'Global markets react as anticipated rate cuts are delayed',
      link: '#',
      pubDate: new Date().toISOString(),
      summary: 'Central banks push back on immediate rate cuts, citing sticky inflation. Institutional investors remain defensive.',
    },
    {
      source: 'Reuters (Mock)',
      type: 'media',
      title: 'Tech stocks rally on unexpected earnings beats',
      link: '#',
      pubDate: new Date().toISOString(),
      summary: 'Major tech firms report higher than expected growth in AI-related revenue. Wall Street raises price targets.',
    },
    {
      source: 'Blind 블라인드 (Mock)',
      type: 'community',
      title: '엔비디아 지금 타도 됨?',
      link: '#',
      pubDate: new Date().toISOString(),
      summary: '나만 빼고 다 돈 버는 느낌이라 포모(FOMO) 심하게 오네. 오늘 퇴직금 털어서 풀매수 간다.',
    },
    {
      source: 'X (Twitter Mock)',
      type: 'community',
      title: 'Retail sentiment is completely euphoric',
      link: '#',
      pubDate: new Date().toISOString(),
      summary: 'Everyone I know is suddenly a day trader buying 0DTE options. Huge retail buying pressure on memestocks today. #stonks',
    }
  ];
  return { items, urls: ['#'] };
}
