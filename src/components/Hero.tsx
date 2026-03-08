"use client";

import { TrendReport } from "@/lib/radar-db";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export function Hero({ report }: { report: TrendReport }) {
  const [mounted, setMounted] = useState(false);
  const isBull = report.overallSentiment === 'bull';
  const isBear = report.overallSentiment === 'bear';
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (isoString: string) => {
    if (!mounted) return "";
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(isoString));
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 md:p-12 my-8 shadow-sm dark:shadow-none">
      {/* Decorative gradients */}
      <div className={`absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full blur-3xl opacity-10 dark:opacity-20 ${isBull ? 'bg-emerald-500' : isBear ? 'bg-rose-500' : 'bg-slate-400'}`} />
      <div className={`absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full blur-3xl opacity-5 dark:opacity-10 ${isBull ? 'bg-teal-500' : isBear ? 'bg-orange-500' : 'bg-slate-300'}`} />
      
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 font-medium">
            Daily AI Insight
          </Badge>
          <span className="text-sm text-slate-400 dark:text-slate-500">
            {formatDate(report.detectedAt)} 업데이트
          </span>
        </div>
        
        <h1 className="text-lg md:text-xl lg:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 leading-relaxed max-w-4xl">
          {report.summary}
        </h1>
        
        <div className="flex items-center gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-slate-500 dark:text-slate-400">시장 감성 (Market Sentiment)</span>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isBull ? 'bg-emerald-400' : isBear ? 'bg-rose-400' : 'bg-slate-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isBull ? 'bg-emerald-500' : isBear ? 'bg-rose-500' : 'bg-slate-500'}`}></span>
              </span>
              <span className={`font-bold tracking-wider ${isBull ? 'text-emerald-600 dark:text-emerald-400' : isBear ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}`}>
                {report.overallSentiment === 'bull' ? '상승' : report.overallSentiment === 'bear' ? '하락' : '중립'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
