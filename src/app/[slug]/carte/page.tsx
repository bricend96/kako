import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import QRCode from "qrcode";
import type { Metadata } from "next";
import { getProfile } from "@/lib/store";
import { waLink, contactMessage } from "@/lib/format";
import { WhatsAppIcon } from "@/components/blocks";
import { MapPin, Phone, IdCard } from "@/components/icons";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfile(slug);
  return { title: profile ? `Carte de ${profile.ownerName} — kako` : "kako" };
}

export default async function CartePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await getProfile(slug);
  if (!profile) notFound();

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const pageUrl = `${proto}://${host}/${profile.slug}`;

  const qr = await QRCode.toDataURL(pageUrl, {
    margin: 1,
    width: 320,
    color: { dark: "#0f172a", light: "#ffffff" },
  });

  return (
    <div className="min-h-screen bg-[var(--surface-2)] grid place-items-center p-5">
      <div className="w-full max-w-sm">
        {/* La carte */}
        <div className="rounded-3xl overflow-hidden shadow-xl bg-[var(--surface)]">
          <div
            className="h-28 relative"
            style={{ background: `linear-gradient(135deg, ${profile.theme.from}, ${profile.theme.to})` }}
          >
            {profile.coverUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-2xl grid place-items-center text-white text-2xl font-bold shadow-lg ring-4 ring-[var(--surface)] overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${profile.theme.from}, ${profile.theme.to})` }}>
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                profile.initials
              )}
            </div>
          </div>

          <div className="pt-12 pb-6 px-6 text-center">
            <h1 className="text-xl font-bold text-[var(--text)]">{profile.ownerName}</h1>
            <p className="text-sm text-[var(--text-muted)]">{profile.businessName}</p>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">{profile.tagline}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1 flex items-center justify-center gap-1"><MapPin size={13} /> {profile.city}, {profile.country}</p>

            <div className="mt-5 grid place-items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt="QR code de la page" className="w-44 h-44" />
              <p className="text-xs text-[var(--text-dim)] mt-2">Scanne pour ouvrir la page</p>
            </div>

            <div className="mt-5 space-y-2">
              <a
                href={waLink(profile.whatsapp, contactMessage(profile))}
                target="_blank"
                className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-white text-sm font-semibold active:scale-95 transition"
              >
                <WhatsAppIcon /> Écrire sur WhatsApp
              </a>
              {profile.phone && (
                <a
                  href={`tel:${profile.phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2 rounded-full border border-[var(--border)] px-5 py-3 text-[var(--text)] text-sm font-semibold active:scale-95 transition"
                >
                  <Phone size={16} /> {profile.phone}
                </a>
              )}
              <a
                href={`/${profile.slug}/vcard`}
                className="flex items-center justify-center gap-2 rounded-full border border-[var(--border)] px-5 py-3 text-[var(--text)] text-sm font-semibold active:scale-95 transition"
              >
                <IdCard size={16} /> Enregistrer le contact
              </a>
              <a
                href={`/api/share/${profile.slug}`}
                target="_blank"
                className="flex items-center justify-center gap-2 rounded-full border border-[var(--border)] px-5 py-3 text-[var(--text)] text-sm font-semibold active:scale-95 transition"
              >
                📤 Image à partager (statut WhatsApp)
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link href={`/${profile.slug}`} className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
            ← Voir la page complète
          </Link>
        </div>
      </div>
    </div>
  );
}
