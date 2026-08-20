import { NextResponse } from "next/server";
import { trackEvent } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { slug, type } = await req.json();
    if (typeof slug === "string" && (type === "view" || type === "wa")) {
      await trackEvent(slug, type);
    }
  } catch {
    /* ignore */
  }
  return NextResponse.json({ ok: true });
}
