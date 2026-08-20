import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs — kako",
  description: "Gratuit, Pro (1 000 XAF/mois) ou Premium (2 500 XAF/mois). Paiement en Mobile Money.",
};

const TIERS = [
  {
    name: "Gratuit",
    price: "0",
    period: "",
    tagline: "Pour tester et démarrer",
    highlight: false,
    cta: "Commencer",
    features: [
      "1 seul mini-site",
      "7 jours d'essai des options Pro",
      "Boutons WhatsApp & carte de visite",
      "Réseaux sociaux illimités",
      "Sous-domaine kako.site",
    ],
  },
  {
    name: "Pro",
    price: "1 000",
    period: "XAF / mois",
    tagline: "Pour vendre sérieusement",
    highlight: true,
    cta: "Choisir Pro",
    features: [
      "Sites illimités",
      "Paiement Mobile Money accepté avant la commande",
      "Catalogue & catégories illimités",
      "Statistiques de la page",
      "Sans badge « Créé avec kako »",
    ],
  },
  {
    name: "Premium",
    price: "2 500",
    period: "XAF / mois",
    tagline: "Pour inspirer confiance",
    highlight: false,
    cta: "Choisir Premium",
    features: [
      "Tout le plan Pro",
      "Badge de vérification ✓",
      "Paiement Mobile Money accepté avant la commande",
      "Mise en avant dans l'annuaire",
      "Support prioritaire",
    ],
  },
];

export default function TarifsPage() {
  return (
    <main className="max-w-5xl mx-auto px-5 py-12">
      <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">← Retour</Link>
      <div className="text-center mt-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)]">Des tarifs simples, en Mobile Money</h1>
        <p className="mt-3 text-[var(--text-muted)]">Commence gratuitement. Passe à un plan payant quand tu vends.</p>
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-6 items-start">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className={`relative rounded-3xl p-6 ${t.highlight ? "glass-tint backdrop-blur-2xl border border-[var(--border-strong)] md:-mt-3 md:mb-3" : "glass-card"}`}
            style={t.highlight ? ({ ["--tint" as string]: "#7c5cff" }) : undefined}
          >
            {t.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--btn)] text-white text-xs font-semibold px-3 py-1">
                Le plus choisi
              </span>
            )}
            <h2 className="text-lg font-bold text-[var(--text)]">{t.name}</h2>
            <p className="text-sm text-[var(--text-muted)]">{t.tagline}</p>
            <div className="mt-4 flex items-end gap-1">
              <span className="text-4xl font-extrabold text-[var(--text)]">{t.price}</span>
              {t.period && <span className="text-sm text-[var(--text-muted)] mb-1">{t.period}</span>}
            </div>
            <ul className="mt-5 space-y-2">
              {t.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm text-[var(--text)]">
                  <span className="text-green-400 shrink-0">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className={`mt-6 block text-center rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98] ${t.highlight ? "bg-[var(--btn)] text-white hover:brightness-110" : "border border-[var(--border-strong)] text-[var(--text)] hover:bg-white/5"}`}
            >
              {t.cta}
            </Link>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-[var(--text-dim)] mt-8">
        Prix en francs CFA (XAF). Paiement via Orange Money, MTN MoMo, Wave… Sans engagement, résiliable à tout moment.
      </p>
    </main>
  );
}
