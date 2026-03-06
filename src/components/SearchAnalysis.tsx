'use client';

import React, { useState } from 'react';
import { Search, Loader2, TrendingUp, TrendingDown, Info, ExternalLink, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AnalysisResult {
  keyword: string;
  summary: string;
  shortTermOutlook: { view: 'bull' | 'bear' | 'neutral'; description: string };
  longTermOutlook: { view: 'bull' | 'bear' | 'neutral'; description: string };
  keyPoints: string[];
  sentimentScore: number;
  sources: { title: string; url: string }[];
  disclaimer?: string;
}

export function SearchAnalysis() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/analyze/keyword?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '분석에 실패했습니다.');
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          )}
        </div>
        <Input
          type="text"
          placeholder="궁금한 종목이나 테마를 입력하세요 (예: 엔비디아, 금리 전망, 초전도체)"
          className="w-full h-14 pl-12 pr-32 bg-background/60 border-border focus:border-primary/50 focus:ring-primary/20 rounded-2xl text-lg transition-all backdrop-blur-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
        <Button 
          type="submit" 
          disabled={loading || !query.trim()}
          className="absolute right-2 top-2 h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 transition-all shadow-lg shadow-primary/20"
        >
          {loading ? '분석 중...' : 'AI 분석'}
        </Button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Info className="w-4 h-4" />
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8 bg-card/80 dark:bg-slate-900/80 border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 backdrop-blur-md">
          <div className="absolute top-0 right-0 p-4">
             <button onClick={() => setResult(null)} className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors">
                <X className="w-5 h-5" />
             </button>
          </div>

          {result.disclaimer && (
            <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-xs flex items-center gap-2 animate-pulse">
              <Info className="w-4 h-4" />
              {result.disclaimer}
            </div>
          )}
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <Badge className="w-fit bg-primary/20 text-primary border-primary/30 px-3 py-1 text-sm font-semibold uppercase tracking-wider">
              AI Deep Report
            </Badge>
            <h2 className="text-3xl font-black text-foreground decoration-primary underline-offset-8">
              "{result.keyword}" 심층 분석
            </h2>
            <div className="ml-auto flex items-center gap-3 bg-secondary/50 px-4 py-2 rounded-2xl border border-border">
               <span className="text-xs text-muted-foreground font-bold uppercase">Sentiment Score</span>
               <span className={`text-2xl font-black ${result.sentimentScore > 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                 {result.sentimentScore}
               </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <section>
                <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  요약 및 현황
                </h3>
                <p className="text-foreground/80 leading-relaxed text-lg bg-primary/5 p-6 rounded-2xl border border-primary/10">
                  {result.summary}
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border ${result.shortTermOutlook.view === 'bull' ? 'bg-emerald-500/5 border-emerald-500/20' : result.shortTermOutlook.view === 'bear' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-muted/50 border-border'}`}>
                   <div className="flex items-center gap-2 mb-4">
                      {result.shortTermOutlook.view === 'bull' ? <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : result.shortTermOutlook.view === 'bear' ? <TrendingDown className="w-5 h-5 text-rose-600 dark:text-rose-400" /> : <Info className="w-5 h-5 text-muted-foreground" />}
                      <span className="font-bold text-foreground italic">Short-term (1W)</span>
                   </div>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     {result.shortTermOutlook.description}
                   </p>
                </div>
 
                <div className={`p-6 rounded-2xl border ${result.longTermOutlook.view === 'bull' ? 'bg-emerald-500/5 border-emerald-500/20' : result.longTermOutlook.view === 'bear' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-muted/50 border-border'}`}>
                   <div className="flex items-center gap-2 mb-4">
                      {result.longTermOutlook.view === 'bull' ? <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : result.longTermOutlook.view === 'bear' ? <TrendingDown className="w-5 h-5 text-rose-600 dark:text-rose-400" /> : <Info className="w-5 h-5 text-muted-foreground" />}
                      <span className="font-bold text-foreground italic">Long-term (1M+)</span>
                   </div>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     {result.longTermOutlook.description}
                   </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <section>
                <h4 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-[0.2em]">Key Insights</h4>
                <ul className="space-y-3">
                  {result.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground/90 bg-secondary/50 p-3 rounded-xl border border-border shadow-sm dark:shadow-none">
                       <span className="text-primary font-bold">0{i+1}</span>
                       {point}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h4 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-[0.2em]">Evidence Support</h4>
                <div className="space-y-2">
                  {result.sources.map((source, i) => (
                    <a 
                      key={i} 
                      href={source.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-background/60 border border-border hover:border-primary/40 hover:bg-secondary/50 transition-all group/link shadow-sm dark:shadow-none"
                    >
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">{source.title}</span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground/60 group-hover/link:text-primary transition-colors" />
                    </a>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
