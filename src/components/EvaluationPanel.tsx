"use client";

import { useState } from "react";
import type { Reliability } from "@/lib/reliability";
import { Portal } from "./Portal";
import { useLockScroll } from "./useLockScroll";

const TONE: Record<Reliability["tone"], string> = {
  excellent: "#16a34a",
  good: "#0d9488",
  ok: "#d97706",
  watch: "#dc2626",
};

export function EvaluationPanel({
  slug, reliability, subscriberCount, reportsCount, complaintsCount, accent,
}: {
  slug: string; reliability: Reliability; subscriberCount: number;
  reportsCount: number; complaintsCount: number; accent: string;
}) {
  const toneColor = TONE[reliability.tone];

  return (
    <div className="px-5 mt-6 space-y-6 animate-fade-up">
      {/* Indice de fiabilité */}
      <div className="rounded-2xl glass-card p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[var(--text)]">Indice de fiabilité kako</h3>
          <span className="text-xs rounded-full px-2.5 py-1 font-semibold" style={{ background: `${toneColor}22`, color: toneColor }}>{reliability.label}</span>
        </div>
        <div className="mt-4 flex items-end gap-2">
          <span className="text-4xl font-extrabold text-[var(--text)] tabular-nums">{reliability.score}</span>
          <span className="text-[var(--text-muted)] mb-1">/ 100</span>
        </div>
        <div className="mt-2 h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${reliability.score}%`, background: toneColor }} />
        </div>
        <p className="mt-3 text-xs text-[var(--text-muted)] leading-relaxed">
          Calculé automatiquement par kako à partir de signaux réels : vérification d&apos;identité, avis clients,
          ancienneté, nombre d&apos;abonnés, signalements et réclamations. Il n&apos;est pas modifiable par le vendeur.
        </p>
      </div>

      {/* Chiffres clés */}
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Abonnés" value={subscriberCount.toLocaleString("fr-FR")} />
        <Stat label="Signalements" value={String(reportsCount)} danger={reportsCount > 0} />
        <Stat label="Réclamations" value={String(complaintsCount)} danger={complaintsCount > 0} />
      </div>

      {/* Clients non satisfaits */}
      <div className="rounded-2xl glass-card p-5">
        <h3 className="font-bold text-[var(--text)]">Vous n&apos;êtes pas satisfait ?</h3>
        <p className="text-sm text-[var(--text-muted)] mt-1">Signalez un problème avec ce vendeur. Votre retour est confidentiel et compte dans son indice de fiabilité.</p>
        <ComplaintForm slug={slug} accent={accent} />
      </div>

      {/* Signaler une arnaque */}
      <ReportButton slug={slug} />
    </div>
  );
}

function Stat({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="rounded-2xl glass-card p-3 text-center">
      <p className={`text-xl font-bold ${danger ? "text-red-400" : "text-[var(--text)]"}`}>{value}</p>
      <p className="text-xs text-[var(--text-muted)] mt-0.5">{label}</p>
    </div>
  );
}

function ComplaintForm({ slug, accent }: { slug: string; accent: string }) {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (text.trim().length < 5) return;
    setBusy(true);
    try {
      await fetch("/api/report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, type: "complaint", text }) });
      setSent(true); setText("");
    } catch { /* ignore */ }
    finally { setBusy(false); }
  }

  if (sent) return <p className="mt-3 text-sm text-green-400">Merci, votre réclamation a été enregistrée.</p>;

  return (
    <div className="mt-3">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Décrivez le problème rencontré…"
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] outline-none focus:border-[var(--focus)]" />
      <button onClick={submit} disabled={busy || text.trim().length < 5} style={{ background: accent }}
        className="mt-2 rounded-full px-5 py-2 text-white text-sm font-semibold disabled:opacity-40">
        Envoyer ma réclamation
      </button>
    </div>
  );
}

function ReportButton({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  useLockScroll(open);

  async function report() {
    setBusy(true);
    try {
      await fetch("/api/report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, type: "scam" }) });
      setDone(true);
    } catch { /* ignore */ }
    finally { setBusy(false); }
  }

  return (
    <>
      <button onClick={() => { setOpen(true); setDone(false); }}
        className="w-full flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 font-semibold py-3 hover:bg-red-500/15 transition">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
        Signaler cette page (arnaque)
      </button>

      {open && (
        <Portal>
          <div className="fixed inset-0 z-[60] grid place-items-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-lg animate-fade-in" onClick={() => setOpen(false)} />
            <div className="relative w-full max-w-sm rounded-3xl bg-[var(--surface)] border border-[var(--border-strong)] p-6 animate-fade-up shadow-2xl text-center">
              {done ? (
                <>
                  <div className="mx-auto w-12 h-12 rounded-full bg-green-500/15 text-green-400 grid place-items-center text-2xl">✓</div>
                  <p className="mt-3 font-semibold text-[var(--text)]">Signalement enregistré</p>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Merci. L&apos;équipe kako examinera ce vendeur.</p>
                  <button onClick={() => setOpen(false)} className="mt-4 w-full rounded-xl border border-[var(--border-strong)] py-3 font-semibold text-[var(--text)]">Fermer</button>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-[var(--text)]">Signaler une arnaque ?</h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1.5">Signalez ce vendeur si vous pensez qu&apos;il s&apos;agit d&apos;une arnaque. Les faux signalements peuvent être sanctionnés.</p>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button onClick={() => setOpen(false)} className="rounded-xl border border-[var(--border-strong)] py-3 text-sm font-semibold text-[var(--text)]">Annuler</button>
                    <button onClick={report} disabled={busy} className="rounded-xl bg-red-500 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? "…" : "Signaler"}</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
