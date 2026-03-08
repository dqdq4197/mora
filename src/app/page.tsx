import { Hero } from "@/components/Hero";
import { ThemeCard } from "@/components/ThemeCard";
import { SearchAnalysis } from "@/components/SearchAnalysis";
import { BreakingAlert } from "@/components/BreakingAlert";
import { RefreshButton } from "@/components/RefreshButton";
import { getLatestAlert } from "@/lib/radar-db";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

export const dynamic = 'force-dynamic';

import { ThemeToggle } from "@/components/ThemeToggle";

export default async function Home() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-indigo-500" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Mora <span className="text-slate-500 font-medium text-lg ml-1">Morning Radar</span></h1>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <ThemeToggle />
          <RefreshButton />
        </div>
      </header>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  const latestAlert = await getLatestAlert();

  return (
    <>
      <SearchAnalysis />
      
      {latestAlert && (
        <>
          <Hero report={latestAlert} />
          <BreakingAlert report={latestAlert} />
          
          <section className="mt-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">실시간 AI 포착 핵심 테마</h2>
              <span className="text-sm text-slate-500">글로벌 뉴스 및 커뮤니티 기반 추출</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestAlert.trends.map((trend, idx) => (
                <ThemeCard key={idx} trend={trend} />
              ))}
            </div>
          </section>
        </>
      )}

      {!latestAlert && (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
          <div className="text-slate-500 text-lg mb-4">전체 시장 분석 데이터가 아직 없습니다.</div>
          <div className="text-slate-600 text-sm italic">상단의 새로고침 아이콘을 눌러 실시간 스캔을 시작하세요.</div>
        </div>
      )}
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
