"use client";

import { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    const toastId = toast.loading('최신 시장 데이터를 분석하고 있습니다.', {
      description: '1분 이상의 시간이 소요될 수 있습니다.'
    });

    try {
      const response = await fetch('/api/cron/monitor', { cache: 'no-store' });
      const data = await response.json();
      
      if (data.success) {
        toast.success('분석이 완료되었습니다!', {
          id: toastId,
          description: '새로운 리포트가 대시보드에 반영되었습니다.'
        });
        // Refresh the server components data
        router.refresh();
      } else {
        if (data.isQuotaError) {
          toast.warning('AI 사용량이 초과되었습니다.', {
            id: toastId,
            description: '현재 무료 사용량이 모두 소모되었습니다. 잠시 후 다시 시도하거나 관리자에게 문의하세요.',
            duration: 5000
          });
        } else {
          toast.error('데이터 갱신에 실패했습니다.', {
            id: toastId,
            description: data.error || data.message
          });
        }
      }
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error('네트워크 오류가 발생했습니다.', {
        id: toastId
      });
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
