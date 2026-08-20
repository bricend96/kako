"use client";

import { useState } from "react";
import type { Profile } from "@/lib/types";
import { Image as ImgIcon } from "@/components/icons";
import { useLockScroll } from "./useLockScroll";
import { Portal } from "./Portal";

const isUrl = (s: string) => /^(https?:|\/)/.test(s);

export function Gallery({ images, theme }: { images: string[]; theme: Profile["theme"] }) {
  const [open, setOpen] = useState<number | null>(null);
  useLockScroll(open !== null);

  const show = (i: number) => setOpen(i);
  const close = () => setOpen(null);
  const go = (d: number) => setOpen((c) => (c === null ? c : (c + d + images.length) % images.length));

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {images.map((g, i) => (
          <button
            key={i}
            onClick={() => show(i)}
            className="relative aspect-square rounded-2xl overflow-hidden grid place-items-center lift"
            style={{ background: `linear-gradient(135deg, ${theme.from}22, ${theme.to}22)` }}
          >
            <ImgIcon size={26} className="text-[var(--text-dim)]" />
            {isUrl(g) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={g} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            )}
          </button>
        ))}
      </div>

      {open !== null && (
        <Portal>
        <div className="fixed inset-0 z-[60] grid place-items-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-lg animate-fade-in" onClick={close} />
          <div className="relative max-w-3xl w-full animate-fade-up">
            <div className="rounded-2xl overflow-hidden glass-tint backdrop-blur-2xl border border-[var(--border-strong)]" style={{ ["--tint" as string]: theme.accent }}>
              {isUrl(images[open]) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[open]} alt="" className="w-full max-h-[78vh] object-contain" />
              ) : (
                <div className="aspect-video grid place-items-center"><ImgIcon size={64} className="text-white/60" /></div>
              )}
            </div>

            <button onClick={close} aria-label="Fermer" className="absolute top-2 right-2 grid place-items-center w-9 h-9 rounded-full bg-black/60 text-white text-xl leading-none">×</button>

            {images.length > 1 && (
              <>
                <button onClick={() => go(-1)} aria-label="Précédent" className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-black/60 text-white text-xl">‹</button>
                <button onClick={() => go(1)} aria-label="Suivant" className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-black/60 text-white text-xl">›</button>
                <p className="mt-2 text-center text-sm text-white/80">{open + 1} / {images.length}</p>
              </>
            )}
          </div>
        </div>
        </Portal>
      )}
    </>
  );
}
