import { NextResponse } from "next/server";
import { unsubscribe } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { slug, phone } = await req.json();
    if (typeof slug !== "string" || typeof phone !== "string") {
      return NextResponse.json({ found: false, error: "Requête invalide" }, { status: 400 });
    }
    const res = await unsubscribe(slug, phone);
    return NextResponse.json(res);
  } catch {
    return NextResponse.json({ found: false, error: "Erreur" }, { status: 500 });
  }
}
