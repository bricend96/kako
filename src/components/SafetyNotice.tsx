"use client";

import { useEffect, useState } from "react";
import { Portal } from "./Portal";
import { useLockScroll } from "./useLockScroll";
import { KakoBadge } from "./KakoLogo";
import { VerifiedBadge } from "@/components/blocks";

// S'affiche au chargement d'une page vendeur : rappel de sécurité signé par le fondateur.
export function SafetyNotice({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  useLockScroll(open);

  useEffect(() => {
    const key = `kako-safety-${slug}`;
    if (sessionStorage.getItem(key)) return;
    const t = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(t);
  }, [slug]);

  function close() {
    sessionStorage.setItem(`kako-safety-${slug}`, "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[70] grid place-items-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-lg animate-fade-in" onClick={close} />
        <div className="relative w-full max-w-md rounded-3xl glass-tint backdrop-blur-2xl backdrop-saturate-150 border border-[var(--border-strong)] p-6 animate-fade-up shadow-2xl" style={{ ["--tint" as string]: "#7c5cff" }}>
          <div className="flex items-center gap-3">
            <KakoBadge size={40} />
            <div>
              <h3 className="font-bold text-[var(--text)] leading-tight">Achetez en toute sécurité</h3>
              <p className="text-xs text-[var(--text-muted)]">Message de kako</p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm text-[var(--text)] leading-relaxed">
            <p>Avant tout achat, prenez l&apos;habitude de consulter l&apos;<b>Évaluation kako</b> du compte : elle vous donne son indice de fiabilité.</p>
            <p className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0"><VerifiedBadge size={18} /></span>
              <span>Les comptes avec un <b>badge vérifié</b> sont plus fiables : ils ont fourni toutes leurs coordonnées, ce qui permet de les retrouver en cas de problème.</span>
            </p>
            <p className="text-[var(--text-muted)]">Restez vigilant face aux arnaques : méfiez-vous des offres trop belles pour être vraies et ne payez jamais sans confiance.</p>
          </div>

          <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">Njapa Brice</p>
              <p className="text-xs text-[var(--text-muted)]">Fondateur de kako</p>
            </div>
            <button onClick={close} className="rounded-full bg-[#7c5cff] text-white text-sm font-semibold px-5 py-2.5 active:scale-95 transition">
              J&apos;ai compris
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
