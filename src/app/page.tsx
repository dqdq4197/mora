import { mockMarketData, MarketState } from "@/lib/mockData";
import { Hero } from "@/components/Hero";
import { ThemeCard } from "@/components/ThemeCard";
import { SearchRadar } from "@/components/SearchRadar";
import { BreakingAlert } from "@/components/BreakingAlert";
import { getLatestAlert } from "@/lib/radar-db";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

/**
 * 1) [Data Fetching Simulation]
 * In production, we would fetch from our database/backend here.
 * We include the Next.js `next: { tags: ['market-data'] }` option to allow On-Demand Revalidation.
 */
async function getMarketData(): Promise<MarketState> {
  // Simulate network delay for the demo
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Here we would perform:
  // const res = await fetch('https://api.backend.com/daily-insight', { next: { tags: ['market-data'] } })
  // return res.json();
  
  return mockMarketData;
}

export default async function Home() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-indigo-500" />
          <h1 className="text-2xl font-bold tracking-tight">Mora <span className="text-slate-500 font-medium text-lg ml-1">Morning Radar</span></h1>
        </div>
        <Badge variant="outline" className="border-indigo-500/30 text-indigo-400">
          Pro Dashboard
        </Badge>
      </header>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  const data = await getMarketData();
  const latestAlert = await getLatestAlert();

  return (
    <>
      <BreakingAlert report={latestAlert} />
      <SearchRadar />
      <Hero data={data} />
      
      <section className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">AI 분석 핵심 테마 Top 3</h2>
          <span className="text-sm text-slate-500">글로벌 뉴스 및 포럼 기반 추출</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.themes.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} />
          ))}
        </div>
      </section>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-12 mt-8">
      <div className="h-64 bg-slate-800/50 rounded-3xl w-full" />
      
      <div>
        <div className="flex justify-between mb-6">
          <div className="h-8 bg-slate-800 rounded w-64" />
          <div className="h-5 bg-slate-800 rounded w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-96 bg-slate-800/50 rounded-xl w-full" />
          <div className="h-96 bg-slate-800/50 rounded-xl w-full" />
          <div className="h-96 bg-slate-800/50 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}
