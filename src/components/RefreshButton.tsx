"use client";

import { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/cron/monitor');
      const data = await response.json();
      
      if (data.success) {
        // Refresh the server components data
        router.refresh();
      } else {
        alert('데이터 갱신에 실패했습니다: ' + (data.error || data.message));
      }
    } catch (error) {
      console.error('Refresh error:', error);
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleRefresh} 
      disabled={isRefreshing}
      className={`
        gap-2 border-border dark:border-slate-700 text-muted-foreground hover:bg-accent hover:text-foreground transition-all
        ${isRefreshing ? 'opacity-70' : ''}
      `}
    >
      <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? '데이터 분석 중...' : '지금 업데이트'}
    </Button>
  );
}
