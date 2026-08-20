import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { KakoBadge } from "@/components/KakoLogo";
import { getCurrentUser, DEMO_MODE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen grid place-items-center p-5 bg-[var(--surface-2)]">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 text-2xl font-extrabold mb-6">
          <KakoBadge size={30} /> kako
        </Link>
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6">
          <LoginForm demoMode={DEMO_MODE} />
        </div>
      </div>
    </main>
  );
}
