import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation — kako",
  description: "Les conditions d'utilisation du service kako.",
};

// ⚠️ SQUELETTE À FAIRE RELIRE PAR UN JURISTE AVANT MISE EN LIGNE.
// Les mentions entre [crochets] doivent être complétées.

export default function CguPage() {
  return (
    <main className="max-w-2xl mx-auto px-5 py-12">
      <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">← Retour</Link>
      <h1 className="mt-4 text-3xl font-bold text-[var(--text)]">Conditions générales d&apos;utilisation</h1>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Dernière mise à jour : [date] · Version provisoire à faire relire.</p>

      <div className="mt-8 space-y-6 text-[var(--text)] leading-relaxed">
        <Section title="1. Objet">
          kako est un service qui permet de créer un mini-site (boutique, page pro, carte de visite
          numérique) relié à WhatsApp. Ces conditions régissent votre utilisation du service.
        </Section>

        <Section title="2. Compte">
          La création d&apos;un compte se fait via votre numéro de téléphone. Vous êtes responsable de la
          confidentialité de l&apos;accès à votre téléphone et des contenus publiés depuis votre compte.
        </Section>

        <Section title="3. Contenus publiés">
          Vous êtes seul responsable des textes, prix, photos et produits publiés sur votre mini-site.
          Vous garantissez disposer des droits nécessaires et respecter la loi (pas de contrefaçon, de
          contenu illégal, trompeur ou interdit à la vente).
        </Section>

        <Section title="4. Transactions & paiements">
          kako fournit la vitrine ; les commandes et paiements se font directement entre vous et vos
          clients (WhatsApp, Mobile Money, en personne). kako n&apos;est pas partie au contrat de vente et
          n&apos;est pas responsable des litiges, livraisons ou remboursements entre vous et vos clients.
        </Section>

        <Section title="5. Usages interdits">
          Il est interdit d&apos;utiliser le service pour de la fraude, du spam, la vente de produits
          illégaux, ou toute activité portant atteinte aux droits d&apos;autrui. [Compléter la liste.]
        </Section>

        <Section title="6. Disponibilité & responsabilité">
          Le service est fourni « en l&apos;état ». Nous nous efforçons d&apos;assurer sa disponibilité mais ne
          garantissons pas une absence totale d&apos;interruption. [Limitations de responsabilité à préciser.]
        </Section>

        <Section title="7. Résiliation">
          Vous pouvez supprimer votre compte à tout moment. Nous pouvons suspendre un compte en cas de
          violation de ces conditions.
        </Section>

        <Section title="8. Contact & droit applicable">
          Contact : [email/WhatsApp]. Droit applicable : [pays]. [Clause de règlement des litiges.]
        </Section>
      </div>

      <p className="mt-10 text-xs text-[var(--text-dim)]">
        Document provisoire généré comme point de départ. Il doit être relu et adapté par un
        professionnel du droit avant toute mise en ligne.
      </p>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-[var(--text)]">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
