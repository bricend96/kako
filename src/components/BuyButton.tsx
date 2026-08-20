"use client";

import { useState } from "react";
import { waLink } from "@/lib/format";
import { WhatsAppIcon, CloseButton } from "@/components/blocks";
import { ConfirmButton } from "@/components/ConfirmButton";
import { useLockScroll } from "./useLockScroll";
import { Portal } from "./Portal";
import type { MomoProvider } from "@/lib/types";

interface Props {
  whatsapp: string;
  message: string;
  amount: number;
  currency: string;
  momo: MomoProvider[];
  requirePrepayment?: boolean;
  accent: string;
  label: string;
  className: string;
  iconSize?: number;
}

function money(a: number, c: string) {
  return `${new Intl.NumberFormat("fr-FR").format(a)} ${c}`;
}

export function BuyButton({ whatsapp, message, amount, currency, momo, requirePrepayment, accent, label, className, iconSize = 14 }: Props) {
  const [open, setOpen] = useState(false);
  const [op, setOp] = useState<MomoProvider | "">(momo[0] ?? "");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"form" | "paying" | "done">("form");
  const ref = "ZANDO-" + Math.random().toString(36).slice(2, 7).toUpperCase();
  useLockScroll(open);

  // Sans prépaiement : bouton d'action avec confirmation avant WhatsApp.
  if (!requirePrepayment) {
    return (
      <ConfirmButton
        href={waLink(whatsapp, message)}
        label={label}
        accent={accent}
        className={className}
        iconSize={iconSize}
        title="Confirmer la commande ?"
        message="Vous allez être redirigé vers WhatsApp pour finaliser votre commande avec le vendeur."
      />
    );
  }

  const paidMessage =
    message + `\n\n✅ Paiement de ${money(amount, currency)} effectué par ${op} (réf ${ref}).`;

  function pay() {
    if (!op || phone.trim().length < 6) return;
    setStatus("paying");
    setTimeout(() => setStatus("done"), 1600);
  }

  return (
    <>
      <button type="button" onClick={() => { setOpen(true); setStatus("form"); }} style={{ background: accent }}
        className={`inline-flex items-center justify-center gap-1.5 text-white font-semibold active:scale-95 transition ${className}`}>
        💳 {label}
      </button>

      {open && (
        <Portal>
        <div className="fixed inset-0 z-[60] grid place-items-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-lg animate-fade-in" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-sm max-h-[88vh] overflow-y-auto rounded-3xl bg-[var(--surface)] border border-[var(--border-strong)] p-5 animate-fade-up shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[var(--text)]">Paiement Mobile Money</h3>
              <CloseButton onClick={() => setOpen(false)} className="absolute top-3 right-3" />
            </div>
            <p className="text-xs text-[var(--text-dim)] mt-1">Mode démo — aucun débit réel n&apos;est effectué.</p>

            <div className="mt-4 rounded-2xl glass-card p-3 flex items-center justify-between">
              <span className="text-sm text-[var(--text-muted)]">Montant</span>
              <span className="font-bold text-[var(--text)]">{money(amount, currency)}</span>
            </div>

            {status === "form" && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Opérateur</label>
                  <div className="flex flex-wrap gap-2">
                    {momo.map((m) => (
                      <button key={m} type="button" onClick={() => setOp(m)} style={op === m ? { background: accent } : undefined}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium border ${op === m ? "text-white border-transparent" : "border-[var(--border)] text-[var(--text-muted)]"}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Ton numéro Mobile Money</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="Ex : 77 123 45 67"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-[var(--text)] placeholder:text-[var(--text-dim)] outline-none focus:border-[var(--focus)] text-sm" />
                </div>
                <button onClick={pay} disabled={!op || phone.trim().length < 6} style={{ background: accent }}
                  className="w-full rounded-xl text-white font-semibold py-3 disabled:opacity-40">
                  Payer {money(amount, currency)}
                </button>
              </div>
            )}

            {status === "paying" && (
              <div className="mt-6 text-center">
                <div className="mx-auto w-10 h-10 rounded-full border-2 border-[var(--border)] border-t-[var(--focus)] animate-spin" />
                <p className="mt-3 text-sm text-[var(--text-muted)]">Validation du paiement {op}…</p>
                <p className="text-xs text-[var(--text-dim)]">Confirme sur ton téléphone si demandé.</p>
              </div>
            )}

            {status === "done" && (
              <div className="mt-4 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-500/15 text-green-400 grid place-items-center text-2xl">✓</div>
                <p className="mt-2 font-semibold text-[var(--text)]">Paiement confirmé</p>
                <p className="text-xs text-[var(--text-dim)]">Réf {ref}</p>
                <a href={waLink(whatsapp, paidMessage)} target="_blank" style={{ background: accent }}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl text-white font-semibold py-3">
                  <WhatsAppIcon size={18} /> Confirmer la commande sur WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
        </Portal>
      )}
    </>
  );
}
