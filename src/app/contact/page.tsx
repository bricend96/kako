import Link from "next/link";
import type { Metadata } from "next";
import { WhatsAppIcon } from "@/components/blocks";

export const metadata: Metadata = {
  title: "Contact — kako",
  description: "Contactez l'équipe kako.",
};

export default function ContactPage() {
  return (
    <main className="max-w-xl mx-auto px-5 py-12">
      <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">← Retour</Link>
      <h1 className="mt-6 text-3xl font-extrabold text-[var(--text)]">Nous contacter</h1>
      <p className="mt-2 text-[var(--text-muted)]">Une question, un partenariat, un bug à signaler ? Écris-nous.</p>

      <div className="mt-8 space-y-3">
        <a
          href="https://wa.me/237000000000?text=Bonjour%20kako%20%F0%9F%91%8B"
          target="_blank"
          className="flex items-center gap-3 rounded-2xl glass-card p-4 hover:bg-white/5 transition"
        >
          <span className="grid place-items-center w-10 h-10 rounded-full bg-[#25D366] text-white shrink-0"><WhatsAppIcon size={20} /></span>
          <span>
            <span className="block font-semibold text-[var(--text)]">WhatsApp</span>
            <span className="block text-sm text-[var(--text-muted)]">Réponse rapide, du lundi au samedi</span>
          </span>
        </a>

        <a
          href="mailto:contact@kako.site"
          className="flex items-center gap-3 rounded-2xl glass-card p-4 hover:bg-white/5 transition"
        >
          <span className="grid place-items-center w-10 h-10 rounded-full bg-[var(--btn)] text-white shrink-0 text-lg">@</span>
          <span>
            <span className="block font-semibold text-[var(--text)]">E-mail</span>
            <span className="block text-sm text-[var(--text-muted)]">contact@kako.site</span>
          </span>
        </a>
      </div>

      <div className="mt-8 rounded-2xl glass-card p-5">
        <p className="text-sm text-[var(--text-muted)]">
          kako est une plateforme conçue en Afrique pour les entrepreneurs africains. Nous lisons
          chaque message et améliorons le produit avec vos retours.
        </p>
      </div>

      <p className="mt-6 text-xs text-[var(--text-dim)]">
        Coordonnées provisoires (MVP de démonstration) — à remplacer par les vrais canaux avant la mise en ligne.
      </p>
    </main>
  );
}
