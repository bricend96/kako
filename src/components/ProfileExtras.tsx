"use client";

import { useState } from "react";
import type { Profile } from "@/lib/types";
import { waLink } from "@/lib/format";
import { Portal } from "./Portal";
import { useLockScroll } from "./useLockScroll";
import { Stories } from "./Stories";

const BOOKING_CATEGORIES = new Set(["coiffeur", "sante", "artisan", "evenementiel", "hotellerie"]);

export function hasExtras(profile: Profile): boolean {
  return (
    !!profile.stories?.length ||
    BOOKING_CATEGORIES.has(profile.category) ||
    (profile.category === "restaurant" && !!profile.dailyMenuNote)
  );
}

function MiniTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-bold text-[var(--text)] mb-2">{children}</h3>;
}

/** Extras d'une page : stories (titrées) + réservation (titrée) + menu du jour. */
export function Extras({ profile, className = "" }: { profile: Profile; className?: string }) {
  if (!hasExtras(profile)) return null;
  return (
    <div className={`space-y-5 ${className}`}>
      {profile.stories?.length ? (
        <div>
          <MiniTitle>Nos stories</MiniTitle>
          <Stories profile={profile} />
        </div>
      ) : null}

      {BOOKING_CATEGORIES.has(profile.category) && (
        <div>
          <MiniTitle>Réserver une prestation</MiniTitle>
          <BookingButton profile={profile} />
        </div>
      )}

      {profile.category === "restaurant" && profile.dailyMenuNote && (
        <div className="rounded-2xl p-3 text-sm text-white font-medium flex items-center gap-2"
          style={{ background: `linear-gradient(135deg, ${profile.theme.from}, ${profile.theme.to})` }}>
          🍲 Menu du jour : {profile.dailyMenuNote}
        </div>
      )}
    </div>
  );
}

const WaIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4C7.7 4 4.15 7.54 4.15 11.9c0 1.4.37 2.76 1.06 3.96L4 20l4.24-1.11a7.9 7.9 0 0 0 3.8.97h.01c4.35 0 7.9-3.54 7.9-7.9 0-2.11-.82-4.1-2.35-5.64Zm-5.55 12.16h-.01a6.56 6.56 0 0 1-3.34-.92l-.24-.14-2.48.65.66-2.42-.16-.25a6.53 6.53 0 0 1-1-3.5c0-3.62 2.95-6.56 6.58-6.56 1.76 0 3.41.69 4.65 1.93a6.52 6.52 0 0 1 1.93 4.64c0 3.62-2.95 6.57-6.57 6.57Z" />
  </svg>
);

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
                <WaIcon size={18} /> Confirmer sur WhatsApp
              </a>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
