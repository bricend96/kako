"use client";

import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/** Compte à rebours animé et lisible (jj/hh/mm/ss). Renvoie null si terminé. */
export function Countdown({ until }: { until: string }) {
  const [left, setLeft] = useState(() => Math.max(0, new Date(until).getTime() - Date.now()));
  useEffect(() => {
    const iv = setInterval(() => setLeft(Math.max(0, new Date(until).getTime() - Date.now())), 1000);
    return () => clearInterval(iv);
  }, [until]);

  if (left <= 0) return null;

  const s = Math.floor(left / 1000);
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  const units: [string, number][] = d > 0 ? [["Jours", d], ["Heures", h], ["Min", m], ["Sec", sec]] : [["Heures", h], ["Min", m], ["Sec", sec]];

  return (
    <div className="flex gap-1.5">
      {units.map(([label, v]) => (
        <div key={label} className="bg-white/10 border border-[var(--border)] rounded-xl px-2.5 py-1.5 text-center min-w-[46px]">
          <div key={v} className="animate-pop text-xl font-extrabold tabular-nums leading-none text-[var(--text)]">{pad(v)}</div>
          <div className="text-[9px] uppercase tracking-wide text-[var(--text-muted)] mt-0.5">{label}</div>
        </div>
      ))}
    </div>
  );
}
