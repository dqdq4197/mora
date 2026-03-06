import { Trend } from "@/lib/radar-db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StockList } from "./StockList";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function ThemeCard({ trend }: { trend: Trend }) {
  const isBull = trend.sentiment === 'bull';
  const isBear = trend.sentiment === 'bear';
  const isNeutral = trend.sentiment === 'neutral';

  return (
    <Card className="bg-slate-900/50 border-slate-800 flex flex-col h-full overflow-hidden transition-all hover:bg-slate-800/50">
      <CardHeader className="pb-4 border-b border-slate-800/50">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl text-white font-bold leading-tight">
            {trend.keyword}
          </CardTitle>
          <Badge 
            variant="secondary" 
            className={`
              flex items-center gap-1 whitespace-nowrap
              ${isBull ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : ''}
              ${isBear ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : ''}
              ${isNeutral ? 'bg-slate-500/10 text-slate-400 hover:bg-slate-500/20' : ''}
            `}
          >
            {isBull && <TrendingUp className="w-3 h-3" />}
            {isBear && <TrendingDown className="w-3 h-3" />}
            {isNeutral && <Minus className="w-3 h-3" />}
            <span className="uppercase text-xs tracking-wider">{trend.sentiment}</span>
          </Badge>
        </div>
        <CardDescription className="text-slate-400 mt-2 text-sm leading-relaxed">
          {trend.headline}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4 flex-1">
        <div className="mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          연관 종목 분석
        </div>
        {trend.relatedStocks && <StockList relatedStocks={trend.relatedStocks} beneficiaries={trend.beneficiaries} victims={trend.victims} />}
      </CardContent>
    </Card>
  );
}
