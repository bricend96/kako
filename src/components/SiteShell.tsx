import Link from "next/link";
import type { Profile } from "@/lib/types";
import { waLink, contactMessage } from "@/lib/format";
import { WhatsAppIcon, VerifiedBadge } from "@/components/blocks";
import { Phone, MapPin, IdCard } from "@/components/icons";
import { SocialButton } from "@/components/social-icons";

/**
 * Coquille responsive.
 * - Mobile : rien à l'écran (les templates gardent leur en-tête plein largeur).
 * - Desktop (lg+) : sidebar large en "liquid glass" (identité + contact + paiement + réseaux)
 *   à gauche, panneau de contenu blanc animé à droite → rendu "vrai site".
 */
const clamp = (s: string, n: number) => (s.length > n ? s.slice(0, n).trimEnd() + "…" : s);

export function SiteShell({ profile, children }: { profile: Profile; children: React.ReactNode }) {
  const t = profile.theme;
  return (
    <div
      className="min-h-dvh"
      style={{
        background: `radial-gradient(1200px 600px at 15% -10%, ${t.from}1f, transparent 60%), radial-gradient(1000px 500px at 100% 0%, ${t.to}1a, transparent 55%), var(--background)`,
      }}
    >
      <div className="lg:grid lg:grid-cols-[minmax(320px,380px)_1fr] lg:gap-6 lg:max-w-6xl lg:mx-auto lg:px-6 lg:py-6">
        {/* ── Sidebar desktop ── */}
        <aside className="hidden lg:flex lg:flex-col lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] rounded-3xl glass-tint backdrop-blur-2xl backdrop-saturate-150 p-6 animate-fade-up overflow-hidden"
          style={{ ["--tint" as string]: t.accent }}
        >
          <div
            className="w-20 h-20 shrink-0 rounded-2xl grid place-items-center text-white text-2xl font-bold ring-4 ring-white/20 overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
          >
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              profile.initials
            )}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-[var(--text)] leading-tight flex items-center gap-1.5">{profile.businessName}{profile.verified && <VerifiedBadge size={18} />}</h1>
          <p className="text-[var(--text-muted)] mt-0.5">{clamp(profile.tagline, 48)}</p>
          <p className="mt-2 text-sm text-[var(--text-muted)] flex items-center gap-1"><MapPin size={14} /> {profile.city}, {profile.country}</p>
          {profile.bio && <p className="mt-3 text-sm text-[var(--text)] leading-relaxed">{clamp(profile.bio, 100)}</p>}

          <div className="mt-5 space-y-2">
            <a
              href={waLink(profile.whatsapp, contactMessage(profile))}
              target="_blank"
              className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-white text-sm font-semibold transition active:scale-[0.97] hover:brightness-105"
            >
              <WhatsAppIcon size={18} /> Contacter sur WhatsApp
            </a>
            <div className="grid grid-cols-2 gap-2">
              {profile.phone && (
                <a
                  href={`tel:${profile.phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-white/[0.04] px-4 py-2.5 text-[var(--text)] text-sm font-semibold transition active:scale-[0.97] hover:bg-white/10"
                >
                  <Phone size={16} /> Appeler
                </a>
              )}
              <Link
                href={`/${profile.slug}/carte`}
                className={`flex items-center justify-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-white/[0.04] px-4 py-2.5 text-[var(--text)] text-sm font-semibold transition active:scale-[0.97] hover:bg-white/10 ${profile.phone ? "" : "col-span-2"}`}
              >
                <IdCard size={16} /> Carte kako
              </Link>
            </div>
          </div>

          {profile.momo?.length ? (
            <div className="mt-5">
              <p className="text-xs text-[var(--text-muted)] mb-1.5">Paiement</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.momo.map((m) => (
                  <span key={m} className="rounded-full bg-white/[0.06] border border-white/10 px-2.5 py-1 text-xs font-medium text-[var(--text)]">{m}</span>
                ))}
              </div>
            </div>
          ) : null}

          {profile.socials?.filter((s) => s.url).length ? (
            <div className="mt-5">
              <p className="text-xs text-[var(--text-muted)] mb-2">Aussi présent sur ces canaux</p>
              <div className="hscroll flex gap-2 -mx-1 px-1 pb-1">
                {profile.socials.filter((s) => s.url).map((s, i) => (
                  <SocialButton key={i} type={s.type} url={s.url} label={s.label} />
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-auto pt-6">
            <Link href="/" className="text-xs text-[var(--text-dim)] hover:text-[var(--text-muted)]">
              Propulsé par <span className="font-semibold">kako</span>
            </Link>
          </div>
        </aside>

        {/* ── Contenu ── */}
        <main className="bg-[var(--surface)] min-h-dvh lg:min-h-[calc(100dvh-3rem)] lg:rounded-3xl lg:border lg:border-[var(--border)] animate-fade-up">
          {children}
        </main>
      </div>
    </div>
  );
}
