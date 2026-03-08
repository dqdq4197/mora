"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { 
  Newspaper, 
  Users, 
  TrendingUp, 
  Activity, 
  LayoutDashboard,
  Globe,
  Cpu,
  Zap
} from "lucide-react";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white dark:bg-slate-900 p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] border-slate-200 dark:border-slate-800",
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export function DataPipeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);

  return (
    <div className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">지능형 데이터 처리 프로세스</h2>
          <p className="text-muted-foreground">Mora는 분산된 방대한 데이터를 하나의 강력한 인사이트로 결합합니다.</p>
        </div>

        <div
          className="relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-3xl border border-border bg-background p-10 md:shadow-xl"
          ref={containerRef}
        >
          <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
            <div className="flex flex-col justify-center gap-12">
              <div className="flex flex-col items-center gap-2">
                <Circle ref={div1Ref}>
                  <Newspaper className="w-6 h-6 text-blue-500" />
                </Circle>
                <span className="text-xs font-medium text-muted-foreground">Global News</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Circle ref={div2Ref}>
                  <Users className="w-6 h-6 text-purple-500" />
                </Circle>
                <span className="text-xs font-medium text-muted-foreground">Community</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Circle ref={div3Ref}>
                  <TrendingUp className="w-6 h-6 text-emerald-500" />
                </Circle>
                <span className="text-xs font-medium text-muted-foreground">Finance Data</span>
              </div>
            </div>
            
            <div className="flex flex-col justify-center">
              <div className="flex flex-col items-center gap-4">
                <Circle ref={div4Ref} className="size-20 bg-indigo-500/10 border-indigo-500/50 shadow-indigo-500/20 shadow-2xl">
                  <Activity className="size-10 text-indigo-500 animate-pulse" />
                </Circle>
                <div className="text-center">
                  <div className="text-sm font-bold text-indigo-500">Mora AI Engine</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Analyzing...</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex flex-col items-center gap-3">
                <Circle ref={div5Ref} className="size-16 border-indigo-500/30">
                  <LayoutDashboard className="size-8 text-indigo-400" />
                </Circle>
                <span className="text-xs font-bold">Real-time Radar</span>
              </div>
            </div>
          </div>

          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div1Ref}
            toRef={div4Ref}
            curvature={-50}
            duration={5}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div2Ref}
            toRef={div4Ref}
            curvature={0}
            duration={5}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div3Ref}
            toRef={div4Ref}
            curvature={50}
            duration={5}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div4Ref}
            toRef={div5Ref}
            curvature={0}
            duration={3}
          />
          
          {/* Decorative gradients */}
          <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-transparent to-background/20" />
        </div>
      </div>
    </div>
  );
}
