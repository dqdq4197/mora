"use client";

import { Stock } from "@/lib/mockData";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingDown, TrendingUp } from "lucide-react";

export function StockList({ stocks }: { stocks: Stock[] }) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {stocks.map((stock, idx) => {
        const isBeneficiary = stock.impact === 'beneficiary';
        const isPositivePrice = (stock.priceChangePercent ?? 0) > 0;
        const isNegativePrice = (stock.priceChangePercent ?? 0) < 0;
        
        return (
          <AccordionItem 
            key={stock.ticker + idx} 
            value={stock.ticker}
            className="border border-slate-800 rounded-lg px-3 bg-slate-950/50 data-[state=open]:bg-slate-900 data-[state=open]:border-slate-700 transition-colors"
          >
            <AccordionTrigger className="hover:no-underline py-3 px-1">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-200 w-14 text-left">{stock.ticker}</span>
                  <span className="text-sm text-slate-400 hidden sm:inline-block w-24 text-left truncate">{stock.name}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] px-1.5 py-0 h-5 ${isBeneficiary ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-rose-500/30 text-rose-400 bg-rose-500/10'}`}
                  >
                    {isBeneficiary ? '수혜주' : '피해주'}
                  </Badge>
                </div>
                
                {stock.priceChangePercent !== undefined && (
                  <div className={`text-sm font-medium flex items-center gap-1 ${isPositivePrice ? 'text-green-400' : isNegativePrice ? 'text-red-400' : 'text-slate-400'}`}>
                    {isPositivePrice ? <TrendingUp className="w-3 h-3" /> : isNegativePrice ? <TrendingDown className="w-3 h-3" /> : null}
                    {isPositivePrice ? '+' : ''}{stock.priceChangePercent}%
                  </div>
                )}
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="pb-4 pt-1 px-1">
              <div className="flex gap-2 items-start bg-indigo-950/30 text-indigo-200 p-3 rounded-md border border-indigo-500/20 text-sm leading-relaxed">
                <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <p>
                  <span className="font-semibold text-indigo-300 mr-2">AI 분석:</span>
                  {stock.reasoning}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
