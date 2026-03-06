import { TrendReport } from '@/lib/radar-db';
import { AlertTriangle, TrendingUp, TrendingDown, Users, Building, Link as LinkIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function BreakingAlert({ report }: { report: TrendReport | null }) {
  if (!report || !report.trends || report.trends.length === 0) return null;

  return (
    <div className="space-y-6 mb-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-500/20 rounded-full text-red-400 animate-pulse">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-red-50">실시간 AI 포착 트렌드</h2>
        <span className="text-red-400/80 text-sm ml-auto">{new Date(report.detectedAt).toLocaleString()} 기준</span>
      </div>

      {report.trends.map((alert, idx) => (
        <div key={idx} className="w-full bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
          
          <div className="flex flex-col gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline" className="border-indigo-500/30 text-indigo-300 bg-indigo-500/10">
                  {alert.keyword}
                </Badge>
                {alert.severity === 'high' && (
                  <Badge variant="destructive" className="bg-red-500/20 text-red-400 border border-red-500/30">
                    High Impact
                  </Badge>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-slate-100 mb-2">{alert.headline}</h3>
              <p className="text-slate-300/80 leading-relaxed mb-6 text-sm">
                {alert.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div className="space-y-4">
                <div className="bg-slate-950/50 rounded-xl p-4 border border-emerald-500/10">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-3 text-xs uppercase tracking-wider">
                     <TrendingUp className="w-3 h-3" /> 수혜 예상
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {alert.beneficiaries.map((b) => (
                      <Badge key={b} variant="outline" className="border-emerald-500/20 text-emerald-300 bg-emerald-500/5 text-xs">
                        {b}
                      </Badge>
                    ))}
                    {alert.beneficiaries.length === 0 && <span className="text-slate-500 text-xs">없음</span>}
                  </div>
                </div>

                <div className="bg-slate-950/50 rounded-xl p-4 border border-rose-500/10">
                  <div className="flex items-center gap-2 text-rose-400 font-semibold mb-3 text-xs uppercase tracking-wider">
                     <TrendingDown className="w-3 h-3" /> 피해 예상
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {alert.victims.map((v) => (
                      <Badge key={v} variant="outline" className="border-rose-500/20 text-rose-300 bg-rose-500/5 text-xs">
                        {v}
                      </Badge>
                    ))}
                    {alert.victims.length === 0 && <span className="text-slate-500 text-xs">없음</span>}
                  </div>
                </div>

                {/* Related Stocks Highlight */}
                {alert.relatedStocks && alert.relatedStocks.length > 0 && (
                  <div className="bg-indigo-950/20 rounded-xl p-4 border border-indigo-500/20">
                    <div className="text-indigo-400 font-semibold mb-3 text-xs uppercase tracking-wider">
                      ★ 대표 관련주
                    </div>
                    <div className="space-y-3">
                      {alert.relatedStocks.map((stock, i) => (
                        <div key={i} className="flex flex-col">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-indigo-300 font-bold text-sm bg-indigo-500/20 px-2 py-0.5 rounded text-xs">{stock.ticker}</span>
                            <span className="text-slate-300 text-sm font-medium">{stock.name}</span>
                          </div>
                          <p className="text-xs text-slate-400 pl-1 border-l-2 border-indigo-500/30">
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
                 <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-blue-400 font-semibold mb-1 text-xs uppercase tracking-wider">
                          <Building className="w-3 h-3" /> 기관 (Media)
                          {alert.institutionalSentiment && (
                            <span className={`ml-auto capitalize ${alert.institutionalSentiment.status === 'bull' ? 'text-emerald-400' : alert.institutionalSentiment.status === 'bear' ? 'text-rose-400' : 'text-slate-400'}`}>{alert.institutionalSentiment.status}</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {alert.institutionalSentiment?.summary || "데이터 없음"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full h-px bg-slate-800 my-3" />

                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-orange-400 font-semibold mb-1 text-xs uppercase tracking-wider">
                          <Users className="w-3 h-3" /> 개인 (Community)
                          {alert.retailSentiment && (
                            <span className={`ml-auto capitalize ${alert.retailSentiment.status === 'bull' ? 'text-emerald-400' : alert.retailSentiment.status === 'bear' ? 'text-rose-400' : 'text-slate-400'}`}>{alert.retailSentiment.status}</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {alert.retailSentiment?.summary || "데이터 없음"}
                        </p>
                      </div>
                    </div>
                 </div>

                 {/* Sources */}
                 {alert.sourceUrls && alert.sourceUrls.length > 0 && (
                   <div className="mt-2 pl-1">
                     <div className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-medium">
                       <LinkIcon className="w-3 h-3" /> 출처 
                     </div>
                     <div className="flex flex-col gap-1">
                       {alert.sourceUrls.map((url, i) => (
                         <a key={i} href={url} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-indigo-400 truncate max-w-sm transition-colors">
                           {url}
                         </a>
                       ))}
                     </div>
                   </div>
                 )}
              </div>
            </div>
            
          </div>
        </div>
      ))}
    </div>
  );
}
