"use client";

import { useEffect, useState } from "react";
import type { Profile } from "@/lib/types";
import { waLink } from "@/lib/format";
import { WhatsAppIcon } from "@/components/blocks";
import { Portal } from "./Portal";
import { useLockScroll } from "./useLockScroll";

const BOOKING_CATEGORIES = new Set(["coiffeur", "sante", "artisan", "evenementiel", "hotellerie"]);

export function ProfileExtras({ profile }: { profile: Profile }) {
  return (
    <div className="px-5 mt-5 space-y-4">
      {profile.flashSale && <FlashSale profile={profile} />}
      {profile.stories?.length ? <Stories profile={profile} /> : null}
      {BOOKING_CATEGORIES.has(profile.category) && <BookingButton profile={profile} />}
      {profile.category === "restaurant" && profile.dailyMenuNote && (
        <div className="rounded-2xl p-3 text-sm text-white font-medium flex items-center gap-2"
          style={{ background: `linear-gradient(135deg, ${profile.theme.from}, ${profile.theme.to})` }}>
          🍲 Menu du jour : {profile.dailyMenuNote}
        </div>
      )}
    </div>
  );
}

/* ─────────────── Vente flash + compte à rebours ─────────────── */
function FlashSale({ profile }: { profile: Profile }) {
  const fs = profile.flashSale!;
  const [left, setLeft] = useState(() => Math.max(0, new Date(fs.until).getTime() - Date.now()));
  useEffect(() => {
    const iv = setInterval(() => setLeft(Math.max(0, new Date(fs.until).getTime() - Date.now())), 1000);
    return () => clearInterval(iv);
  }, [fs.until]);
  if (left <= 0) return null;

  const s = Math.floor(left / 1000);
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="rounded-2xl p-4 text-white" style={{ background: `linear-gradient(135deg, ${profile.theme.from}, ${profile.theme.to})` }}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide opacity-90">⚡ Vente flash</p>
          <p className="font-bold text-lg leading-tight">{fs.label} · -{fs.percent}%</p>
        </div>
        <div className="flex gap-1 text-center">
          {(d > 0 ? [["j", d], ["h", h], ["m", m]] : [["h", h], ["m", m], ["s", sec]]).map(([u, v]) => (
            <div key={u as string} className="bg-black/25 rounded-lg px-2 py-1 min-w-[38px]">
              <div className="text-base font-bold tabular-nums">{pad(v as number)}</div>
              <div className="text-[10px] opacity-80">{u}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Stories / statuts ─────────────── */
function Stories({ profile }: { profile: Profile }) {
  const stories = profile.stories!;
  const [idx, setIdx] = useState<number | null>(null);
  useLockScroll(idx !== null);

  return (
    <>
      <div className="hscroll flex gap-3 -mx-1 px-1 pb-1">
        {stories.map((st, i) => (
          <button key={i} onClick={() => setIdx(i)} className="shrink-0 flex flex-col items-center gap-1 w-16">
            <span className="w-16 h-16 rounded-full p-[2px]" style={{ background: `linear-gradient(135deg, ${profile.theme.from}, ${profile.theme.to})` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={st.imageUrl} alt="" className="w-full h-full rounded-full object-cover ring-2 ring-[var(--surface)]" />
            </span>
            <span className="text-[10px] text-[var(--text-muted)] truncate w-full text-center">{st.caption ?? "Story"}</span>
          </button>
        ))}
      </div>

      {idx !== null && (
        <Portal>
          <div className="fixed inset-0 z-[60] bg-black grid place-items-center" role="dialog" aria-modal="true">
            <div className="relative w-full max-w-md h-full sm:h-[85vh] sm:rounded-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={stories[idx].imageUrl} alt="" className="w-full h-full object-cover" />
              <div className="absolute top-0 inset-x-0 flex gap-1 p-2">
                {stories.map((_, i) => (
                  <span key={i} className={`h-1 flex-1 rounded-full ${i <= idx ? "bg-white" : "bg-white/30"}`} />
                ))}
              </div>
              {stories[idx].caption && (
                <p className="absolute bottom-6 inset-x-0 text-center text-white font-medium px-6 drop-shadow">{stories[idx].caption}</p>
              )}
              <button onClick={() => setIdx((c) => (c! > 0 ? c! - 1 : c))} className="absolute left-0 top-0 h-full w-1/3" aria-label="Précédent" />
              <button onClick={() => setIdx((c) => (c! < stories.length - 1 ? c! + 1 : null))} className="absolute right-0 top-0 h-full w-2/3" aria-label="Suivant" />
              <button onClick={() => setIdx(null)} className="absolute top-3 right-3 grid place-items-center w-9 h-9 rounded-full bg-black/50 text-white text-xl" aria-label="Fermer">×</button>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}

/* ─────────────── Réservation par créneaux ─────────────── */
const SLOTS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
function BookingButton({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  useLockScroll(open);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return { key: d.toISOString().slice(0, 10), label: d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" }) };
  });

  const message = `Bonjour ${profile.businessName} 👋\nJe souhaite réserver un créneau :\n📅 ${days.find((d) => d.key === day)?.label ?? ""} à ${slot}.\nEst-ce disponible ?`;

  return (
    <>
      <button onClick={() => setOpen(true)} style={{ background: profile.theme.accent }}
        className="w-full flex items-center justify-center gap-2 rounded-full text-white font-semibold py-3 active:scale-95 transition">
        📅 Réserver un créneau
      </button>

      {open && (
        <Portal>
          <div className="fixed inset-0 z-[60] grid place-items-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-lg animate-fade-in" onClick={() => setOpen(false)} />
            <div className="relative w-full max-w-sm rounded-3xl glass-tint backdrop-blur-2xl border border-[var(--border-strong)] p-5 animate-fade-up shadow-2xl" style={{ ["--tint" as string]: profile.theme.accent }}>
              <h3 className="font-bold text-[var(--text)]">Choisir un créneau</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 mb-3">Sélectionnez un jour puis une heure.</p>

              <div className="hscroll flex gap-2 pb-1">
                {days.map((d) => (
                  <button key={d.key} onClick={() => setDay(d.key)} style={day === d.key ? { background: profile.theme.accent } : undefined}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border ${day === d.key ? "text-white border-transparent" : "text-[var(--text-muted)] border-[var(--border)]"}`}>
                    {d.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3">
                {SLOTS.map((s) => (
                  <button key={s} onClick={() => setSlot(s)} style={slot === s ? { background: profile.theme.accent } : undefined}
                    className={`rounded-xl py-2 text-sm font-medium border ${slot === s ? "text-white border-transparent" : "text-[var(--text)] border-[var(--border)]"}`}>
                    {s}
                  </button>
                ))}
              </div>

              <a href={day && slot ? waLink(profile.whatsapp, message) : undefined} target="_blank"
                aria-disabled={!day || !slot}
                className={`mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl text-white font-semibold py-3 ${!day || !slot ? "opacity-40 pointer-events-none" : ""}`}
                style={{ background: "#25D366" }}>
                <WhatsAppIcon size={18} /> Confirmer sur WhatsApp
              </a>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
