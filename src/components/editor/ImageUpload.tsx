"use client";

import { useRef, useState } from "react";

/** Compresse une image côté client (max 1200px, JPEG ~0.82) puis renvoie un Blob. */
async function compress(file: File, maxDim = 1200): Promise<Blob> {
  const dataUrl = await new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = dataUrl;
  });
  let { width, height } = img;
  if (width > maxDim || height > maxDim) {
    const s = maxDim / Math.max(width, height);
    width = Math.round(width * s);
    height = Math.round(height * s);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
  return new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/jpeg", 0.82));
}

async function uploadFile(file: File): Promise<string> {
  const blob = await compress(file);
  const fd = new FormData();
  fd.append("file", new File([blob], "photo.jpg", { type: "image/jpeg" }));
  const r = await fetch("/api/upload", { method: "POST", body: fd });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Échec de l'envoi");
  return (await r.json()).url as string;
}

/** Upload d'une seule image (avatar, bannière). */
export function ImageUpload({
  value, onChange, label, aspect = "square",
}: { value?: string; onChange: (url: string | undefined) => void; label: string; aspect?: "square" | "wide" }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function pick(f?: File) {
    if (!f) return;
    setErr(null); setBusy(true);
    try { onChange(await uploadFile(f)); }
    catch (e) { setErr((e as Error).message); }
    finally { setBusy(false); }
  }

  const ratio = aspect === "wide" ? "aspect-[3/1]" : "aspect-square w-24";
  return (
    <div>
      <span className="block text-sm font-medium text-[var(--text)] mb-1">{label}</span>
      <div className={`relative ${ratio} rounded-xl border border-[var(--border)] bg-[var(--surface-2)] overflow-hidden grid place-items-center`}>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-[var(--text-dim)]">Aucune image</span>
        )}
        {busy && <div className="absolute inset-0 bg-black/50 grid place-items-center text-xs text-white">Envoi…</div>}
      </div>
      <div className="flex gap-2 mt-2">
        <button type="button" onClick={() => ref.current?.click()} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text)] hover:bg-[var(--surface-2)]">
          {value ? "Changer" : "Ajouter une photo"}
        </button>
        {value && <button type="button" onClick={() => onChange(undefined)} className="rounded-lg px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10">Retirer</button>}
      </div>
      {err && <p className="text-xs text-red-400 mt-1">{err}</p>}
      <input ref={ref} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => pick(e.target.files?.[0])} />
    </div>
  );
}

/** Upload de plusieurs images (produit / service). */
export function ImageUploadMulti({
  value, onChange,
}: { value: string[]; onChange: (urls: string[]) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function add(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    const urls: string[] = [];
    for (const f of Array.from(files)) {
      try { urls.push(await uploadFile(f)); } catch { /* ignore */ }
    }
    onChange([...value, ...urls]);
    setBusy(false);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {value.map((u, i) => (
          <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[var(--border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute top-0.5 right-0.5 bg-black/70 rounded-full w-4 h-4 text-white text-[10px] leading-none">×</button>
          </div>
        ))}
        <button type="button" onClick={() => ref.current?.click()}
          className="w-16 h-16 rounded-lg border-2 border-dashed border-[var(--border)] text-[var(--text-dim)] text-xl hover:bg-[var(--surface-2)]">
          {busy ? "…" : "+"}
        </button>
      </div>
      <input ref={ref} type="file" accept="image/png,image/jpeg,image/webp" multiple hidden onChange={(e) => add(e.target.files)} />
    </div>
  );
}
