'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from "@/components/ThemeToggle";
import { RefreshButton } from "@/components/RefreshButton";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const isRadar = pathname === '/radar';
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-background/80 backdrop-blur-md border-b border-border py-0" 
        : "bg-transparent border-b-transparent py-2"
    )}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Activity className="w-6 h-6 text-indigo-500" />
          <span className="text-xl font-bold tracking-tight">Mora</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isRadar && <RefreshButton />}
          {!isRadar && (
            <Link href="/radar">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                오늘의 시장 분석
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
