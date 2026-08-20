import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedProfiles } from "@/lib/store";
import { Directory } from "@/components/Directory";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Découvrir — kako",
  description: "Explorez les commerces, artisans et créateurs présents sur kako.",
};

export default async function DecouvrirPage() {
  const profiles = await getPublishedProfiles();
  return (
    <main className="max-w-6xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">← Retour</Link>
        <Link href="/login" className="rounded-full bg-[var(--btn)] text-white text-sm font-semibold px-4 py-2">Créer mon site</Link>
      </div>
      <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-[var(--text)]">Découvrir sur kako</h1>
      <p className="mt-2 text-[var(--text-muted)]">Trouvez un commerce près de chez vous, par métier ou par ville.</p>
      <div className="mt-8">
        <Directory profiles={profiles} />
      </div>
    </main>
  );
}
