export interface Stock {
  ticker: string;
  name: string;
  impact: 'beneficiary' | 'victim';
  reasoning: string;
  priceChangePercent?: number;
}

export interface Theme {
  id: string;
  title: string;
  description: string;
  sentiment: 'bull' | 'bear' | 'neutral';
  stocks: Stock[];
}

export interface MarketState {
  summary: string;
  lastUpdated: string;
  overallSentiment: 'bull' | 'bear' | 'neutral';
  themes: Theme[];
}

export const mockMarketData: MarketState = {
  summary: "파월 의장의 비둘기파적 발언과 주요 반도체 기업의 실적 호조로 기술주 중심의 상승 랠리가 이어질 전망입니다.",
  lastUpdated: new Date().toISOString(), // In real app, this would be a static parsed time or fixed string during build
  overallSentiment: 'bull',
  themes: [
    {
      id: "theme-1",
      title: "AI 반도체 수요 폭발",
      description: "글로벌 빅테크 기업들의 AI 인프라 투자 확대 기조가 재확인되면서 AI 반도체 밸류체인 전반에 강한 매수세가 예상됩니다.",
      sentiment: "bull",
      stocks: [
        {
          ticker: "NVDA",
          name: "엔비디아",
          impact: "beneficiary",
          reasoning: "차세대 AI 가속기 출하량 가이던스가 시장 예상치를 상회하며 직접적인 수혜 기대",
          priceChangePercent: 4.5
        },
        {
          ticker: "TSMC",
          name: "TSMC",
          impact: "beneficiary",
          reasoning: "AI 칩 파운드리 독점에 따른 마진율 개선 효과 지속",
          priceChangePercent: 2.1
        },
        {
          ticker: "INTC",
          name: "인텔",
          impact: "victim",
          reasoning: "AI 가속기 시장 점유율 하락 우려 및 파운드리 부문 적자 지속 가능성",
          priceChangePercent: -1.8
        }
      ]
    },
    {
      id: "theme-2",
      title: "전기차(EV) 가격 경쟁 심화",
      description: "중국 전기차 업체들의 저가 공세가 거세지며 레거시 자동차 제조업체들의 마진 압박이 가중되고 있습니다.",
      sentiment: "bear",
      stocks: [
        {
          ticker: "TSLA",
          name: "테슬라",
          impact: "victim",
          reasoning: "중국 내 점유율 하락 방어를 위한 추가 판가 인하 압박",
          priceChangePercent: -2.4
        },
        {
          ticker: "BYDDY",
          name: "BYD",
          impact: "beneficiary",
          reasoning: "수직 계열화를 통한 원가 경쟁력 바탕으로 글로벌 시장 점유율 확대",
          priceChangePercent: 3.2
        }
      ]
    },
    {
      id: "theme-3",
      title: "비만 치료제 파이프라인 확장",
      description: "차세대 GLP-1 비만 치료제 임상 결과가 긍정적으로 발표되면서 제약/바이오 섹터 내 자금 유입이 가속화 중입니다.",
      sentiment: "bull",
      stocks: [
        {
          ticker: "LLY",
          name: "일라이 릴리",
          impact: "beneficiary",
          reasoning: "경구용 비만 치료제 3상 긍정적 결과 도출로 인한 파이프라인 가치 상승",
          priceChangePercent: 5.1
        },
        {
          ticker: "NVO",
          name: "노보 노디스크",
          impact: "beneficiary",
          reasoning: "기존 위고비 매출 견조 및 공급 병목 현상 점진적 해소",
          priceChangePercent: 1.5
        }
      ]
    }
  ]
};
