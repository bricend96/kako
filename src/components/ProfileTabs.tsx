"use client";

import { useState } from "react";
import Link from "next/link";
import type { Profile } from "@/lib/types";
import type { Reliability } from "@/lib/reliability";
import { Star, MapPin, IdCard } from "@/components/icons";
import { EvaluationPanel } from "./EvaluationPanel";
import { SubscribeButton } from "./SubscribeButton";
import { ProfileExtras } from "./ProfileExtras";
import { Portal } from "./Portal";

type TabKey = "accueil" | "avis" | "evaluation" | "localisation";

const HomeIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 11 12 4l8 7M6 10v9h12v-9" /><path d="M10 19v-5h4v5" /></svg>
);
const ShieldIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 3l7 3v5c0 4.6-3 7.8-7 9-4-1.2-7-4.4-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>
);

export function ProfileTabs({
  profile, reliability, subscriberCount, reportsCount, complaintsCount, children,
}: {
  profile: Profile;
  reliability: Reliability;
  subscriberCount: number;
  reportsCount: number;
  complaintsCount: number;
  children: React.ReactNode;
}) {
  const [tab, setTab] = useState<TabKey>("accueil");
  const accent = profile.theme.accent;
  const reviews = profile.reviews ?? [];

  const tabs: { key: TabKey; label: string; short: string; icon: React.ReactNode }[] = [
    { key: "accueil", label: "Accueil", short: "Accueil", icon: <HomeIcon size={20} /> },
    { key: "avis", label: `Avis clients${reviews.length ? ` (${reviews.length})` : ""}`, short: "Avis", icon: <Star size={20} /> },
    { key: "evaluation", label: "Évaluation kako", short: "Fiabilité", icon: <ShieldIcon size={20} /> },
    { key: "localisation", label: "Localisation", short: "Lieu", icon: <MapPin size={20} /> },
  ];

  return (
    <div className="pb-24 lg:pb-0">
      {/* Abonnement + compteur (visible sur tous les onglets) */}
      <div className="px-4 pt-4 pb-1 flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-[var(--text-muted)]">
          <b className="text-[var(--text)]">{subscriberCount.toLocaleString("fr-FR")}</b> abonné(s)
        </p>
        <SubscribeButton slug={profile.slug} initialCount={subscriberCount} country={profile.country} accent={accent} />
      </div>

      {/* Barre d'onglets — desktop : collée en haut au scroll */}
      <div className="hidden lg:block sticky top-0 z-30 glass backdrop-blur-2xl backdrop-saturate-150 border-b border-[var(--border)]">
        <div className="flex gap-1 px-3 py-2">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={tab === t.key ? { background: accent } : undefined}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${tab === t.key ? "text-white" : "text-[var(--text-muted)] hover:text-[var(--text)]"}`}>
              {t.label}
            </button>
          ))}
          <Link href={`/${profile.slug}/carte`} className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition">
            Carte de visite
          </Link>
        </div>
      </div>

      {/* Contenu */}
      {tab === "accueil" && (
        <>
          <ProfileExtras profile={profile} />
          {children}
        </>
      )}

      {tab === "avis" && (
        <div className="px-5 mt-6 animate-fade-up">
          <h2 className="text-lg font-bold text-[var(--text)] mb-3">Avis clients</h2>
          {reviews.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">Aucun avis pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((r, i) => (
                <div key={i} className="rounded-2xl glass-card p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[var(--text)]">{r.author}</span>
                    <span className="flex gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, k) => <Star key={k} size={14} filled={k < r.rating} />)}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] mt-1">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "evaluation" && (
        <EvaluationPanel slug={profile.slug} reliability={reliability} subscriberCount={subscriberCount} reportsCount={reportsCount} complaintsCount={complaintsCount} accent={accent} />
      )}

      {tab === "localisation" && (
        <div className="px-5 mt-6 animate-fade-up">
          <h2 className="text-lg font-bold text-[var(--text)] mb-3">Localisation</h2>
          {profile.address ? (
            <a href={profile.mapUrl ?? `https://maps.google.com/?q=${encodeURIComponent(profile.address)}`} target="_blank"
              className="block rounded-2xl glass-card p-4 text-sm active:scale-[0.99] transition">
              <p className="text-[var(--text)] font-medium flex items-center gap-1.5"><MapPin size={16} /> {profile.address}</p>
              <p className="text-[var(--text-muted)] mt-1">{profile.city}, {profile.country}</p>
              <p className="mt-2 text-[var(--text-muted)]">Ouvrir dans Google Maps →</p>
            </a>
          ) : (
            <p className="text-sm text-[var(--text-muted)] flex items-center gap-1.5"><MapPin size={16} /> {profile.city}, {profile.country}</p>
          )}
        </div>
      )}

      {/* Bottom nav — mobile uniquement */}
      <Portal>
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 glass backdrop-blur-2xl backdrop-saturate-150 border-t border-[var(--border-strong)]" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          <div className="grid grid-cols-5">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className="flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition"
                style={{ color: tab === t.key ? accent : "var(--text-muted)" }}>
                {t.icon}
                <span>{t.short}</span>
              </button>
            ))}
            <Link href={`/${profile.slug}/carte`} className="flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium text-[var(--text-muted)]">
              <IdCard size={20} />
              <span>Carte</span>
            </Link>
          </div>
        </nav>
      </Portal>
    </div>
  );
}
