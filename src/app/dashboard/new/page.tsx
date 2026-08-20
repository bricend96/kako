import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import NewSiteForm from "./NewSiteForm";

export const dynamic = "force-dynamic";

export default async function NewSitePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-[var(--surface-2)]">
      <header className="sticky top-0 z-20 glass backdrop-blur-2xl backdrop-saturate-150 border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">← Mes sites</Link>
          <Link href="/" className="text-xl font-extrabold">kako</Link>
        </div>
      </header>
      <div className="max-w-2xl mx-auto px-5 py-8">
        <h1 className="text-2xl font-bold text-[var(--text)] mb-6">Créer un site</h1>
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6">
          <NewSiteForm />
        </div>
      </div>
    </main>
  );
}
