import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { getCurrentUser } from "@/lib/auth";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 3 * 1024 * 1024; // 3 Mo (les images sont compressées côté client)
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

  const ext = EXT[file.type];
  if (!ext) return NextResponse.json({ error: "Format non supporté (JPEG/PNG/WebP)" }, { status: 415 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image trop lourde (max 3 Mo)" }, { status: 413 });

  const buf = Buffer.from(await file.arrayBuffer());
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, name), buf);

  return NextResponse.json({ url: `/uploads/${name}` });
}
