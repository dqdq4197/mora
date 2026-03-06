"use client";

import { Trend } from "@/lib/radar-db";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingDown, TrendingUp } from "lucide-react";

interface StockListProps {
  relatedStocks: NonNullable<Trend['relatedStocks']>;
  beneficiaries: string[];
  victims: string[];
}

export function StockList({ relatedStocks, beneficiaries, victims }: StockListProps) {
  // If no related stocks, show beneficiaries/victims as simple badges
  if (relatedStocks.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <div className="text-[10px] text-emerald-500 uppercase font-bold tracking-tighter">수혜 예상</div>
          <div className="flex flex-wrap gap-2">
            {beneficiaries.map(b => (
              <Badge key={b} variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">{b}</Badge>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-[10px] text-rose-500 uppercase font-bold tracking-tighter">피해 예상</div>
          <div className="flex flex-wrap gap-2">
            {victims.map(v => (
              <Badge key={v} variant="outline" className="border-rose-500/30 text-rose-400 bg-rose-500/10 text-[10px]">{v}</Badge>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {relatedStocks.map((stock, idx) => {
        const isBeneficiary = beneficiaries.some(b => b.includes(stock.ticker) || b.includes(stock.name));
        const isVictim = victims.some(v => v.includes(stock.ticker) || v.includes(stock.name));
        
        return (
          <AccordionItem 
            key={stock.ticker + idx} 
            value={stock.ticker}
            className="border border-slate-800 rounded-lg px-3 bg-slate-950/50 data-[state=open]:bg-slate-900 data-[state=open]:border-slate-700 transition-colors"
          >
            <AccordionTrigger className="hover:no-underline py-3 px-1 text-left">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-200 w-14 text-left">{stock.ticker}</span>
                  <span className="text-sm text-slate-400 hidden sm:inline-block w-24 text-left truncate">{stock.name}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] px-1.5 py-0 h-5 ${!isVictim ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-rose-500/30 text-rose-400 bg-rose-500/10'}`}
                  >
                    {isVictim ? '피해주' : '수혜주'}
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="pb-4 pt-1 px-1">
              <div className="flex gap-2 items-start bg-indigo-950/30 text-indigo-200 p-3 rounded-md border border-indigo-500/20 text-sm leading-relaxed">
                <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <p>
                  <span className="font-semibold text-indigo-300 mr-2">이유:</span>
                  {stock.description}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
