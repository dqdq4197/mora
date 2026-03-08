"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Activity, Star, ArrowRight, RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { TrendReport } from "@/lib/radar-db";

export function RadarPreview() {
  const [report, setReport] = useState<TrendReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch('/api/radar/latest');
        const data = await res.json();
        if (data.success && data.report) {
          setReport(data.report);
        }
      } catch (err) {
        console.error("Failed to fetch preview data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLatest();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center gap-4">
        <RefreshCcw className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">실시간 시장 데이터 동기화 중...</p>
      </div>
    );
  }

  // Fallback UI: No data
  if (!report || report.trends.length === 0) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center text-center space-y-6">
        <div className="p-4 bg-indigo-500/10 rounded-full">
          <Activity className="w-10 h-10 text-indigo-500 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">현재 분석된 트렌드가 없습니다</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Mora의 AI 엔진을 가동하여 지금 바로 글로벌 시장의 핵심 테마를 분석해보세요.
          </p>
        </div>
        <Link href="/radar">
          <Button className="rounded-full px-8 py-6 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/25 group">
            오늘의 시장 분석 시작하기 <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {/* Live Status Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </div>
          <span className="text-sm font-bold text-indigo-500 uppercase tracking-tighter">Live Market Radar Report</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="hidden md:flex rounded-full h-8 w-8 border-border/50 hover:bg-secondary"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="hidden md:flex rounded-full h-8 w-8 border-border/50 hover:bg-secondary"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Swipeable Container */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <AnimatePresence mode="popLayout">
          {report.trends.map((trend, index) => (
            <motion.div
              key={trend.keyword}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="shrink-0 w-[300px] md:w-[350px] snap-center"
            >
              <Card className="h-full bg-card/50 dark:bg-slate-900/40 border-border dark:border-slate-800/60 backdrop-blur-md hover:border-indigo-500/30 transition-all overflow-hidden group border-2">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:scale-110 transition-transform">
                      <Star className="w-4 h-4 text-indigo-500" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "font-bold text-[10px] uppercase tracking-wider px-2 py-0.5",
                        trend.sentiment === 'bull' ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5" : 
                        trend.sentiment === 'bear' ? "text-rose-500 border-rose-500/20 bg-rose-500/5" :
                        "text-slate-500 border-slate-500/20 bg-slate-500/5"
                      )}
                    >
                      {trend.sentiment === 'bull' ? <TrendingUp className="w-3 h-3 mr-1" /> : 
                       trend.sentiment === 'bear' ? <TrendingDown className="w-3 h-3 mr-1" /> :
                       <Minus className="w-3 h-3 mr-1" />}
                      {trend.sentiment === 'bull' ? "상승" : 
                       trend.sentiment === 'bear' ? "하락" : "중립"}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold leading-tight line-clamp-1">{trend.keyword}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed line-clamp-3 mt-2 font-medium text-muted-foreground">
                    {trend.headline}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-[10px] font-bold text-indigo-500/60 uppercase tracking-widest mb-3">연관 종목</div>
                  <div className="flex flex-wrap gap-2">
                    {(trend.relatedStocks?.slice(0, 3) || []).map((stock, sIdx) => (
                      <span key={sIdx} className="text-[11px] font-bold bg-secondary/80 px-2 py-1 rounded-lg border border-border/50">
                        ${stock.ticker}
                      </span>
                    ))}
                    {!trend.relatedStocks && trend.beneficiaries?.slice(0, 2).map((b, bIdx) => (
                      <span key={bIdx} className="text-[11px] font-bold bg-secondary/80 px-2 py-1 rounded-lg border border-border/50">
                        {b}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* End of list spacer/CTA */}
        <div className="shrink-0 w-[150px] flex items-center justify-center snap-center">
          <Link href="/radar" className="group flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
              <ArrowRight className="w-6 h-6 text-indigo-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <span className="text-xs font-bold text-muted-foreground">전체보기</span>
          </Link>
        </div>
      </div>

      <div className="flex justify-center mt-2 md:hidden">
        <div className="flex gap-1.5">
          {report.trends.slice(0, 5).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-border" />
          ))}
        </div>
      </div>

      {/* Decorative Blur Background for Section */}
      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
