import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { NewsItem } from './types';

// Truncate function to avoid Token Limit issues
function truncateContext(text: string, maxLength: number = 8000): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '\n...[Truncated due to length]';
}

export async function analyzeNews(newsItems: NewsItem[]) {
  // 1. Prepare and Truncate context. Include URL for AI to map back to sources.
  const rawContext = newsItems
    .map(item => `[${item.source} - ${item.type.toUpperCase()}] ${item.title} (URL: ${item.link})\n${item.summary || ''}`)
    .join('\n\n');
    
  const safeContext = truncateContext(rawContext, 25000); // Increased safe context slightly for multiple trends.

  // 2. Call Gemini
  const { object: report } = await generateObject({
    model: google('gemini-2.5-flash'),
    schema: z.object({
      trends: z.array(z.object({
        keyword: z.string().describe("트렌드를 대표하는 핵심 키워드 (예: '중동 분쟁 심화', 'AI 반도체 랠리')"),
        headline: z.string().describe("이슈를 잘 나타내는 한 줄 헤드라인"),
        description: z.string().describe("현재 트렌드에 대한 구체적인 설명 및 시장에 미치는 영향 (한글)"),
        severity: z.enum(["high", "medium", "low"]).describe("시장에 미칠 영향의 심각도"),
        beneficiaries: z.array(z.string()).describe("수혜가 예상되는 종목 리스트"),
        victims: z.array(z.string()).describe("피해가 예상되는 종목 리스트"),
        relatedStocks: z.array(z.object({
          ticker: z.string().describe("주식 티커 심볼 (예: 'AAPL', 'NVDA')"),
          name: z.string().describe("기업명"),
          description: z.string().describe("이 트렌드와 관련있는 이유를 간략히 설명")
        })).max(3).describe("이 트렌드와 직결된 가장 대표적인 관련 주식 (최대 3개)"),
        retailSentiment: z.object({
          status: z.enum(["bull", "bear", "neutral"]).describe("개인 투자자의 심리 상태"),
          summary: z.string().describe("COMMUNITY 데이터를 기반으로 한 개인 투자자 반응 요약")
        }),
        institutionalSentiment: z.object({
          status: z.enum(["bull", "bear", "neutral"]).describe("기관 및 제도권의 심리 상태"),
          summary: z.string().describe("MEDIA 데이터를 기반으로 한 기관/월가의 전문가 시각 요약")
        }),
        sourceUrls: z.array(z.string()).describe("이 트렌드를 도출하는 데 근거가 된 뉴스나 게시물의 URL 목록 (본문에 제공된 URL들만 포함)")
      })).min(3).max(5).describe("현재 시장을 주도하는 가장 핵심적인 트렌드 3~5개")
    }),
    prompt: `아래는 실시간 금융/경제 뉴스 및 커뮤니티 데이터입니다. 각 데이터는 출처(MEDIA/COMMUNITY 태그)와 원본 URL 링크를 포함하고 있습니다.\n\n${safeContext}\n\n이 데이터들을 종합하여 현재 시장을 지배하는 **가장 중요한 핵심 트렌드 3~5개**를 추출하세요. \n각 트렌드를 분석할 때, 'MEDIA' 성향과 'COMMUNITY' 성향의 시각 차이를 명확히 분리하고, 이 트렌드 분석에 실질적 근거가 된 데이터들의 URL 리스트를 정확히 매핑하여 'sourceUrls' 배열에 포함시키세요.`
  });

  return report.trends;
}
