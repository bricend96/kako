import Link from "next/link";
import { getPublishedProfiles } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";
import { WhatsAppIcon, VerifiedBadge } from "@/components/blocks";
import { KakoBadge } from "@/components/KakoLogo";

export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<string, string> = {
  coiffeur: "Coiffure & beauté",
  ecommerce: "Boutique en ligne",
  restaurant: "Restaurant",
  ecole: "École & formation",
  artiste: "Artiste & musique",
  artisan: "Artisan & services",
  sante: "Santé & bien-être",
  immobilier: "Immobilier",
  evenementiel: "Événementiel",
  transport: "Transport & VTC",
  ong: "ONG & association",
  agriculture: "Agriculture & agro",
  hotellerie: "Hôtellerie",
};

export default async function Home() {
  const [profiles, user] = await Promise.all([getPublishedProfiles(), getCurrentUser()]);

  return (
    <main className="flex-1">
      {/* NAV */}
      <nav className="sticky top-0 z-30 glass backdrop-blur-2xl backdrop-saturate-150">
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <KakoBadge size={30} />
            <span className="text-2xl font-extrabold tracking-tight">kako</span>
          </span>
          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-[var(--text-muted)]">
            <a href="#demos" className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-[var(--text)]">Démos</a>
            <Link href="/decouvrir" className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-[var(--text)]">Découvrir</Link>
            <Link href="/tarifs" className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-[var(--text)]">Tarifs</Link>
            <a href="#about" className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-[var(--text)]">À propos</a>
            <Link href="/contact" className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-[var(--text)]">Contact</Link>
          </div>
          <Link
            href={user ? "/dashboard" : "/login"}
            className="rounded-full bg-[var(--btn)] text-white text-sm font-semibold px-4 py-2 transition active:scale-[0.97] hover:brightness-110 shrink-0"
          >
            {user ? "Tableau de bord" : "Créer mon site"}
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="max-w-6xl mx-auto px-5 pt-14 pb-16 text-center stagger"
        style={{ background: "radial-gradient(760px 340px at 50% -60px, #16a34a1a, transparent 70%)" }}
      >
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[var(--text)]">
          Ton mini-site pro,
          <br />
          <span className="text-[#0b8a43]">connecté à WhatsApp</span>
        </h1>
        <p className="mt-5 max-w-2xl mx-auto text-lg text-[var(--text-muted)]">
          Boutique, salon, restaurant, carte de visite… Crée ta page en 5 minutes depuis ton
          téléphone. Tes clients commandent sur <b>WhatsApp</b>, tu es payé en <b>Mobile Money</b>.
          Pas besoin de savoir coder.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={user ? "/dashboard" : "/login"}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0b8a43] px-7 py-3.5 text-white font-semibold"
          >
            <WhatsAppIcon /> Créer mon site gratuit
          </Link>
          <a
            href="#demos"
            className="inline-flex items-center justify-center rounded-full border border-[var(--border)] px-7 py-3.5 text-[var(--text)] font-semibold"
          >
            Voir les exemples
          </a>
        </div>

        {/* Bande d'images (vraies photos des sites de démo) */}
        <div className="mt-14 grid grid-cols-3 sm:grid-cols-6 gap-2.5 max-w-4xl mx-auto">
          {profiles.slice(0, 6).map((p, i) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className={`relative rounded-2xl overflow-hidden aspect-square lift block ${i >= 3 ? "hidden sm:block" : ""}`}
              style={{ background: `linear-gradient(135deg, ${p.theme.from}, ${p.theme.to})` }}
            >
              {p.coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.coverUrl} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              )}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-[11px] font-semibold text-white truncate">
                {p.businessName}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* VALEURS — liste asymétrique plutôt que trois cartes identiques */}
      <section className="bg-[var(--surface-2)] py-16">
        <div className="max-w-3xl mx-auto px-5 space-y-8 stagger">
          <Feature
            index="01"
            title="Un design par métier"
            text="Un coiffeur veut des rendez-vous, un vendeur veut des commandes, un resto veut un menu : chaque activité a son modèle prêt à l'emploi, pas un gabarit unique."
          />
          <Feature
            index="02"
            title="Vente sur WhatsApp"
            text="Chaque produit a un bouton « Commander » qui ouvre WhatsApp avec le message déjà écrit. Zéro friction pour le client."
          />
          <Feature
            index="03"
            title="Carte de visite numérique"
            text="Un QR code à partager en statut ou à imprimer. Le client enregistre ton contact en un clic."
          />
        </div>
      </section>

      {/* DEMOS */}
      <section id="demos" className="max-w-6xl mx-auto px-5 py-16">
        <h2 className="text-3xl font-bold text-center text-[var(--text)]">Exemples en direct</h2>
        <p className="text-center text-[var(--text-muted)] mt-2">
          Treize métiers, treize pages différentes. Clique pour explorer.
        </p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {profiles.map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="group glass-card lift rounded-2xl overflow-hidden hover:border-[var(--border-strong)]"
            >
              <div
                className="h-32 relative"
                style={{ background: `linear-gradient(135deg, ${p.theme.from}, ${p.theme.to})` }}
              >
                {p.coverUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.coverUrl} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute -bottom-6 left-5 w-14 h-14 rounded-xl grid place-items-center text-white font-bold ring-4 ring-[var(--surface)] overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${p.theme.from}, ${p.theme.to})` }}>
                  {p.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.avatarUrl} alt="" loading="lazy" className="w-full h-full object-cover" />
                  ) : p.initials}
                </div>
              </div>
              <div className="pt-8 pb-5 px-5">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                  {CATEGORY_LABEL[p.category]}
                </span>
                <h3 className="font-bold text-[var(--text)] mt-0.5 flex items-center gap-1.5">{p.businessName}{p.verified && <VerifiedBadge size={16} />}</h3>
                <p className="text-sm text-[var(--text-muted)]">{p.tagline}</p>
                <span className="mt-3 inline-block text-sm font-semibold group-hover:underline" style={{ color: p.theme.accent }}>
                  Ouvrir la page →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* À PROPOS */}
      <section id="about" className="bg-[var(--surface-2)] py-16">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="text-3xl font-bold text-[var(--text)]">À propos de kako</h2>
          <p className="mt-4 text-[var(--text-muted)] leading-relaxed">
            kako est né d&apos;un constat simple : en Afrique, des millions de vendeurs, artisans,
            restaurateurs et créateurs font tout leur business sur WhatsApp — sans site, sans vitrine,
            sans moyen simple d&apos;être payés. kako leur donne un mini-site pensé pour leur métier,
            connecté à WhatsApp et au Mobile Money, créé en quelques minutes depuis un téléphone.
          </p>
          <p className="mt-3 text-[var(--text-muted)] leading-relaxed">
            Notre mission : rendre la présence en ligne professionnelle accessible à tous, quels que
            soient le budget, la connexion ou le niveau technique.
          </p>

          <div className="mt-8 rounded-2xl glass-card p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl grid place-items-center text-white text-xl font-bold shrink-0"
              style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}>
              NB
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--text-dim)]">Développeur de la plateforme</p>
              <p className="font-bold text-[var(--text)]">Njapa Brice Diotreph</p>
              <p className="text-sm text-[var(--text-muted)]">Conception & développement de kako</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[var(--border)] py-10 text-center text-sm text-[var(--text-muted)]">
        <p className="text-lg font-extrabold text-[var(--text)] flex items-center justify-center gap-2"><KakoBadge size={26} /> kako</p>
        <p className="mt-1">Nom de travail provisoire · MVP de démonstration</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
          <Link href="/tarifs" className="hover:text-[var(--text)] underline-offset-2 hover:underline">Tarifs</Link>
          <Link href="/contact" className="hover:text-[var(--text)] underline-offset-2 hover:underline">Contact</Link>
          <a href="#about" className="hover:text-[var(--text)] underline-offset-2 hover:underline">À propos</a>
          <Link href="/cgu" className="hover:text-[var(--text)] underline-offset-2 hover:underline">CGU</Link>
          <Link href="/confidentialite" className="hover:text-[var(--text)] underline-offset-2 hover:underline">Confidentialité</Link>
        </div>
        <p className="mt-4 text-xs text-[var(--text-dim)]">Développé par Njapa Brice Diotreph</p>
      </footer>
    </main>
  );
}

function Feature({ index, title, text }: { index: string; title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <span className="text-sm font-bold text-[var(--text-dim)] pt-1 tabular-nums">{index}</span>
      <div>
        <h3 className="font-bold text-[var(--text)]">{title}</h3>
        <p className="mt-1 text-[var(--text-muted)] leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
