"use client";

import { useState } from "react";
import { Portal } from "./Portal";
import { useLockScroll } from "./useLockScroll";
import { COUNTRIES, countryFor } from "@/lib/countries";
import { CloseButton } from "@/components/blocks";

export function SubscribeButton({ slug, initialCount, country, accent, compact }: { slug: string; initialCount: number; country?: string; accent: string; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"sub" | "unsub">("sub");
  const [iso, setIso] = useState(countryFor(country).iso);
  const [phone, setPhone] = useState("");
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  useLockScroll(open);

  const dial = COUNTRIES.find((c) => c.iso === iso)?.dial ?? "221";
  const e164 = dial + phone.replace(/[^0-9]/g, "").replace(/^0+/, "");

  async function submit() {
    setBusy(true); setMsg(null);
    try {
      const url = mode === "sub" ? "/api/subscribe" : "/api/unsubscribe";
      const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, phone: e164 }) });
      const d = await r.json();
      if (mode === "sub") {
        if (d.ok) { setCount(d.count); setMsg({ ok: true, text: d.already ? "Vous êtes déjà abonné(e) ✓" : "Abonnement confirmé ! Vous serez informé(e) des nouveautés." }); setPhone(""); }
        else setMsg({ ok: false, text: d.error === "Numéro invalide" ? "Numéro invalide." : "Une erreur est survenue." });
      } else {
        if (d.found) { setCount(d.count); setMsg({ ok: true, text: "Vous avez été désabonné(e)." }); setPhone(""); }
        else setMsg({ ok: false, text: "Vous ne faites pas partie des abonnés." });
      }
    } catch { setMsg({ ok: false, text: "Une erreur est survenue." }); }
    finally { setBusy(false); }
  }

  return (
    <>
      {compact ? (
        <button
          type="button"
          aria-label="S'abonner"
          onClick={() => { setOpen(true); setMode("sub"); setMsg(null); }}
          style={{ background: accent }}
          className="grid place-items-center w-9 h-9 rounded-full text-white active:scale-90 transition shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10.5 20a1.8 1.8 0 0 0 3 0" /></svg>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => { setOpen(true); setMode("sub"); setMsg(null); }}
          style={{ background: accent }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-white text-sm font-semibold active:scale-95 transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10.5 20a1.8 1.8 0 0 0 3 0" /></svg>
          S&apos;abonner · {count.toLocaleString("fr-FR")}
        </button>
      )}

      {open && (
        <Portal>
          <div className="fixed inset-0 z-[60] grid place-items-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-lg animate-fade-in" onClick={() => setOpen(false)} />
            <div className="relative w-full max-w-sm rounded-3xl glass-tint backdrop-blur-2xl backdrop-saturate-150 border border-[var(--border-strong)] p-5 animate-fade-up shadow-2xl" style={{ ["--tint" as string]: accent }}>
              <CloseButton onClick={() => setOpen(false)} className="absolute top-3 right-3" />

              <div className="flex gap-1 p-1 rounded-full bg-white/[0.06] border border-[var(--border)]">
                {(["sub", "unsub"] as const).map((m) => (
                  <button key={m} onClick={() => { setMode(m); setMsg(null); }}
                    style={mode === m ? { background: accent } : undefined}
                    className={`flex-1 rounded-full py-1.5 text-xs font-semibold transition ${mode === m ? "text-white" : "text-[var(--text-muted)]"}`}>
                    {m === "sub" ? "S'abonner" : "Se désabonner"}
                  </button>
                ))}
              </div>

              <p className="mt-4 text-sm text-[var(--text-muted)]">
                {mode === "sub"
                  ? "Recevez les nouveautés, promos et infos de ce vendeur. Entrez votre numéro."
                  : "Entrez le numéro utilisé pour vous abonner."}
              </p>

              <label className="block text-xs text-[var(--text-muted)] mt-4 mb-1">Pays</label>
              <select value={iso} onChange={(e) => setIso(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--focus)]">
                {COUNTRIES.map((c) => (
                  <option key={c.iso} value={c.iso}>{c.flag} {c.name} (+{c.dial})</option>
                ))}
              </select>

              <label className="block text-xs text-[var(--text-muted)] mt-3 mb-1">Numéro de téléphone</label>
              <div className="flex items-stretch rounded-xl border border-[var(--border)] bg-[var(--surface-2)] overflow-hidden focus-within:border-[var(--focus)]">
                <span className="grid place-items-center px-3 text-sm text-[var(--text-muted)] border-r border-[var(--border)]">+{dial}</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="77 123 45 67"
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] outline-none" />
              </div>

              <button onClick={submit} disabled={busy || phone.replace(/[^0-9]/g, "").length < 6} style={{ background: accent }}
                className="mt-4 w-full rounded-xl text-white font-semibold py-3 disabled:opacity-40">
                {busy ? "…" : mode === "sub" ? "Confirmer l'abonnement" : "Me désabonner"}
              </button>

              {msg && <p className={`mt-3 text-sm text-center ${msg.ok ? "text-green-400" : "text-red-400"}`}>{msg.text}</p>}
              <p className="mt-3 text-center text-xs text-[var(--text-dim)]">{count.toLocaleString("fr-FR")} abonné(s)</p>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
