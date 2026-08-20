import type { Profile, Category } from "@/lib/types";
import { money, waLink, serviceMessage } from "@/lib/format";
import {
  ProfileHeader, Section, Hours, LocationBlock, MomoBadges, Socials, Reviews,
  WhatsAppFab, KakoFooter, OwnerCard, WhatsAppIcon,
} from "@/components/blocks";
import { Gallery } from "@/components/Gallery";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Image, MapPin } from "@/components/icons";

interface Variant {
  sectionTitle: string;
  cta: string;
  /** verbe d'action injecté dans le message WhatsApp */
  action: string;
  gallery?: boolean;
  galleryTitle?: string;
  hours?: boolean;
  zones?: boolean;
}

const VARIANTS: Partial<Record<Category, Variant>> = {
  artisan: { sectionTitle: "Mes prestations", cta: "Demander un devis", action: "demander un devis pour", gallery: true, galleryTitle: "Réalisations", hours: true },
  sante: { sectionTitle: "Consultations & soins", cta: "Prendre rendez-vous", action: "prendre rendez-vous pour", hours: true },
  evenementiel: { sectionTitle: "Forfaits", cta: "Demander un devis", action: "demander un devis pour", gallery: true, galleryTitle: "Portfolio" },
  transport: { sectionTitle: "Tarifs des courses", cta: "Réserver une course", action: "réserver", zones: true },
};

export default function ServiceTemplate({ profile }: { profile: Profile }) {
  const v = VARIANTS[profile.category] ?? VARIANTS.artisan!;

  return (
    <div className="mx-auto w-full max-w-md lg:max-w-none bg-[var(--surface)] min-h-screen lg:min-h-0 pb-10">
      <ProfileHeader profile={profile} />
      <Socials profile={profile} />

      <div className="px-5">
        <MomoBadges profile={profile} />
      </div>

      {v.zones && profile.delivery?.zones?.length ? (
        <div className="px-5 mt-3">
          <div className="rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] p-4 text-sm">
            <p className="font-semibold text-[var(--text)] flex items-center gap-1.5"><MapPin size={16} /> Zones desservies</p>
            <p className="text-[var(--text-muted)] mt-1">{profile.delivery.zones.join(", ")}</p>
          </div>
        </div>
      ) : null}

      {v.gallery && profile.gallery?.length ? (
        <Section title={v.galleryTitle ?? "Galerie"}>
          <Gallery images={profile.gallery} theme={profile.theme} />
        </Section>
      ) : null}

      {profile.services?.length ? (
        <Section title={v.sectionTitle}>
          <div className="space-y-2.5">
            {profile.services.map((s, i) => (
              <div key={i} className="rounded-2xl border border-[var(--border)] p-4">
                <p className="font-semibold text-[var(--text)]">{s.name}</p>
                {s.description && <p className="text-sm text-[var(--text-muted)] mt-0.5">{s.description}</p>}
                <p className="text-sm mt-1">
                  <span className="font-bold" style={{ color: profile.theme.accent }}>
                    {money(s.price, profile.currency)}
                  </span>
                  {s.durationMin && <span className="text-[var(--text-dim)]"> · {s.durationMin} min</span>}
                </p>
                <ConfirmButton
                  href={waLink(profile.whatsapp, serviceMessage(profile, s.name, v.action))}
                  label={v.cta}
                  accent={profile.theme.accent}
                  className="mt-3 w-full sm:w-auto rounded-full px-5 py-2.5 text-sm"
                  title="Confirmer votre demande ?"
                  message="Vous allez être redirigé vers WhatsApp pour finaliser avec le prestataire."
                />
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {v.hours && <Hours profile={profile} />}
      <OwnerCard profile={profile} />
      <KakoFooter />
    </div>
  );
}
