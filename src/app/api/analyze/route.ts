import { openai } from '@ai-sdk/openai';
import { streamText, generateText } from 'ai';

// Mock response for when API keys are not provided
const MOCK_ANALYSIS = `
## 🔍 종목 분석: **[SEARCH_TERM]**

현재 글로벌 거시경제 지표 및 최신 뉴스 기반 AI 분석 결과입니다.

### 📊 시장 포지션
- **영향력**: [SEARCH_TERM]은(는) 현재 시장 흐름에서 **수혜주(Beneficiary)** 포지션으로 분석됩니다.
- **최신 글로벌 트렌드 요약**: 
  - 최근 미 연준(Fed)의 금리 방향성 발언과 관련하여, 해당 섹터에 자금이 지속적으로 유입되고 있습니다.
  - 관련 산업 내 주요 경쟁사 대비 마진율이 견조하여 시장 점유율 확장이 예상됩니다.
  - 글로벌 메이저 투자은행(IB)들의 투자 의견이 최근 '비중 확대(Overweight)'로 상향 조정되었습니다.

### 💡 투자 인사이트
> [SEARCH_TERM] 관련 단기 모멘텀은 매우 긍정적이나, 다음 주 예정된 주요 경제 지표 발표 결과에 따라 변동성이 확대될 수 있으므로 주의가 필요합니다.
`;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response('No prompt provided', { status: 400 });
    }

    // Check if the OpenAI API Key exists
    if (!process.env.OPENAI_API_KEY) {
      // Return a simulated streaming response if no API key is provided
      const encoder = new TextEncoder();
      const customString = MOCK_ANALYSIS.replace(/\[SEARCH_TERM\]/g, prompt);
      const chunks = customString.match(/.{1,3}/g) || []; // Chunk the string

      const stream = new ReadableStream({
        async start(controller) {
          for (const chunk of chunks) {
            // Simulated delay for typing effect
            await new Promise((resolve) => setTimeout(resolve, 30));
            // Send chunk formatted as Vercel AI SDK expects (0: "text")
            controller.enqueue(encoder.encode(`0:"${chunk.replace(/"/g, '\\"')}"\n`));
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // Real AI Logic (If OPENAI_API_KEY is present)
    const systemPrompt = `
You are Mora, a Morning Radar Assistant analyzing global stock markets. 
Analyze the requested stock/topic based on current macro-economics. 
Determine if it's a beneficiary or a victim of recent market trends. 
Output your analysis in neatly formatted Markdown in Korean.
`;

    const result = streamText({
      model: openai('gpt-4o-mini'), // Using gpt-4o-mini for cost efficiency
      system: systemPrompt,
      prompt: `Analyze: ${prompt}`,
    });

    return result.toTextStreamResponse();
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
