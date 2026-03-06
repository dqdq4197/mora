import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { setLatestAlert } from '@/lib/radar-db';
import { aggregateAllNews } from '@/lib/pipeline/aggregator';
import { analyzeNews } from '@/lib/pipeline/analyzer';

export async function GET(req: Request) {
  try {
    // Basic Security: Vercel Cron sends a CRON_SECRET auth header.
    // We check if process.env.CRON_SECRET exists to validate it.
    const authHeader = req.headers.get('authorization');
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
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
    const trends = await analyzeNews(newsItems);

    const finalReport = {
      id: Date.now().toString(),
      trends,
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
    return NextResponse.json({ 
      success: false, 
      error: "Scan failed", 
      details: error?.message || String(error) 
    }, { status: 500 });
  }
}
