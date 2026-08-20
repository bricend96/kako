"use client";

import { useEffect, useMemo, useState } from "react";
import type { Profile, Category } from "@/lib/types";
import { Portal } from "./Portal";

const nf = new Intl.NumberFormat("fr-FR");
const clamp = (s: string, n: number) => (s.length > n ? s.slice(0, n).trimEnd() + "…" : s);

// Libellé "clients servis" adapté au métier (chiffres RÉELS déclarés/agrégés).
const SERVED_LABEL: Partial<Record<Category, string>> = {
  ecommerce: "clients servis",
  agriculture: "clients servis",
  restaurant: "clients régalés",
  coiffeur: "clients satisfaits",
  artisan: "clients satisfaits",
  sante: "patients suivis",
  evenementiel: "clients satisfaits",
  transport: "clients transportés",
  ecole: "élèves formés",
  artiste: "fans",
  immobilier: "clients accompagnés",
  hotellerie: "clients accueillis",
  ong: "personnes soutenues",
};

interface Item {
  icon: React.ReactNode;
  text: string;
  sub?: string;
  stars?: number;
}

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
    <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
);
const TruckMini = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" /><circle cx="7" cy="17.5" r="1.4" /><circle cx="17.5" cy="17.5" r="1.4" />
  </svg>
);
const HeartMini = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 20s-7-4.4-7-9.5A4 4 0 0 1 12 8a4 4 0 0 1 7 2.5C19 15.6 12 20 12 20Z" />
  </svg>
);

export function ActivityFeed({ profile, views }: { profile: Profile; views: number }) {
  const accent = profile.theme.accent;

  const pool = useMemo<Item[]>(() => {
    const items: Item[] = [];

    // Nombre de consultations de la page
    items.push({
      icon: <EyeIcon />,
      text: `${nf.format(Math.max(views, 1))} consultations`,
      sub: "Cette page a déjà été vue",
    });

    // Nombre de clients servis (adapté au métier)
    if (profile.clientsServed && profile.clientsServed > 0) {
      const label = SERVED_LABEL[profile.category] ?? "clients satisfaits";
      items.push({
        icon: <HeartMini />,
        text: `${nf.format(profile.clientsServed)}+ ${label}`,
        sub: "Au fil du temps",
      });
    }

    // Profil vérifié ou non
    items.push(profile.verified
      ? { icon: <CheckIcon />, text: "Vendeur vérifié par kako", sub: "Identité confirmée" }
      : { icon: <CheckIcon />, text: "Profil non encore vérifié", sub: "Vérification pas encore effectuée" });

    // Livraison disponible ou non
    items.push(profile.delivery?.available
      ? { icon: <TruckMini />, text: "Livraison disponible", sub: profile.delivery.zones?.length ? `Zones : ${clamp(profile.delivery.zones.join(", "), 40)}` : "Renseignez-vous auprès du vendeur" }
      : { icon: <TruckMini />, text: "Livraison non disponible", sub: "Retrait sur place ou à convenir" });

    return items.sort(() => Math.random() - 0.5);
  }, [profile, views]);

  const [current, setCurrent] = useState<Item | null>(null);
  const [shown, setShown] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!pool.length) return;
    let i = 0;
    let hideTimer: ReturnType<typeof setTimeout>;
    const cycle = () => {
      setCurrent(pool[i % pool.length]);
      setTick((t) => t + 1);
      setShown(true);
      i++;
      hideTimer = setTimeout(() => setShown(false), 6500);
    };
    const start = setTimeout(cycle, 3500);
    const iv = setInterval(cycle, 15000);
    return () => { clearTimeout(start); clearInterval(iv); clearTimeout(hideTimer); };
  }, [pool]);

  if (!current || !shown) return null;

  return (
    <Portal>
      <div className="fixed left-4 bottom-24 lg:left-6 lg:bottom-6 z-40 w-[18.5rem] max-w-[calc(100vw-2rem)]">
        <div
          key={tick}
          className="animate-fade-up glass-tint backdrop-blur-2xl backdrop-saturate-150 border border-[var(--border-strong)] rounded-2xl shadow-2xl p-3 pr-9 relative flex items-start gap-3"
          style={{ ["--tint" as string]: accent }}
        >
          <span className="grid place-items-center w-9 h-9 rounded-full shrink-0 text-white" style={{ background: accent }}>
            {current.icon}
          </span>
          <div className="min-w-0">
            <p className="text-sm text-[var(--text)] leading-snug">{current.text}</p>
            {current.sub && (
              <p className="mt-0.5 text-xs text-[var(--text-muted)] leading-snug">{current.sub}</p>
            )}
          </div>
          <button
            onClick={() => setShown(false)}
            aria-label="Fermer"
            className="absolute top-2 right-2 text-[var(--text-dim)] hover:text-[var(--text)] text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </Portal>
  );
}
