"use client";

import { useState } from "react";
import { WhatsAppIcon } from "@/components/blocks";
import { useLockScroll } from "./useLockScroll";
import { Portal } from "./Portal";

/**
 * Bouton d'action (Réserver, Commander, S'inscrire, Visiter…) qui redirige vers
 * WhatsApp APRÈS une confirmation. Couleur = accent du site (plus le vert criard).
 * Le dialogue de confirmation est en "liquid glass".
 */
export function ConfirmButton({
  href, label, accent, className = "", withIcon = true, iconSize = 15,
  title = "Confirmer l'action", message,
}: {
  href: string;
  label: string;
  accent: string;
  className?: string;
  withIcon?: boolean;
  iconSize?: number;
  title?: string;
  message?: string;
}) {
  const [open, setOpen] = useState(false);
  useLockScroll(open);

  function confirm() {
    window.open(href, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ background: accent }}
        className={`inline-flex items-center justify-center gap-1.5 text-white font-semibold active:scale-95 transition ${className}`}
      >
        {withIcon && <WhatsAppIcon size={iconSize} />} {label}
      </button>

      {open && (
        <Portal>
        <div className="fixed inset-0 z-[60] grid place-items-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-lg animate-fade-in" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-sm rounded-3xl glass-tint backdrop-blur-2xl backdrop-saturate-150 p-6 animate-fade-up shadow-2xl"
            style={{ ["--tint" as string]: accent }}>
            <div className="grid place-items-center w-12 h-12 rounded-full mx-auto text-white" style={{ background: accent }}>
              <WhatsAppIcon size={22} />
            </div>
            <h3 className="mt-3 text-center font-bold text-[var(--text)]">{title}</h3>
            <p className="mt-1.5 text-center text-sm text-[var(--text-muted)]">
              {message ?? "Vous allez être redirigé vers WhatsApp pour finaliser votre demande."}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border border-[var(--border-strong)] py-3 text-sm font-semibold text-[var(--text)] hover:bg-white/5 transition active:scale-[0.98]"
              >
                Annuler
              </button>
              <button
                onClick={confirm}
                style={{ background: accent }}
                className="rounded-xl py-3 text-sm font-semibold text-white transition active:scale-[0.98] hover:brightness-110"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
        </Portal>
      )}
    </>
  );
}
