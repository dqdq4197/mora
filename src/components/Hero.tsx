import { MarketState } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";

export function Hero({ data }: { data: MarketState }) {
  const isBull = data.overallSentiment === 'bull';
  const isBear = data.overallSentiment === 'bear';
  
  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(isoString));
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 md:p-12 my-8">
      {/* Decorative gradients */}
      <div className={`absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full blur-3xl opacity-20 ${isBull ? 'bg-green-500' : isBear ? 'bg-red-500' : 'bg-slate-500'}`} />
      <div className={`absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full blur-3xl opacity-10 ${isBull ? 'bg-emerald-500' : isBear ? 'bg-orange-500' : 'bg-slate-400'}`} />
      
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-slate-700 text-slate-300 font-medium">
            Daily AI Insight
          </Badge>
          <span className="text-sm text-slate-500">
            {formatDate(data.lastUpdated)} 업데이트
          </span>
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
          {data.summary}
        </h1>
        
        <div className="flex items-center gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-slate-400">시장 감성 (Market Sentiment)</span>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isBull ? 'bg-green-400' : isBear ? 'bg-red-400' : 'bg-slate-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isBull ? 'bg-green-500' : isBear ? 'bg-red-500' : 'bg-slate-500'}`}></span>
              </span>
              <span className={`font-semibold uppercase tracking-wider ${isBull ? 'text-green-400' : isBear ? 'text-red-400' : 'text-slate-400'}`}>
                {data.overallSentiment}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
