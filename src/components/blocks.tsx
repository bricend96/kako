import Link from "next/link";
import type { Profile, Review } from "@/lib/types";
import { waLink, contactMessage } from "@/lib/format";
import { Phone, MapPin, IdCard, Truck, Star, Image as ImageIcon } from "@/components/icons";
import { SocialButton } from "@/components/social-icons";

/** Vrai si la chaîne est une URL d'image (photo réelle) plutôt qu'un emoji. */
export function isPhoto(s?: string): boolean {
  return !!s && /^(https?:|\/)/.test(s);
}

/** Photo réelle (superposée à un fond teinté de repli) ou simple panneau teinté. */
export function Photo({ src, theme, className, iconSize = 26 }: { src?: string; theme: Profile["theme"]; className?: string; iconSize?: number }) {
  return (
    <div className={`relative grid place-items-center ${className ?? ""}`} style={{ background: `linear-gradient(135deg, ${theme.from}22, ${theme.to}22)` }}>
      <ImageIcon size={iconSize} className="text-[var(--text-dim)]" />
      {isPhoto(src) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      )}
    </div>
  );
}

/** Grille de galerie (photos ou placeholders). */
export function GalleryGrid({ items, theme }: { items: string[]; theme: Profile["theme"] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((g, i) => (
        <Photo key={i} src={g} theme={theme} className="aspect-square rounded-2xl overflow-hidden w-full" />
      ))}
    </div>
  );
}

/* ─────────────── En-tête (bannière + avatar + actions) ─────────────── */
export function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <header className="relative lg:hidden">
      {profile.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={profile.coverUrl} alt="" className="h-40 sm:h-52 w-full object-cover" />
      ) : (
        <div className="h-40 sm:h-52 w-full" style={{ background: `linear-gradient(135deg, ${profile.theme.from}, ${profile.theme.to})` }} />
      )}
      <div className="px-5 -mt-12 relative">
        <div
          className="w-24 h-24 rounded-2xl grid place-items-center text-white text-3xl font-bold ring-4 ring-[var(--surface)] overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${profile.theme.from}, ${profile.theme.to})` }}
        >
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            profile.initials
          )}
        </div>
        <h1 className="mt-3 text-2xl font-bold text-[var(--text)] flex items-center gap-1.5">{profile.businessName}{profile.verified && <VerifiedBadge size={20} />}</h1>
        <p className="text-[var(--text-muted)]">{profile.tagline}</p>
        <p className="mt-1 text-sm text-[var(--text-muted)] flex items-center gap-1"><MapPin size={14} /> {profile.city}, {profile.country}</p>
        <p className="mt-3 text-sm text-[var(--text)] leading-relaxed">{profile.bio}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={waLink(profile.whatsapp, contactMessage(profile))}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-white text-sm font-semibold active:scale-95 transition"
          >
            <WhatsAppIcon /> WhatsApp
          </a>
          {profile.phone && (
            <a
              href={`tel:${profile.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 text-[var(--text)] text-sm font-semibold active:scale-95 transition"
            >
              <Phone size={16} /> Appeler
            </a>
          )}
          <Link
            href={`/${profile.slug}/carte`}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 text-[var(--text)] text-sm font-semibold active:scale-95 transition"
          >
            <IdCard size={16} /> Carte kako
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─────────────── Section titrée ─────────────── */
export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="px-5 mt-8 animate-fade-up">
      <h2 className="text-lg font-bold text-[var(--text)] mb-3">{title}</h2>
      {children}
    </section>
  );
}

/* ─────────────── Horaires ─────────────── */
export function Hours({ profile }: { profile: Profile }) {
  if (!profile.hours?.length) return null;
  return (
    <Section title="Horaires">
      <ul className="rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)]">
        {profile.hours.map((h) => (
          <li key={h.day} className="flex justify-between px-4 py-2.5 text-sm">
            <span className="text-[var(--text-muted)]">{h.day}</span>
            <span className={h.slot ? "text-[var(--text)] font-medium" : "text-red-500 font-medium"}>
              {h.slot ?? "Fermé"}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ─────────────── Badges Mobile Money ─────────────── */
export function MomoBadges({ profile }: { profile: Profile }) {
  if (!profile.momo?.length) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 lg:hidden">
      <span className="text-xs text-[var(--text-muted)]">Paiement :</span>
      {profile.momo.map((m) => (
        <span key={m} className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-medium text-[var(--text)]">
          {m}
        </span>
      ))}
    </div>
  );
}

/* ─────────────── Livraison ─────────────── */
export function DeliveryInfo({ profile }: { profile: Profile }) {
  const d = profile.delivery;
  if (!d?.available) return null;
  return (
    <div className="mt-3 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] p-4 text-sm">
      <p className="font-semibold text-[var(--text)] flex items-center gap-1.5"><Truck size={16} /> Livraison disponible</p>
      {d.zones?.length ? <p className="text-[var(--text-muted)] mt-1">Zones : {d.zones.join(", ")}</p> : null}
      {d.fee ? <p className="text-[var(--text-muted)]">Frais : {new Intl.NumberFormat("fr-FR").format(d.fee)} {profile.currency}</p> : null}
    </div>
  );
}

/* ─────────────── Avis ─────────────── */
export function Reviews({ reviews }: { reviews?: Review[] }) {
  if (!reviews?.length) return null;
  return (
    <Section title="Avis clients">
      <div className="space-y-3">
        {reviews.map((r, i) => (
          <div key={i} className="rounded-2xl border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[var(--text)]">{r.author}</span>
              <span className="flex gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} size={14} filled={k < r.rating} />
                ))}
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)] mt-1">{r.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────── Localisation ─────────────── */
export function LocationBlock({ profile }: { profile: Profile }) {
  if (!profile.address) return null;
  return (
    <Section title="Nous trouver">
      <a
        href={profile.mapUrl ?? `https://maps.google.com/?q=${encodeURIComponent(profile.address)}`}
        target="_blank"
        className="block rounded-2xl border border-[var(--border)] p-4 text-sm active:scale-[0.99] transition"
      >
        <p className="text-[var(--text)] font-medium flex items-center gap-1.5"><MapPin size={16} /> {profile.address}</p>
        <p className="text-[var(--text-muted)] mt-1">Ouvrir dans Google Maps →</p>
      </a>
    </Section>
  );
}

/* ─────────────── Réseaux sociaux (icônes de marque) ─────────────── */
export function Socials({ profile }: { profile: Profile }) {
  const socials = profile.socials?.filter((s) => s.url) ?? [];
  if (!socials.length) return null;
  return (
    <div className="px-5 mt-6 lg:hidden">
      <p className="text-xs text-[var(--text-muted)] mb-2">
        Retrouvez-nous aussi sur nos autres canaux — cliquez les liens ci-dessous
      </p>
      <div className="hscroll flex gap-2 -mx-5 px-5 pb-1">
        {socials.map((s, i) => (
          <SocialButton key={i} type={s.type} url={s.url} label={s.label} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────── Bouton de fermeture (rouge, animé) ─────────────── */
export function CloseButton({ onClick, className = "" }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Fermer"
      className={`animate-close grid place-items-center w-8 h-8 rounded-full bg-red-500 text-white hover:bg-red-600 active:scale-90 transition ${className}`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
    </button>
  );
}

/* ─────────────── Badge vérifié (sceau festonné, style « badge-check ») ─────────────── */
// Sceau généré (bosses régulières autour d'un cercle) — même silhouette que
// l'icône Font Awesome "badge-check", en SVG inline sans dépendance.
const SEAL_PATH = (() => {
  const cx = 12, cy = 12, r = 8.3, amp = 2.3, bumps = 8;
  const step = (Math.PI * 2) / bumps;
  let d = "";
  for (let i = 0; i < bumps; i++) {
    const a0 = i * step, am = a0 + step / 2, a1 = (i + 1) * step;
    const p0x = cx + Math.cos(a0) * r, p0y = cy + Math.sin(a0) * r;
    const pcx = cx + Math.cos(am) * (r + amp), pcy = cy + Math.sin(am) * (r + amp);
    const p1x = cx + Math.cos(a1) * r, p1y = cy + Math.sin(a1) * r;
    d += (i === 0 ? `M${p0x.toFixed(2)} ${p0y.toFixed(2)}` : "") + ` Q${pcx.toFixed(2)} ${pcy.toFixed(2)} ${p1x.toFixed(2)} ${p1y.toFixed(2)}`;
  }
  return d + "Z";
})();

export function VerifiedBadge({ size = 18 }: { size?: number }) {
  const px = Math.round(size * 1.25); // le sceau déborde légèrement du cercle
  return (
    <svg width={px} height={px} viewBox="0 0 24 24" className="shrink-0" role="img" aria-label="Compte vérifié">
      <title>Compte vérifié</title>
      <path d={SEAL_PATH} fill="#1d9bf0" />
      <path d="M8.2 12.4l2.5 2.5 5-5.2" fill="none" stroke="#ffffff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─────────────── Bloc « Le vendeur » (photo + bio + compteurs de confiance) ─────────────── */
export function OwnerCard({ profile }: { profile: Profile }) {
  if (!profile.ownerName) return null;
  const year = new Date(profile.createdAt).getFullYear();
  return (
    <section className="px-5 mt-8 animate-fade-up">
      <div className="rounded-2xl glass-card p-4">
        <div className="flex items-center gap-3">
          <Photo src={profile.ownerPhotoUrl} theme={profile.theme} className="w-14 h-14 rounded-full overflow-hidden shrink-0" iconSize={22} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-[var(--text)] truncate">{profile.ownerName}</p>
              {profile.verified && <VerifiedBadge size={16} />}
            </div>
            {profile.ownerRole && <p className="text-xs text-[var(--text-muted)]">{profile.ownerRole}</p>}
          </div>
        </div>
        {profile.ownerBio && <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">{profile.ownerBio}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/[0.05] border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-muted)]">📅 Membre depuis {year}</span>
          {profile.clientsServed ? (
            <span className="rounded-full bg-white/[0.05] border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-muted)]">🤝 {profile.clientsServed}+ clients servis</span>
          ) : null}
          {profile.verified && (
            <span className="rounded-full bg-sky-500/15 border border-sky-500/25 px-2.5 py-1 text-xs text-sky-300">Profil vérifié</span>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Bouton WhatsApp flottant ─────────────── */
export function WhatsAppFab({ profile }: { profile: Profile }) {
  return (
    <a
      href={waLink(profile.whatsapp, contactMessage(profile))}
      target="_blank"
      aria-label="Contacter sur WhatsApp"
      style={{ background: profile.theme.accent }}
      className="fixed bottom-20 right-5 z-40 grid place-items-center w-14 h-14 rounded-full text-white shadow-xl active:scale-90 transition animate-float lg:hidden"
    >
      <WhatsAppIcon size={26} />
    </a>
  );
}

/* ─────────────── Pied de page kako ─────────────── */
export function KakoFooter() {
  return (
    <footer className="mt-12 px-5 py-8 text-center border-t border-[var(--border)]">
      <p className="text-xs text-[var(--text-dim)]">
        © {new Date().getFullYear()} <span className="font-semibold">kako</span>. Tous droits réservés.
      </p>
    </footer>
  );
}

/* ─────────────── Icône WhatsApp ─────────────── */
export function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4C7.7 4 4.15 7.54 4.15 11.9c0 1.4.37 2.76 1.06 3.96L4 20l4.24-1.11a7.9 7.9 0 0 0 3.8.97h.01c4.35 0 7.9-3.54 7.9-7.9 0-2.11-.82-4.1-2.35-5.64Zm-5.55 12.16h-.01a6.56 6.56 0 0 1-3.34-.92l-.24-.14-2.48.65.66-2.42-.16-.25a6.53 6.53 0 0 1-1-3.5c0-3.62 2.95-6.56 6.58-6.56 1.76 0 3.41.69 4.65 1.93a6.52 6.52 0 0 1 1.93 4.64c0 3.62-2.95 6.57-6.57 6.57Zm3.6-4.92c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.44.1-.13.2-.51.64-.62.77-.11.13-.23.15-.43.05-.2-.1-.83-.31-1.59-.98-.59-.52-.98-1.17-1.1-1.37-.11-.2-.01-.3.09-.4.09-.09.2-.23.3-.35.1-.12.13-.2.2-.34.07-.13.03-.25-.02-.35-.05-.1-.44-1.07-.6-1.46-.16-.38-.32-.33-.44-.34-.11-.01-.24-.01-.37-.01a.72.72 0 0 0-.52.24c-.18.2-.68.67-.68 1.62 0 .96.7 1.88.8 2.01.1.13 1.38 2.11 3.34 2.96.47.2.83.32 1.11.42.47.15.9.13 1.23.08.38-.06 1.17-.48 1.33-.94.16-.46.16-.86.12-.94-.05-.08-.18-.13-.38-.23Z" />
    </svg>
  );
}
