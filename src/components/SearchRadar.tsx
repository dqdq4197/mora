"use client";

import { useCompletion } from "@ai-sdk/react";
import { Search, Loader2, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormEvent, useState } from "react";

export function SearchRadar() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { completion, complete, isLoading, error } = useCompletion({
    api: "/api/analyze",
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    complete(searchTerm);
  };

  const createMarkup = (text: string) => {
    let html = text
      .replace(/## (.*?)\n/g, '<h2>$1</h2>')
      .replace(/### (.*?)\n/g, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/- (.*)/g, '<ul><li>$1</li></ul>')
      .replace(/> (.*)/g, '<blockquote>$1</blockquote>');
      
    // Fix adjacent uls
    html = html.replace(/<\/ul>\n<ul>/g, '');
    return { __html: html };
  };

  return (
    <Card className="w-full bg-slate-900/60 border-slate-800 shadow-2xl overflow-hidden mb-8">
      <div className="p-1.5 bg-linear-to-r from-indigo-500 via-purple-500 to-emerald-500" />
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Radar className="w-6 h-6 text-indigo-400" />
              AI 종목/테마 심층 분석
            </h2>
            <p className="text-sm text-slate-400">
              관심 있는 종목 이름이나 티커(예: 현대 제철, NVDA)를 검색하면 글로벌 현세와 연관된 시장 영향을 실시간으로 분석합니다.
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="'현대 제철' 또는 '고금리 테마'를 검색해보세요"
                className="pl-10 h-12 bg-slate-950 border-slate-700 text-base"
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !searchTerm.trim()} 
              className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "AI 분석"}
            </Button>
          </form>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
              분석 중 오류가 발생했습니다: {error.message}
            </div>
          )}

          {(completion || isLoading) && (
            <div className="mt-4 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <span className="relative flex h-3 w-3">
                  {isLoading && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isLoading ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
                </span>
                <span className="text-sm font-medium text-slate-300">
                  {isLoading ? "글로벌 소스 분석 중..." : "분석 완료"}
                </span>
              </div>
              
              <ScrollArea className="h-[300px] w-full rounded-xl bg-slate-950/50 border border-slate-800 p-6">
                <style jsx global>{`
                  .markdown-body h2 { @apply text-xl font-bold mt-4 mb-2 text-white; }
                  .markdown-body h3 { @apply text-lg font-semibold mt-4 mb-2 text-indigo-300; }
                  .markdown-body p { @apply text-slate-300 leading-relaxed mb-4; }
                  .markdown-body ul { @apply list-disc list-inside text-slate-300 mb-4 space-y-1; }
                  .markdown-body strong { @apply text-emerald-400 font-semibold; }
                  .markdown-body blockquote { @apply border-l-4 border-indigo-500 pl-4 py-1 italic bg-indigo-500/10 rounded-r text-indigo-200 mt-4 mb-4; }
                `}</style>
                <div 
                  className="markdown-body text-sm md:text-base whitespace-pre-wrap font-sans"
                  dangerouslySetInnerHTML={createMarkup(completion)}
                />
              </ScrollArea>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
