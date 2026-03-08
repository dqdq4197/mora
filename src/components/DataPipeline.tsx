"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { 
  Newspaper, 
  Users, 
  TrendingUp, 
  Activity, 
  LayoutDashboard,
  MessageCircle,
  Globe,
  BarChart2,
  ScanSearch,
  Radio,
  LineChart,
  BookOpen,
  Signal,
} from "lucide-react";

const SourceNode = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; label: string; color: string }
>(({ className, children, label, color }, ref) => {
  return (
    <div className="flex items-center gap-2">
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 bg-white dark:bg-slate-900 shadow-md",
          className
        )}
      >
        {children}
      </div>
      <span className={`text-[10px] font-bold ${color} hidden md:block`}>{label}</span>
    </div>
  );
});
SourceNode.displayName = "SourceNode";

const AggNode = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; label?: string }
>(({ className, children, label }, ref) => {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white dark:bg-slate-900 p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
          className
        )}
      >
        {children}
      </div>
      {label && <span className="text-[10px] font-medium text-muted-foreground">{label}</span>}
    </div>
  );
});
AggNode.displayName = "AggNode";

export function DataPipeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Source refs - col 1
  const redditRef = useRef<HTMLDivElement>(null);
  const googleNewsRef = useRef<HTMLDivElement>(null);
  const cnbcRef = useRef<HTMLDivElement>(null);
  const marketwatchRef = useRef<HTMLDivElement>(null);
  const yahooRef = useRef<HTMLDivElement>(null);
  const reutersRef = useRef<HTMLDivElement>(null);
  const koreanRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Aggregator refs - col 2
  const newsAggRef = useRef<HTMLDivElement>(null);
  const communityAggRef = useRef<HTMLDivElement>(null);
  const financeAggRef = useRef<HTMLDivElement>(null);

  // AI engine - col 3
  const aiRef = useRef<HTMLDivElement>(null);

  // Output - col 4
  const radarRef = useRef<HTMLDivElement>(null);

  return (
    <div className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">지능형 데이터 처리 프로세스</h2>
          <p className="text-muted-foreground">Mora는 분산된 방대한 데이터를 하나의 강력한 인사이트로 결합합니다.</p>
        </div>

        <div
          className="relative flex h-[560px] w-full items-center justify-center overflow-hidden rounded-3xl border border-border bg-background p-6 md:p-10 md:shadow-xl"
          ref={containerRef}
        >
          <div className="flex size-full flex-row items-stretch justify-between gap-2 md:gap-6">
            
            {/* Col 1: Raw Sources */}
            <div className="flex flex-col justify-center gap-3.5">
              <SourceNode ref={redditRef}      label="Reddit"       color="text-orange-500"  className="border-orange-500/40">
                <MessageCircle className="w-4 h-4 text-orange-500" />
              </SourceNode>
              <SourceNode ref={googleNewsRef}  label="Google News"  color="text-blue-500"    className="border-blue-500/40">
                <Globe className="w-4 h-4 text-blue-500" />
              </SourceNode>
              <SourceNode ref={cnbcRef}        label="CNBC"         color="text-red-500"     className="border-red-500/40">
                <Radio className="w-4 h-4 text-red-500" />
              </SourceNode>
              <SourceNode ref={marketwatchRef} label="MarketWatch"  color="text-sky-500"     className="border-sky-500/40">
                <LineChart className="w-4 h-4 text-sky-500" />
              </SourceNode>
              <SourceNode ref={yahooRef}       label="Yahoo Finance" color="text-purple-500" className="border-purple-500/40">
                <BarChart2 className="w-4 h-4 text-purple-500" />
              </SourceNode>
              <SourceNode ref={reutersRef}     label="Reuters / AP / BBC" color="text-gray-500" className="border-gray-500/40">
                <BookOpen className="w-4 h-4 text-gray-500" />
              </SourceNode>
              <SourceNode ref={koreanRef}        label="국내 뉴스 (연합·한경·매경)" color="text-rose-500" className="border-rose-500/40">
                <Signal className="w-4 h-4 text-rose-500" />
              </SourceNode>
              <SourceNode ref={searchRef}      label="Search API"   color="text-emerald-500" className="border-emerald-500/40">
                <ScanSearch className="w-4 h-4 text-emerald-500" />
              </SourceNode>
            </div>

            {/* Col 2: Category Aggregators */}
            <div className="flex flex-col justify-center gap-10">
              <AggNode ref={newsAggRef}      label="뉴스"     className="border-blue-500/30">
                <Newspaper className="w-5 h-5 text-blue-500" />
              </AggNode>
              <AggNode ref={communityAggRef} label="커뮤니티" className="border-orange-500/30">
                <Users className="w-5 h-5 text-orange-500" />
              </AggNode>
              <AggNode ref={financeAggRef}   label="금융"     className="border-purple-500/30">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </AggNode>
            </div>
            
            {/* Col 3: AI Engine */}
            <div className="flex flex-col justify-center">
              <div className="flex flex-col items-center gap-3">
                <div
                  ref={aiRef}
                  className="z-10 flex size-20 items-center justify-center rounded-full border-2 bg-indigo-500/10 border-indigo-500/50 shadow-2xl shadow-indigo-500/20"
                >
                  <Activity className="size-10 text-indigo-500 animate-pulse" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-indigo-500">Mora AI</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Engine</div>
                </div>
              </div>
            </div>

            {/* Col 4: Output */}
            <div className="flex flex-col justify-center">
              <div className="flex flex-col items-center gap-3">
                <div
                  ref={radarRef}
                  className="z-10 flex size-16 items-center justify-center rounded-full border-2 bg-white dark:bg-slate-900 border-indigo-500/30 shadow-md"
                >
                  <LayoutDashboard className="size-8 text-indigo-400" />
                </div>
                <span className="text-xs font-bold">Mora Radar</span>
              </div>
            </div>
          </div>

          {/* Source → Aggregator Beams */}
          <AnimatedBeam containerRef={containerRef} fromRef={redditRef}      toRef={communityAggRef} curvature={-30} duration={4}   gradientStartColor="#f97316" gradientStopColor="#f97316" />
          <AnimatedBeam containerRef={containerRef} fromRef={googleNewsRef}  toRef={newsAggRef}      curvature={-20} duration={4.2} gradientStartColor="#3b82f6" gradientStopColor="#3b82f6" />
          <AnimatedBeam containerRef={containerRef} fromRef={cnbcRef}        toRef={newsAggRef}      curvature={-5}  duration={3.8} gradientStartColor="#ef4444" gradientStopColor="#3b82f6" />
          <AnimatedBeam containerRef={containerRef} fromRef={marketwatchRef} toRef={financeAggRef}   curvature={5}   duration={4.5} gradientStartColor="#0ea5e9" gradientStopColor="#a855f7" />
          <AnimatedBeam containerRef={containerRef} fromRef={yahooRef}       toRef={financeAggRef}   curvature={20}  duration={4}   gradientStartColor="#a855f7" gradientStopColor="#a855f7" />
          <AnimatedBeam containerRef={containerRef} fromRef={reutersRef}     toRef={newsAggRef}      curvature={10}  duration={5}   gradientStartColor="#6b7280" gradientStopColor="#3b82f6" />
          <AnimatedBeam containerRef={containerRef} fromRef={koreanRef}       toRef={newsAggRef}      curvature={30}  duration={4.8} gradientStartColor="#f43f5e" gradientStopColor="#3b82f6" />
          <AnimatedBeam containerRef={containerRef} fromRef={searchRef}       toRef={newsAggRef}      curvature={45}  duration={5.2} gradientStartColor="#10b981" gradientStopColor="#3b82f6" />

          {/* Aggregator → AI Beams */}
          <AnimatedBeam containerRef={containerRef} fromRef={newsAggRef}      toRef={aiRef} curvature={-35} duration={5} />
          <AnimatedBeam containerRef={containerRef} fromRef={communityAggRef} toRef={aiRef} curvature={0}   duration={5} />
          <AnimatedBeam containerRef={containerRef} fromRef={financeAggRef}   toRef={aiRef} curvature={35}  duration={5} />

          {/* AI → Radar Beam */}
          <AnimatedBeam containerRef={containerRef} fromRef={aiRef} toRef={radarRef} curvature={0} duration={3} />
          
          <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-transparent to-background/20" />
        </div>
      </div>
    </div>
  );
}
