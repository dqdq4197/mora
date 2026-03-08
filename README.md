# Mora (Morning Radar) 📡

> **글로벌 금융 시장의 파도를 실시간으로 포착하는 프리미엄 AI 리포트 서비스**

Mora는 매일 아침 수백 개의 글로벌 금융 뉴스, 커뮤니티 트렌드, 경제 데이터를 자동으로 수집하고 AI를 통해 분석하여 투자의 통찰력을 제공하는 **지능형 시장 모니터링 플랫폼**입니다.

## 🌟 Key Features

### 1. 전방위적 데이터 수집 (5x News Aggregator)
- **Multi-Source**: Yahoo Finance, CNBC, MarketWatch, Google News 등 검증된 메이저 미디어는 물론, Reddit과 같은 대규모 커뮤니티의 실시간 심리(Sentiment)를 함께 수집합니다.
- **Deduplication & Sorting**: 수백 개의 피드에서 중복된 뉴스를 제거하고, 가장 최신(Recency) 순서로 정렬하여 분석의 시의성을 보장합니다.

### 2. AI 기반 심층 분석 (AI Insight Engine)
- **Gemini 2.0 Powered**: Google Gemini 2.0 모델을 사용하여 방대한 데이터를 요약하고, 핵심 트렌드를 도출합니다.
- **Short-term vs Long-term**: 실시간 이슈와 구조적 변화를 구분하여 투심(Sentiment), 수혜주(Beneficiaries), 영향도(Severity)를 입체적으로 분석합니다.
- **Transparency**: 분석의 근거가 되는 원본 기사 URL을 트렌드별로 최소 10개 이상 제공하여 정보의 투명성을 극대화했습니다.

### 3. 프리미엄 사용자 경험 (Premium UX/UI)
- **Modern Aesthetic**: Glassmorphism, Subtle Gradients, Hardware-accelerated Animations를 적용하여 현대적이고 세련된 인터페이스를 제공합니다.
- **Real-time Feedback**: `sonner` 라이브러리를 통해 데이터 업데이트 및 분석 과정을 고급스러운 토스트 메시지로 안내합니다.

### 4. 자동화된 파이프라인 (Automated Pipeline)
- **Vercel Cron Jobs**: 매일 아침 7시(KST)에 자동으로 최신 데이터를 수집하고 리포트를 갱신합니다.
- **Smart Revalidation**: 데이터가 업데이트되면 Next.js의 캐시를 즉시 재검증하여 사용자에게 항상 최신 정보를 노출합니다.

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI & Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **AI Backend**: [AI SDK (Vercel)](https://sdk.vercel.ai/), [Google Gemini Pro](https://deepmind.google/technologies/gemini/)
- **Data Gathering**: [RSS Parser](https://www.npmjs.com/package/rss-parser)
- **State & Feedback**: [Sonner](https://sonner.stevenly.me/)
- **Storage**: [Local Filesystem Database (JSON)](/src/lib/radar-db.ts) (Production: Persistent Database support included)

## 📡 Pipeline Architecture

1.  **Fetch**: `aggregator.ts`가 멀티 쓰레드 방식으로 각 소스(Yahoo, CNBC 등)에서 데이터를 수집.
2.  **Log**: `mora-fetch.log`에 호출된 모든 경로와 성공 여부를 상세히 기록.
3.  **Analyze**: 수집된 수백 개의 기사 중 최신 15만 자를 선별하여 AI 모델에 전달.
4.  **Save**: 분석된 정형 데이터를 로컬 DB에 저장하고 캐시를 무효화.
5.  **Serve**: 사용자가 대시보드에 접속 시 최신 분석 결과와 상세 출처 리스트를 렌더링.


```bash
