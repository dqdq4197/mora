import fs from 'fs';
import path from 'path';

// Simulate Vercel KV or Database using a local file
// In production, use @vercel/kv: kv.set('alert', data) / kv.get('alert')

const DB_PATH = path.join(process.cwd(), '.radar_db.json');

export interface Trend {
  keyword: string;
  headline: string;
  description: string;
  severity: "high" | "medium" | "low";
  timeline: "short-term" | "long-term";
  beneficiaries: string[];
  victims: string[];
  relatedStocks?: {
    ticker: string;
    name: string;
    description: string;
  }[];
  retailSentiment?: {
    status: "bull" | "bear" | "neutral";
    summary: string;
  };
  institutionalSentiment?: {
    status: "bull" | "bear" | "neutral";
    summary: string;
  };
  sentiment: "bull" | "bear" | "neutral";
  sourceUrls: string[];
}

export interface TrendReport {
  id: string;
  summary: string;
  overallSentiment: "bull" | "bear" | "neutral";
  trends: Trend[];
  detectedAt: string;
}

export async function setLatestAlert(report: TrendReport | null) {
  if (report) {
    fs.writeFileSync(DB_PATH, JSON.stringify(report));
  } else {
    if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);
  }
}

export async function getLatestAlert(): Promise<TrendReport | null> {
  if (!fs.existsSync(DB_PATH)) return null;
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data) as TrendReport;
  } catch {
    return null;
  }
}
