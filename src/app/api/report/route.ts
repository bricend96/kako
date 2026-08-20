import { NextResponse } from "next/server";
import { reportScam, addComplaint } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { slug, type, text } = await req.json();
    if (typeof slug !== "string") return NextResponse.json({ ok: false }, { status: 400 });
    if (type === "complaint") {
      await addComplaint(slug, typeof text === "string" ? text : "");
      return NextResponse.json({ ok: true });
    }
    const count = await reportScam(slug);
    return NextResponse.json({ ok: true, count });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
