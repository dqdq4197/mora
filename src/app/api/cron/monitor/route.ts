import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { setLatestAlert } from '@/lib/radar-db';
import { aggregateAllNews } from '@/lib/pipeline/aggregator';
import { analyzeNews } from '@/lib/pipeline/analyzer';

export async function GET(req: Request) {
  try {
    // Basic Security: Vercel Cron sends a CRON_SECRET auth header.
    const authHeader = req.headers.get('authorization');
    const referer = req.headers.get('referer');
    const host = req.headers.get('host');
    
    // Allow if:
    // 1. Valid CRON_SECRET is provided
    // 2. Request comes from the same origin (Internal Refresh button)
    // 3. Local development and no secret is set
    const isCron = process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;
    const isInternal = referer && host && referer.includes(host);
    const isLocal = !process.env.CRON_SECRET;

    if (!isCron && !isInternal && !isLocal) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log(`Cron triggered: Scanning sources for breaking macro events...`);
    
    // 1. Fetch from pipeline aggregator
    const { items: newsItems, errors: fetchErrors } = await aggregateAllNews();
    
    if (fetchErrors.length > 0) {
      console.warn("Some fetchers failed:", fetchErrors);
    }

    if (newsItems.length === 0) {
      return NextResponse.json({ success: false, message: "No news retrieved.", fetchErrors });
    }

    // 2. AI Analysis 
    const reportData = await analyzeNews(newsItems);

    const finalReport = {
      id: Date.now().toString(),
      ...reportData,
      detectedAt: new Date().toISOString()
    };

    // 3. Save to DB 
    await setLatestAlert(finalReport);

    // 4. Force Next.js App Router Cache Revalidation
    revalidateTag('market-data', "max" as any);

    return NextResponse.json({ 
      success: true, 
      message: "Radar scan complete. Multi-trend analysis and source tracking updated.", 
      report: finalReport,
      warnings: fetchErrors.length > 0 ? fetchErrors : undefined
    });
  } catch (error: any) {
    console.error("Scan error:", error);
    
    // Check for AI Quota or Rate Limit errors
    const errorMessage = error?.message || String(error);
    const isQuotaError = errorMessage.toLowerCase().includes('quota') || 
                        errorMessage.toLowerCase().includes('limit') || 
                        error?.status === 429 ||
                        error?.statusCode === 429;

    return NextResponse.json({ 
      success: false, 
      error: isQuotaError ? "AI Usage Limit Reached" : "Scan failed", 
      details: errorMessage,
      isQuotaError
    }, { status: isQuotaError ? 429 : 500 });
  }
}
