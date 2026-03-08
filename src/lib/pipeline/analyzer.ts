import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { NewsItem } from './types';
import { AI_MODEL } from '../config';

// Truncate function to avoid Token Limit issues
function truncateContext(text: string, maxLength: number = 8000): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '\n...[Truncated due to length]';
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const TREND_SCHEMA = z.object({
  keyword: z.string().describe("트렌드를 대표하는 핵심 키워드"),
  headline: z.string().describe("이슈를 명확하게 짚어내는 헤드라인"),
  description: z.string().describe("이슈에 대한 구체적인 설명 (전문 용어를 적절히 풀어서 설명하되, 지적인 톤 유지, 한글)"),
  sentiment: z.enum(["bull", "bear", "neutral"]).describe("이 트렌드에 대한 투심"),
  timeline: z.enum(["short-term", "long-term"]).describe("이 트렌드의 지속 기간 (short-term: 실시간/주간, long-term: 월간/분기 이상)"),
  severity: z.enum(["high", "medium", "low"]).describe("이 소식이 시장에 미치는 영향력"),
  beneficiaries: z.array(z.string()).describe("수혜가 예상되는 기업이나 섹터"),
  victims: z.array(z.string()).describe("타격이 예상되는 기업이나 섹터"),
  relatedStocks: z.array(z.object({
    ticker: z.string().describe("티커"),
    name: z.string().describe("기업명"),
    description: z.string().describe("트렌드와 연결되는 구체적 이유")
  })).min(1).max(3).describe("관련 주식 1~3개"),
  retailSentiment: z.object({
    status: z.enum(["bull", "bear", "neutral"]).describe("개인 투자자 심리"),
    summary: z.string().describe("커뮤니티 반응 요약")
  }),
  institutionalSentiment: z.object({
    status: z.enum(["bull", "bear", "neutral"]).describe("기관/전문가 심리"),
    summary: z.string().describe("뉴스/보고서 기반 전문가 시각 요약")
  }),
  sourceUrls: z.array(z.string()).min(5).max(12).describe("근거 자료 URL 리스트. 가급적 10개 내외 포함.")
});

const BATCH_TREND_SCHEMA = z.object({
  trends: z.array(TREND_SCHEMA).describe("분석된 트렌드 상세 리포트 리스트")
});

/**
 * Stage 1: Identify key trends and overall market summary
 */
async function identifyTrends(context: string) {
  const { object: summary } = await generateObject({
    model: google(AI_MODEL),
    schema: z.object({
      summary: z.string().describe("현재 시장 상황 요약 (한글, 2-3문장)"),
      overallSentiment: z.enum(["bull", "bear", "neutral"]),
      trendKeywords: z.array(z.string()).min(4).max(6).describe("가장 중요한 핵심 트렌드 키워드 리스트 (4~6개)")
    }),
    prompt: `아래 시장 뉴스를 분석하여 현재 가장 중요한 **서로 다른(distinct)** 트렌드 키워드 6개를 추출하고 시장 요약을 작성하세요.\n\n` +
      `- 각 키워드는 서로 중복되지 않는 구체적인 테마여야 합니다.\n` +
      `- 뉴스 데이터가 풍부하므로 가급적 **6개의 테마**를 모두 찾아내세요.\n\n` +
      `[데이터]\n${context}`
  });
  return summary;
}

/**
 * Stage 2: Deep-dive into specific trends (Batch)
 */
async function detailTrendsBatch(keywords: string[], context: string) {
  const { object } = await generateObject({
    model: google(AI_MODEL),
    schema: BATCH_TREND_SCHEMA,
    prompt: `시장 데이터에서 다음 키워드들(${keywords.join(', ')}) 각각에 대해 깊이 있게 분석하여 상세 리포트를 작성하세요.\n\n` +
      `- 각 키워드별로 독립적인 상세 리포트(상세 설명, 근거 URL 10개 내외, 관련 주식 등)를 작성하세요.\n` +
      `- 지적인 고등학생이 읽기 좋은 명료한 한글로 작성하세요.\n\n` +
      `[데이터]\n${context}`
  });
  return object.trends;
}

export async function analyzeNews(newsItems: NewsItem[]) {
  // 1. Prepare context (shared for both stages)
  const rawContext = newsItems
    .map(item => `[${item.source}] ${item.title} (URL: ${item.link})\n${item.summary || ''}`)
    .join('\n\n');
  const safeContext = truncateContext(rawContext, 120000);

  console.log(`[Analyzer] Starting Staged Analysis for ${newsItems.length} items...`);

  try {
    // 2. Stage 1: Trend Identification
    const { summary, overallSentiment, trendKeywords } = await identifyTrends(safeContext);
    console.log(`[Analyzer] Stage 1 Done. Identified: ${trendKeywords.join(', ')}`);

    // 3. Stage 2: Detailed Analysis (Batch Processing to save API calls)
    const trends: any[] = [];
    const BATCH_SIZE = 3;
    console.log(`[Analyzer] Stage 2: Batch Analyzing ${trendKeywords.length} keywords (Batch Size: ${BATCH_SIZE})...`);

    for (let i = 0; i < trendKeywords.length; i += BATCH_SIZE) {
      const batch = trendKeywords.slice(i, i + BATCH_SIZE);
      try {
        const batchResults = await detailTrendsBatch(batch, safeContext);
        if (batchResults && batchResults.length > 0) {
          trends.push(...batchResults);
          console.log(`[Analyzer] ✅ Successfully analyzed batch: ${batch.join(', ')}`);
        }
        // Small safety delay between batches
        await sleep(1000); 
      } catch (e: any) {
        console.warn(`[Analyzer] ❌ Batch analysis failed for: ${batch.join(', ')}`, e?.message || e);
      }
    }

    if (trends.length === 0) {
      console.error("[Analyzer] CRITICAL: All detailed trend analyses failed. Aborting save.");
      throw new Error("단계별 분석 중 상세 트렌드 생성에 모두 실패했습니다. 할당량 초과가 의심됩니다.");
    }

    console.log(`[Analyzer] Staged Analysis Complete. Successfully generated ${trends.length} trends.`);

    return {
      id: Date.now().toString(),
      summary,
      overallSentiment,
      trends,
      detectedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("[Analyzer] Multi-step analysis failed:", error);
    throw error;
  }
}

export async function analyzeKeyword(query: string, newsItems: NewsItem[]) {
  const hasData = newsItems.length > 0;
  const rawContext = hasData 
    ? newsItems.map(item => `[${item.source}] ${item.title}\n${item.summary || ''}`).join('\n\n')
    : "실시간 뉴스나 커뮤니티 데이터를 찾지 못했습니다.";
    
  const safeContext = truncateContext(rawContext, 120000);

  const { object: analysis } = await generateObject({
    model: google(AI_MODEL),
    schema: z.object({
      keyword: z.string(),
      summary: z.string().describe("해당 키워드에 대한 상황 요약. (한글, 2-3문장)"),
      shortTermOutlook: z.object({
        view: z.enum(["bull", "bear", "neutral"]),
        description: z.string().describe("단기적 관점 (1주~1개월)")
      }),
      longTermOutlook: z.object({
        view: z.enum(["bull", "bear", "neutral"]),
        description: z.string().describe("장기적 관점 (3개월 이상)")
      }),
      keyPoints: z.array(z.string()).describe("분석 포인트 3-4개"),
      sentimentScore: z.number().min(0).max(100),
      sources: z.array(z.object({
        title: z.string(),
        url: z.string()
      })).min(3).max(15).describe("근거 자료. 10개 내외의 관련 URL을 포함하세요."),
      disclaimer: z.string().describe("안내 문구. 실시간 데이터가 충분하면 빈 문자열, 부족하면 안내 메시지 작성.")
    }),
    prompt: `당신은 전문 금융 분석가입니다. 키워드 "${query}"에 대해 분석하세요.\n\n` + 
      `**[데이터 상황]**\n${hasData ? '실시간 데이터가 존재합니다.' : '실시간 데이터가 부족합니다. 당신의 배경지식을 활용하세요.'}\n\n` +
      `**[컨텍스트]**\n${safeContext}\n\n` +
      `**[지침]**\n` +
      `- 모든 필드를 반드시 채우세요.\n` +
      `- **최신성 우선**: 제공된 컨텍스트 중 가장 최신 뉴스를 우선적으로 반영하세요.\n` +
      `- **출처 구성**: 관련 있는 뉴스 링크를 'sources' 필드에 풍부하게 담으세요.\n` +
      `- 언어는 지적인 고등학생 수준의 명료하고 논리적인 한글을 사용하세요.`
  });

  return analysis;
}

export async function translateQuery(query: string): Promise<string> {
  const { object } = await generateObject({
    model: google(AI_MODEL),
    schema: z.object({
      englishQuery: z.string().describe("영문 검색어 (예: '현대 제철' -> 'Hyundai Steel', '금리' -> 'interest rates')")
    }),
    prompt: `다음 키워드를 글로벌 금융/경제 뉴스 검색에 최적화된 영문 키워드로 번역하세요: "${query}"`
  });

  return object.englishQuery;
}
