import { NextResponse } from 'next/server';
import { searchReddit, searchNews } from '@/lib/pipeline/fetchers/search';
import { analyzeKeyword, translateQuery } from '@/lib/pipeline/analyzer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    // 1. Translate query for better global search results
    const translatedQuery = await translateQuery(query);
    console.log(`Searching for: "${query}" (Translated: "${translatedQuery}")`);

    // 2. Fetch targeted data from multiple sources using both queries
    const [redditOrig, redditTrans, newsOrig, newsTrans] = await Promise.all([
      searchReddit(query),
      searchReddit(translatedQuery),
      searchNews(query),
      searchNews(translatedQuery)
    ]);
    
    const combinedData = [...redditOrig, ...redditTrans, ...newsOrig, ...newsTrans];
    
    // 3. Perform AI In-depth Analysis
    const analysis = await analyzeKeyword(query, combinedData);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Keyword analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed', details: error.message }, { status: 500 });
  }
}
