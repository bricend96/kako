"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { requestOtp, verifyOtpAction, demoLogin } from "./actions";

export default function LoginForm({ demoMode }: { demoMode: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function askCode() {
    setError(null);
    start(async () => {
      const res = await requestOtp(phone);
      if (!res.ok) return setError(res.error ?? "Erreur");
      setDemoCode(res.demoCode ?? null);
      setStep("otp");
    });
  }

  function confirm() {
    setError(null);
    start(async () => {
      const res = await verifyOtpAction(phone, code);
      if (!res.ok) return setError(res.error ?? "Erreur");
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-[var(--text)]">Connexion</h1>
      <p className="text-[var(--text-muted)] mt-1 text-sm">
        On t&apos;envoie un code à 6 chiffres. Pas besoin d&apos;email.
      </p>

      {step === "phone" && (
        <div className="mt-6 space-y-3">
          <label className="block text-sm font-medium text-[var(--text)]">Numéro WhatsApp</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            placeholder="Ex : 221 77 123 45 67"
            className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-[var(--text)] outline-none focus:border-[var(--focus)]"
          />
          <button
            onClick={askCode}
            disabled={pending}
            className="w-full rounded-xl bg-[var(--btn)] text-white font-semibold py-3 disabled:opacity-50"
          >
            {pending ? "Envoi du code…" : "Recevoir le code"}
          </button>
        </div>
      )}

      {step === "otp" && (
        <div className="mt-6 space-y-3">
          {demoMode && demoCode && (
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800">
              Mode démo : ton code est <b className="font-mono text-base">{demoCode}</b>
            </div>
          )}
          <label className="block text-sm font-medium text-[var(--text)]">Code reçu</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-[var(--text)] tracking-[0.4em] text-center text-lg outline-none focus:border-[var(--focus)]"
          />
          <button
            onClick={confirm}
            disabled={pending}
            className="w-full rounded-xl bg-[var(--btn)] text-white font-semibold py-3 disabled:opacity-50"
          >
            {pending ? "Connexion…" : "Se connecter"}
          </button>
          <button onClick={() => setStep("phone")} className="w-full text-sm text-[var(--text-muted)] py-1">
            ← Changer de numéro
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {demoMode && (
        <div className="mt-8 pt-6 border-t border-[var(--border)]">
          <form action={demoLogin}>
            <button className="w-full rounded-xl border-2 border-dashed border-[var(--border)] text-[var(--text)] font-semibold py-3 hover:bg-[var(--surface-2)]">
              Entrer directement en mode démo
            </button>
          </form>
          <p className="text-xs text-[var(--text-muted)] mt-2 text-center">
            Te connecte au compte démo qui possède les 13 sites d&apos;exemple.
          </p>
        </div>
      )}
    </div>
  );
}
