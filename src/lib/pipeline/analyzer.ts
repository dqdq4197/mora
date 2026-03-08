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

export async function analyzeNews(newsItems: NewsItem[]) {
  // 1. Prepare and Truncate context. Include URL for AI to map back to sources.
  const rawContext = newsItems
    .map(item => `[${item.source} - ${new Date(item.pubDate).toLocaleString()}] ${item.title} (URL: ${item.link})\n${item.summary || ''}`)
    .join('\n\n');
    
  const safeContext = truncateContext(rawContext, 150000);

  // 2. Call Gemini
  const { object: report } = await generateObject({
    model: google(AI_MODEL),
    schema: z.object({
      summary: z.string().describe("현재 시장 상황을 경제에 관심 있는 고등학생 수준으로 명료하게 요약한 문장 (한글, 2-3문장)"),
      overallSentiment: z.enum(["bull", "bear", "neutral"]).describe("시장 전체의 전반적인 분위기"),
      trends: z.array(z.object({
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
        sourceUrls: z.array(z.string()).min(3).max(8).describe("근거 자료 URL 리스트. 5~8개 정도가 적당합니다.")
      })).min(3).max(5).describe("주요 트렌드 3~5개")
    }),
    prompt: `아래는 실시간 금융/경제 뉴스 및 커뮤니티 데이터입니다. 수집된 데이터가 매우 방대하며, 가장 최신(Recency) 순서로 정렬되어 있습니다.\n\n${safeContext}\n\n이 데이터들을 종합하여 다음 지침에 따라 분석하세요:\n\n**[지침 1: 언어 수준 - 지적인 고등학생 레벨]**\n- 경제 신문 칼럼처럼 명폭하고 논리적인 문체를 사용하세요.\n- 너무 유치한 표현은 지양하되, 어려운 한자어나 전문 용어는 독자가 이해하기 쉽게 문맥 속에서 풀어서 써주세요.\n\n**[지침 2: 시계열 분석 및 최신성 우선]**\n- 데이터 상단에 배치된 **가장 최신 소식(최근 몇 분~수 시간 내 발생)**을 최우선적으로 반영하세요.\n- **short-term (단기/실시간)**: 바로 오늘 또는 이번 주에 터진 새로운 소식, 실시간 가격 변동, 갑작스러운 사건 등을 최우선으로 다룹니다.\n- **long-term (장기/전략)**: 산업의 구조적 변화, 거시 경제 정책, 기술 트렌드 등 긴 호흡의 변화를 다룹니다.\n\n**[지침 3: 출처 투명성]**\n- 각 트렌드별로 분석의 근거가 되는 **URL을 5~8개** 정도 포함하세요.\n\n1. 전체 시장 상황 요약(summary)과 전반적 투심(overallSentiment)을 결정하세요.\n2. 핵심 트렌드 3~5개를 추출하여 위 지침에 따라 상세히 분석하세요.`
  });

  return report;
}

export async function analyzeKeyword(query: string, newsItems: NewsItem[]) {
  const hasData = newsItems.length > 0;
  const rawContext = hasData 
    ? newsItems.map(item => `[${item.source}] ${item.title}\n${item.summary || ''}`).join('\n\n')
    : "실시간 뉴스나 커뮤니티 데이터를 찾지 못했습니다.";
    
  const safeContext = truncateContext(rawContext, 150000);

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
      })).min(3).max(10).describe("근거 자료. 5~10개 정도의 관련 URL을 포함하세요."),
      disclaimer: z.string().describe("안내 문구. 실시간 데이터가 충분하면 빈 문자열, 부족하면 안내 메시지 작성.")
    }),
    prompt: `당신은 전문 금융 분석가입니다. 키워드 "${query}"에 대해 분석하세요.\n\n` + 
      `**[데이터 상황]**\n${hasData ? '실시간 데이터가 존재합니다.' : '실시간 데이터가 부족합니다. 당신의 배경지식을 활용하세요.'}\n\n` +
      `**[컨텍스트]**\n${safeContext}\n\n` +
      `**[지침]**\n` +
      `- 모든 필드(summary, shortTermOutlook, longTermOutlook, keyPoints, sentimentScore, sources, disclaimer)를 반드시 채우세요.\n` +
      `- **최신성 우선**: 제공된 컨텍스트 중 가장 최신 뉴스를 우선적으로 반영하세요.\n` +
      `- **출처 구성**: 관련 있는 뉴스 링크를 'sources' 필드에 5~10개 정도 담으세요.\n` +
      `- 실시간 뉴스 데이터가 부족하여 본인의 지식을 사용할 경우, disclaimer 필드에 "최근 뉴스 데이터가 부족하여 일반적인 시장 정보를 바탕으로 분석되었습니다."라고 명시하세요.\n` +
      `- 데이터가 충분하면 disclaimer를 빈 문자열("")로 두세요.\n` +
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
