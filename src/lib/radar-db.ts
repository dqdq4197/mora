import fs from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';

// On Vercel, the only writable directory is /tmp, BUT it's not shared across functions.
// Thus, we use Upstash Redis for production shared persistence.
const isVercel = process.env.VERCEL === '1';
const UPSTASH_URL = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '')
const UPSTASH_TOKEN = (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '')

const hasKV = !!(UPSTASH_URL && UPSTASH_TOKEN);

const DB_PATH = isVercel 
  ? path.join('/tmp', '.radar_db.json')
  : path.join(process.cwd(), '.radar_db.json');

const KV_KEY = 'latest_radar_report';
const useKV = hasKV; // Use Redis whenever variables are present, even locally

// Initialize Redis client
const redis = hasKV ? new Redis({
  url: UPSTASH_URL!,
  token: UPSTASH_TOKEN!,
}) : null;

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
  console.log(`[RadarDB] setLatestAlert called. Report status: ${report ? 'Data exists' : 'NULL (deletion)'}`);
  console.log(`[RadarDB] Redis Config: URL=${UPSTASH_URL ? 'PRESENT' : 'MISSING'}, Token=${UPSTASH_TOKEN ? 'PRESENT' : 'MISSING'}`);

  // 1. Sync to Upstash Redis
  if (useKV && redis) {
    try {
      if (report) {
        const result = await redis.set(KV_KEY, report);
        console.log(`[RadarDB] ✅ Redis Write Success: ${result}`);
      } else {
        await redis.del(KV_KEY);
        console.log(`[RadarDB] 🗑️ Redis Delete Success`);
      }
    } catch (kvError) {
      console.error('[RadarDB] ❌ Redis Write ERROR:', kvError);
    }
  } else {
    console.warn(`[RadarDB] ⚠️ Redis write skipped: hasKV=${hasKV}, useKV=${useKV}, redisObj=${!!redis}`);
  }

  // 2. Fallback/Local: Write to local filesystem
  try {
    if (report) {
      fs.writeFileSync(DB_PATH, JSON.stringify(report, null, 2));
      console.log(`[RadarDB] ✅ Local File Write Success: ${DB_PATH}`);
    } else {
      if (fs.existsSync(DB_PATH)) {
        fs.unlinkSync(DB_PATH);
        console.log(`[RadarDB] 🗑️ Local File Delete Success`);
      }
    }
  } catch (fsError) {
    console.error('[RadarDB] ❌ Local FS Write ERROR:', fsError);
  }
}

export async function getLatestAlert(): Promise<TrendReport | null> {
  // 1. Try Vercel KV (Upstash) first if in production and configured
  if (useKV && redis) {
    try {
      const report = await redis.get<TrendReport>(KV_KEY);
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

const SEARCH_LOG_KEY = 'mora_search_logs';
const LOCAL_LOG_PATH = path.join(process.cwd(), 'mora-user-searches.json');

export async function logSearchQuery(query: string, translatedQuery: string) {
  const logEntry = {
    query,
    translatedQuery,
    timestamp: new Date().toISOString()
  };

  // 1. Sync to Redis if configured
  if (useKV && redis) {
    try {
      await redis.lpush(SEARCH_LOG_KEY, JSON.stringify(logEntry));
      // Keep only last 1000 searches to manage storage
      await redis.ltrim(SEARCH_LOG_KEY, 0, 999);
    } catch (error) {
      console.error('Redis Search Logging Error:', error);
    }
  }

  // 2. Local Fallback (Append to JSON file)
  try {
    let logs = [];
    if (fs.existsSync(LOCAL_LOG_PATH)) {
      logs = JSON.parse(fs.readFileSync(LOCAL_LOG_PATH, 'utf-8'));
    }
    logs.unshift(logEntry);
    fs.writeFileSync(LOCAL_LOG_PATH, JSON.stringify(logs.slice(0, 500), null, 2));
  } catch (error) {
    console.error('Local Search Logging Error:', error);
  }
}
