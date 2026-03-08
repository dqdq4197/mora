import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

// On Vercel, the only writable directory is /tmp, BUT it's not shared across functions.
// Thus, we use Vercel KV (Redis) for production shared persistence.
const isVercel = process.env.VERCEL === '1';
const DB_PATH = isVercel 
  ? path.join('/tmp', '.radar_db.json')
  : path.join(process.cwd(), '.radar_db.json');

const KV_KEY = 'latest_radar_report';

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
  // 1. Sync to Vercel KV if in production
  if (isVercel) {
    try {
      if (report) {
        await kv.set(KV_KEY, report);
      } else {
        await kv.del(KV_KEY);
      }
    } catch (kvError) {
      console.error('Vercel KV Write Error:', kvError);
    }
  }

  // 2. Fallback/Local: Write to local filesystem
  try {
    if (report) {
      fs.writeFileSync(DB_PATH, JSON.stringify(report));
    } else {
      if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);
    }
  } catch (fsError) {
    console.error('Local FS Write Error:', fsError);
  }
}

export async function getLatestAlert(): Promise<TrendReport | null> {
  // 1. Try Vercel KV first if in production
  if (isVercel) {
    try {
      const report = await kv.get<TrendReport>(KV_KEY);
      if (report) return report;
    } catch (kvError) {
      console.error('Vercel KV Read Error:', kvError);
    }
  }

  // 2. Fallback to local filesystem
  if (!fs.existsSync(DB_PATH)) return null;
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data) as TrendReport;
  } catch (fsError) {
    console.error('Local FS Read Error:', fsError);
    return null;
  }
}
