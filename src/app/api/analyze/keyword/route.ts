import { NextResponse } from 'next/server';
import { searchReddit, searchNews } from '@/lib/pipeline/fetchers/search';
import { analyzeKeyword, translateQuery } from '@/lib/pipeline/analyzer';
import { logSearchQuery } from '@/lib/radar-db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    // 1. Log search activity for monitoring
    console.log(`[USER_SEARCH] Query: "${query}" | Time: ${new Date().toLocaleString('ko-KR')}`);

    // 2. Translate query for better global search results
    const translatedQuery = await translateQuery(query);
    console.log(`Searching for: "${query}" (Translated: "${translatedQuery}")`);

    // 3. Log to DB for persistent tracking
    await logSearchQuery(query, translatedQuery);

    // 2. Fetch targeted data from multiple sources using both queries
    const results = await Promise.allSettled([
      searchReddit(query),
      searchReddit(translatedQuery),
      searchNews(query),
      searchNews(translatedQuery)
    ]);
    
    // Extract items from successful fetches
    const combinedData = results
      .filter((r): r is PromiseFulfilledResult<any[]> => r.status === 'fulfilled')
      .flatMap(r => r.value);

    if (combinedData.length === 0) {
      console.warn("No data found from any source for query:", query);
    }
    
    // 3. Perform AI In-depth Analysis
    const analysis = await analyzeKeyword(query, combinedData);

    return NextResponse.json(analysis);
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    const isQuotaError = errorMessage.toLowerCase().includes('quota') || 
                        errorMessage.toLowerCase().includes('limit') || 
                        error?.status === 429 ||
                        error?.statusCode === 429;

    return NextResponse.json({ 
      error: isQuotaError ? 'AI Usage Limit Reached' : 'Analysis failed', 
      details: errorMessage,
      isQuotaError
    }, { status: isQuotaError ? 429 : 500 });
  }
}
