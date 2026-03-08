import { NextResponse } from 'next/server';
import { getLatestAlert } from '@/lib/radar-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = await getLatestAlert();
    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error("Failed to fetch latest radar report:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
