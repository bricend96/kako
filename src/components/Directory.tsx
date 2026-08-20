"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Profile } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import { VerifiedBadge } from "@/components/blocks";

export function Directory({ profiles }: { profiles: Profile[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);

  const cities = useMemo(() => [...new Set(profiles.map((p) => p.city).filter(Boolean))].sort(), [profiles]);
  const catLabel = (k: string) => CATEGORIES.find((c) => c.key === k)?.label ?? k;

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return profiles.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (city && p.city !== city) return false;
      if (!t) return true;
      return (p.businessName + " " + p.tagline + " " + p.city).toLowerCase().includes(t);
    });
  }, [profiles, q, cat, city]);

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Rechercher un commerce, un métier, une ville…"
        className="w-full rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-5 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] outline-none focus:border-[var(--focus)]"
      />

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

      <p className="text-sm text-[var(--text-dim)] mt-4">{list.length} résultat(s)</p>

      {list.length === 0 ? (
        <p className="text-center text-[var(--text-muted)] mt-10">Aucun commerce ne correspond.</p>
      ) : (
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {list.map((p) => (
            <Link key={p.slug} href={`/${p.slug}`} className="glass-card lift rounded-2xl overflow-hidden block">
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
                <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: p.theme.accent }}>{catLabel(p.category)}</span>
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
