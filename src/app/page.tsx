'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Activity, Globe, Zap, BarChart3, ArrowRight, ShieldCheck, TrendingUp, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from "@/components/ThemeToggle";
import { Navbar } from "@/components/Navbar";
import { DataPipeline } from "@/components/DataPipeline";
import { RadarPreview } from "@/components/RadarPreview";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      } as any,
    },
  };

  return (
    <div className="min-h-screen bg-transparent pt-16">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-20 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Zap className="w-3 h-3" />
            Next-Gen Financial Intelligence
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] bg-linear-to-r from-foreground to-foreground/60 bg-clip-text text-transparent"
          >
            시장의 흐름을 <br /> 
            <span className="text-indigo-500">가장 먼저</span> 포착하세요
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed"
          >
            Mora는 수만 개의 글로벌 뉴스, 커뮤니티 데이터, 그리고 경제 지표를 AI가 초단위로 분석합니다. 
            <span className="block mt-2 font-semibold text-foreground italic">"매일 아침 7시(KST), 당일의 새로운 시장 흐름을 날카롭게 요약하고 한눈에 보기 좋게 정리합니다."</span>
          </motion.p>

          <motion.div variants={itemVariants} className="flex justify-center">
            <Link href="/radar">
              <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 group">
                오늘의 시장 확인하기
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <DataPipeline />

      {/* Features Section */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Mora가 분석하는 방식</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">방대한 데이터를 지능적으로 요약하여 명확한 투자 인사이트를 제공합니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Globe className="w-8 h-8 text-blue-500" />}
              title="글로벌 실시간 스캔"
              description="CNBC, Yahoo Finance, Reuters 등 주요 외신부터 Reddit 등 커뮤니티의 반응까지 실시간으로 수집합니다."
            />
            <FeatureCard 
              icon={<Cpu className="w-8 h-8 text-indigo-500" />}
              title="단계별 AI 심층 분석"
              description="단순 요약을 넘어, 시장 테마를 식별하고 관련 종목과의 연결 고리를 찾아내는 2단계 AI 파이프라인을 운영합니다."
            />
            <FeatureCard 
              icon={<TrendingUp className="w-8 h-8 text-emerald-500" />}
              title="실행 가능한 통찰"
              description="상승/하락 전망뿐만 아니라 구체적인 근거 URL과 연관 종목 리스트를 통해 즉각적인 의사결정을 돕습니다."
            />
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              복잡한 데이터를<br />
              <span className="text-indigo-500">한눈에 들어오게</span>
            </h2>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="mt-1 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">근거 중심의 데이터</h4>
                  <p className="text-sm text-muted-foreground">AI 답변의 모든 내용은 10개 이상의 실제 뉴스 링크로 뒷받침됩니다.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4 text-indigo-500" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">감성 지수 측정</h4>
                  <p className="text-sm text-muted-foreground">시장의 긍정/부정적 심리 점수를 수치화하여 객관적인 지표를 제공합니다.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-card/30 border border-border rounded-[3rem] p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
            <RadarPreview />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            <span className="font-bold">Mora</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Mora. All rights reserved.</p>
          <div className="flex gap-6">
             <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
             <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
             <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-card border border-border p-8 rounded-3xl hover:shadow-xl hover:shadow-primary/5 transition-all group">
      <div className="mb-6 p-4 bg-background rounded-2xl w-fit group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
