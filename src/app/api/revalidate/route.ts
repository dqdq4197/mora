import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get("secret");
    const tag = request.nextUrl.searchParams.get("tag");
    
    // In a real application, replace this with an actual secure environment variable check
    // e.g., process.env.REVALIDATION_SECRET
    const EXPECTED_SECRET = "super-secret-cron-key"; 

    if (secret !== EXPECTED_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    if (!tag) {
      return NextResponse.json({ message: "Missing tag param" }, { status: 400 });
    }

    // Next.js cache revalidation
    revalidateTag(tag, "max");
    
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
