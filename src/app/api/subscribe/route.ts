import { NextResponse } from "next/server";
import { subscribe } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { slug, phone } = await req.json();
    if (typeof slug !== "string" || typeof phone !== "string") {
      return NextResponse.json({ ok: false, error: "Requête invalide" }, { status: 400 });
    }
    const res = await subscribe(slug, phone);
    if (!res.ok) return NextResponse.json({ ok: false, error: "Numéro invalide", count: res.count }, { status: 400 });
    return NextResponse.json(res);
  } catch {
    return NextResponse.json({ ok: false, error: "Erreur" }, { status: 500 });
  }
}
