import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getProfilesByUser, getStats } from "@/lib/store";
import { categoryMeta } from "@/lib/categories";
import { logout } from "../login/actions";
import { togglePublishAction } from "./actions";
import DeleteButton from "./DeleteButton";
import { CategoryIcon } from "@/components/icons";
import { VerifiedBadge } from "@/components/blocks";
import { KakoBadge } from "@/components/KakoLogo";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profiles = await getProfilesByUser(user.id);
  const statsMap = Object.fromEntries(await Promise.all(profiles.map(async (p) => [p.slug, await getStats(p.slug)] as const)));

  return (
    <main className="min-h-screen bg-[var(--surface-2)]">
      <header className="sticky top-0 z-20 glass backdrop-blur-2xl backdrop-saturate-150 border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold flex items-center gap-2"><KakoBadge size={26} /> kako</Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--text-muted)] hidden sm:inline">
              {user.name ?? "+" + user.phone}
            </span>
            <form action={logout}>
              <button className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">Déconnexion</button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">Mes sites</h1>
            <p className="text-[var(--text-muted)] text-sm">{profiles.length} site(s)</p>
          </div>
          <Link
            href="/dashboard/new"
            className="rounded-full bg-[var(--btn)] text-white text-sm font-semibold px-5 py-2.5"
          >
            + Créer un site
          </Link>
        </div>

        {profiles.length === 0 ? (
          <div className="mt-10 rounded-2xl border-2 border-dashed border-[var(--border)] p-12 text-center">
            <p className="font-semibold text-[var(--text)]">Aucun site pour l&apos;instant</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">Crée ton premier mini-site en 2 minutes.</p>
            <Link href="/dashboard/new" className="mt-5 inline-block rounded-full bg-[var(--btn)] text-white text-sm font-semibold px-6 py-3">
              Commencer
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {profiles.map((p) => {
              const meta = categoryMeta(p.category);
              return (
                <div key={p.id} className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-xl grid place-items-center text-white font-bold shrink-0"
                    style={{ background: `linear-gradient(135deg, ${p.theme.from}, ${p.theme.to})` }}
                  >
                    {p.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-[var(--text)] truncate">{p.businessName}</p>
                      {p.verified && <VerifiedBadge size={15} />}
                      {p.published ? (
                        <span className="text-[10px] rounded-full bg-green-100 text-green-700 px-2 py-0.5 font-medium">En ligne</span>
                      ) : (
                        <span className="text-[10px] rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 font-medium">Brouillon</span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-1"><CategoryIcon category={p.category} size={13} /> {meta.label} · kako.site/{p.slug}</p>
                    <p className="text-xs text-[var(--text-dim)] mt-1">👁 {statsMap[p.slug].views} vues · 💬 {statsMap[p.slug].waClicks} clics WhatsApp</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link href={`/${p.slug}`} target="_blank" className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text)] hover:bg-[var(--surface-2)]">Voir</Link>
                    <Link href={`/${p.slug}/carte`} target="_blank" className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text)] hover:bg-[var(--surface-2)]">QR</Link>
                    <Link href={`/dashboard/${p.slug}/edit`} className="rounded-lg bg-[var(--btn)] text-white px-3 py-2 text-xs font-semibold">Modifier</Link>
                    <form action={togglePublishAction.bind(null, p.slug)}>
                      <button className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text)] hover:bg-[var(--surface-2)]">
                        {p.published ? "Dépublier" : "Publier"}
                      </button>
                    </form>
                    <DeleteButton slug={p.slug} name={p.businessName} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
