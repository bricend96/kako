"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Profile } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import { VerifiedBadge } from "@/components/blocks";

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371, dLat = ((b.lat - a.lat) * Math.PI) / 180, dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function Directory({ profiles }: { profiles: Profile[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [me, setMe] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);

  const cities = useMemo(() => [...new Set(profiles.map((p) => p.city).filter(Boolean))].sort(), [profiles]);
  const catLabel = (k: string) => CATEGORIES.find((c) => c.key === k)?.label ?? k;

  // publicités locales (vendeurs boostés avec un texte de pub)
  const ads = useMemo(() => profiles.filter((p) => p.boosted && p.adText), [profiles]);

  function locate() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setMe({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocating(false); },
      () => setLocating(false),
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    const filtered = profiles.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (city && p.city !== city) return false;
      if (!t) return true;
      return (p.businessName + " " + p.tagline + " " + p.city).toLowerCase().includes(t);
    });
    return filtered
      .map((p) => ({ p, dist: me && p.lat != null && p.lng != null ? distanceKm(me, { lat: p.lat, lng: p.lng }) : null }))
      .sort((a, b) => {
        // boostés d'abord, puis par distance si géoloc, sinon ordre existant
        if (!!b.p.boosted !== !!a.p.boosted) return a.p.boosted ? -1 : 1;
        if (me && a.dist != null && b.dist != null) return a.dist - b.dist;
        return 0;
      });
  }, [profiles, q, cat, city, me]);

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un commerce, un métier, une ville…"
          className="flex-1 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-5 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] outline-none focus:border-[var(--focus)]"
        />
        <button onClick={locate} disabled={locating}
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 text-sm font-semibold border transition ${me ? "bg-[var(--btn)] text-white border-transparent" : "border-[var(--border-strong)] text-[var(--text)] hover:bg-white/5"}`}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
          {locating ? "…" : me ? "Près de moi" : "Près de moi"}
        </button>
      </div>

      {/* Publicité locale (sponsorisé) */}
      {ads.length > 0 && (
        <Link href={`/${ads[0].slug}`} className="mt-3 block rounded-2xl glass-card lift overflow-hidden">
          <div className="flex items-center gap-3 p-3">
            {ads[0].avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ads[0].avatarUrl} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
            )}
            <div className="min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: ads[0].theme.accent }}>Publicité · {ads[0].businessName}</span>
              <p className="text-sm text-[var(--text)] leading-snug">{ads[0].adText}</p>
            </div>
          </div>
        </Link>
      )}

      <div className="hscroll flex gap-2 mt-3 pb-1">
        <Chip active={cat === null} onClick={() => setCat(null)}>Tous les métiers</Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c.key} active={cat === c.key} onClick={() => setCat(c.key)}>{c.label}</Chip>
        ))}
      </div>
      <div className="hscroll flex gap-2 mt-2 pb-1">
        <Chip active={city === null} onClick={() => setCity(null)}>Toutes les villes</Chip>
        {cities.map((c) => (
          <Chip key={c} active={city === c} onClick={() => setCity(c)}>{c}</Chip>
        ))}
      </div>

      <p className="text-sm text-[var(--text-dim)] mt-4">{list.length} résultat(s){me ? " · triés par proximité" : ""}</p>

      {list.length === 0 ? (
        <p className="text-center text-[var(--text-muted)] mt-10">Aucun commerce ne correspond.</p>
      ) : (
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {list.map(({ p, dist }) => (
            <Link key={p.slug} href={`/${p.slug}`} className="glass-card lift rounded-2xl overflow-hidden block relative">
              {p.boosted && (
                <span className="absolute top-2 right-2 z-10 rounded-full bg-amber-400 text-amber-950 text-[10px] font-bold px-2 py-0.5">Sponsorisé</span>
              )}
              <div className="h-28 relative" style={{ background: `linear-gradient(135deg, ${p.theme.from}, ${p.theme.to})` }}>
                {p.coverUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.coverUrl} alt="" className="w-full h-full object-cover opacity-90" />
                )}
                <div className="absolute -bottom-5 left-4 w-12 h-12 rounded-xl grid place-items-center text-white font-bold ring-4 ring-[var(--surface)] overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${p.theme.from}, ${p.theme.to})` }}>
                  {p.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : p.initials}
                </div>
              </div>
              <div className="pt-7 pb-4 px-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: p.theme.accent }}>{catLabel(p.category)}</span>
                  {dist != null && <span className="text-[11px] text-[var(--text-dim)]">{dist < 1 ? "< 1 km" : `${Math.round(dist)} km`}</span>}
                </div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-[var(--text)] truncate">{p.businessName}</h3>
                  {p.verified && <VerifiedBadge size={15} />}
                </div>
                <p className="text-sm text-[var(--text-muted)] truncate">{p.tagline}</p>
                <p className="text-xs text-[var(--text-dim)] mt-1">📍 {p.city}, {p.country}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium border transition ${active ? "bg-[var(--btn)] text-white border-transparent" : "text-[var(--text-muted)] border-[var(--border)] hover:bg-white/5"}`}>
      {children}
    </button>
  );
}
