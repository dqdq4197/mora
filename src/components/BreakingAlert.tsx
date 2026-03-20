"use client";

import { TrendReport } from '@/lib/radar-db';
import { AlertTriangle, TrendingUp, TrendingDown, Users, Building, Link as LinkIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

export function BreakingAlert({ report }: { report: TrendReport | null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!report || !report.trends || report.trends.length === 0) return null;

  const formatDate = (isoString: string) => {
    if (!mounted) return "";
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(isoString));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-500/10 dark:bg-red-500/20 rounded-full text-red-600 dark:text-red-400 animate-pulse">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-foreground">실시간 AI 포착 트렌드</h2>
        <span className="text-muted-foreground text-sm ml-auto">
          {mounted ? `${formatDate(report.detectedAt)} 기준` : ''}
        </span>
      </div>

      {report.trends.map((alert, idx) => (
        <div key={idx} className="w-full bg-card/80 dark:bg-slate-900/60 border border-border dark:border-slate-700/50 rounded-2xl p-6 shadow-sm dark:shadow-lg relative overflow-hidden group backdrop-blur-sm">
          
          <div className="flex flex-col gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline" className="border-indigo-500/30 text-indigo-300 bg-indigo-500/10">
                  {alert.keyword}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`border-slate-500/30 font-medium ${
                    alert.timeline === 'short-term' 
                      ? 'text-blue-400 bg-blue-500/5' 
                      : 'text-amber-400 bg-amber-500/5'
                  }`}
                >
                  {alert.timeline === 'short-term' ? '실시간/단기' : '전략/장기'}
                </Badge>
                {alert.severity === 'high' && (
                  <Badge variant="destructive" className="bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30">
                    High Impact
                  </Badge>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2">{alert.headline}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                {alert.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-xl p-4 border border-emerald-500/10 dark:border-emerald-500/10">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold mb-3 text-xs uppercase tracking-wider">
                     <TrendingUp className="w-3 h-3" /> 수혜 예상
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {alert.beneficiaries.map((b) => (
                      <Badge key={b} variant="outline" className="border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/5 text-xs">
                        {b}
                      </Badge>
                    ))}
                    {alert.beneficiaries.length === 0 && <span className="text-slate-400 dark:text-slate-500 text-xs">없음</span>}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-xl p-4 border border-rose-500/10 dark:border-rose-500/10">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold mb-3 text-xs uppercase tracking-wider">
                     <TrendingDown className="w-3 h-3" /> 피해 예상
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {alert.victims.map((v) => (
                      <Badge key={v} variant="outline" className="border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/5 text-xs">
                        {v}
                      </Badge>
                    ))}
                    {alert.victims.length === 0 && <span className="text-slate-400 dark:text-slate-500 text-xs">없음</span>}
                  </div>
                </div>

                {/* Related Stocks Highlight */}
                {alert.relatedStocks && alert.relatedStocks.length > 0 && (
                  <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-500/20">
                    <div className="text-indigo-600 dark:text-indigo-400 font-semibold mb-3 text-xs uppercase tracking-wider">
                      ★ 대표 관련주
                    </div>
                    <div className="space-y-3">
                      {alert.relatedStocks.map((stock, i) => (
                        <div key={i} className="flex flex-col">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-indigo-600 dark:text-indigo-300 font-bold text-sm bg-indigo-100 dark:bg-indigo-500/20 px-2 py-0.5 rounded">{stock.ticker}</span>
                            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{stock.name}</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 pl-1 border-l-2 border-indigo-200 dark:border-indigo-500/30">
                            {stock.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sentiment & Sources */}
              <div className="space-y-4">
                 <div className="bg-slate-50 dark:bg-slate-950/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold mb-1 text-xs uppercase tracking-wider">
                          <Building className="w-3 h-3" /> 기관 (Media)
                          {alert.institutionalSentiment && (
                            <span className={`ml-auto font-bold ${alert.institutionalSentiment.status === 'bull' ? 'text-emerald-600 dark:text-emerald-400' : alert.institutionalSentiment.status === 'bear' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
                              {alert.institutionalSentiment.status === 'bull' ? '상승' : alert.institutionalSentiment.status === 'bear' ? '하락' : '중립'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {alert.institutionalSentiment?.summary || "데이터 없음"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-3" />

                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-semibold mb-1 text-xs uppercase tracking-wider">
                          <Users className="w-3 h-3" /> 개인 (Community)
                          {alert.retailSentiment && (
                            <span className={`ml-auto font-bold ${alert.retailSentiment.status === 'bull' ? 'text-emerald-600 dark:text-emerald-400' : alert.retailSentiment.status === 'bear' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
                              {alert.retailSentiment.status === 'bull' ? '상승' : alert.retailSentiment.status === 'bear' ? '하락' : '중립'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {alert.retailSentiment?.summary || "데이터 없음"}
                        </p>
                      </div>
                    </div>
                 </div>

                  {/* Sources - Collapsible */}
                  {alert.sourceUrls && alert.sourceUrls.length > 0 && (
                    <details className="mt-2 group/sources">
                      <summary className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-medium cursor-pointer hover:text-indigo-400 transition-colors list-none select-none">
                        <LinkIcon className="w-3 h-3" /> 
                        <span>출처 확인하기 ({alert.sourceUrls.length})</span>
                        <span className="text-[10px] opacity-50 group-open/sources:rotate-180 transition-transform ml-1">▼</span>
                      </summary>
                      <div className="flex flex-col gap-1 pl-4 border-l border-border dark:border-slate-800 ml-1.5 mt-2">
                        {alert.sourceUrls.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noreferrer" className="text-[11px] text-muted-foreground hover:text-primary truncate max-w-sm transition-colors py-0.5">
                            {url}
                          </a>
                        ))}
                      </div>
                    </details>
                  )}
              </div>
            </div>
            
          </div>
        </div>
      ))}
    </div>
  );
}
