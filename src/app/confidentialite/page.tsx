import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité — kako",
  description: "Comment kako collecte et protège vos données personnelles.",
};

// ⚠️ SQUELETTE À FAIRE RELIRE PAR UN JURISTE AVANT MISE EN LIGNE.
// Les mentions entre [crochets] doivent être complétées.

export default function ConfidentialitePage() {
  return (
    <main className="max-w-2xl mx-auto px-5 py-12">
      <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">← Retour</Link>
      <h1 className="mt-4 text-3xl font-bold text-[var(--text)]">Politique de confidentialité</h1>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Dernière mise à jour : [date] · Version provisoire à faire relire.</p>

      <div className="mt-8 space-y-6 text-[var(--text)] leading-relaxed">
        <Section title="1. Qui sommes-nous">
          kako (« nous ») est un service exploité par [raison sociale], [adresse], [pays].
          Contact : [email/WhatsApp de contact].
        </Section>

        <Section title="2. Données que nous collectons">
          <ul className="list-disc pl-5 space-y-1">
            <li><b>Numéro de téléphone</b> : pour créer votre compte et vous envoyer un code de connexion (OTP).</li>
            <li><b>Informations de votre mini-site</b> : nom d&apos;activité, description, produits, tarifs, photos, horaires que vous saisissez.</li>
            <li><b>Données techniques</b> : logs de connexion, type d&apos;appareil, pour la sécurité et le bon fonctionnement.</li>
          </ul>
        </Section>

        <Section title="3. Pourquoi nous les utilisons">
          Fournir et sécuriser le service, vous permettre de créer et publier votre mini-site,
          vous contacter au sujet de votre compte. Nous ne vendons pas vos données.
        </Section>

        <Section title="4. WhatsApp & paiements">
          Les échanges avec vos clients ont lieu directement sur WhatsApp : ils sont soumis à la
          politique de confidentialité de WhatsApp, hors de notre contrôle. Les paiements Mobile Money
          sont traités par les opérateurs concernés ([Orange Money, MTN MoMo, Wave, M-Pesa…]).
        </Section>

        <Section title="5. Partage des données">
          Nous partageons vos données uniquement avec nos prestataires techniques (hébergement, envoi
          de SMS/OTP) et lorsque la loi l&apos;exige. [Lister les sous-traitants.]
        </Section>

        <Section title="6. Conservation & vos droits">
          Vos données sont conservées tant que votre compte est actif. Vous pouvez demander l&apos;accès,
          la rectification ou la suppression de vos données en nous contactant à [email/WhatsApp].
        </Section>

        <Section title="7. Contact">
          Pour toute question sur cette politique : [email/WhatsApp de contact].
        </Section>
      </div>

      <p className="mt-10 text-xs text-[var(--text-dim)]">
        Document provisoire généré comme point de départ. Il doit être relu et adapté au droit
        applicable (par ex. loi sur la protection des données du pays d&apos;exploitation) avant publication.
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
