import type { Profile } from "@/lib/types";
import { money, waLink, bookingMessage } from "@/lib/format";
import {
  ProfileHeader, Section, Socials, Hours, LocationBlock, Reviews,
  WhatsAppFab, KakoFooter, OwnerCard, WhatsAppIcon,
} from "@/components/blocks";
import { Gallery } from "@/components/Gallery";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Image } from "@/components/icons";

export default function CoiffeurTemplate({ profile }: { profile: Profile }) {
  return (
    <div className="mx-auto w-full max-w-md lg:max-w-none bg-[var(--surface)] min-h-screen lg:min-h-0 pb-10">
      <ProfileHeader profile={profile} />
      <Socials profile={profile} />

      {profile.gallery?.length ? (
        <Section title="Nos réalisations">
          <Gallery images={profile.gallery} theme={profile.theme} />
        </Section>
      ) : null}

      {profile.services?.length ? (
        <Section title="Prestations & tarifs">
          <div className="space-y-2.5">
            {profile.services.map((s, i) => (
              <div key={i} className="rounded-2xl border border-[var(--border)] p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--text)]">{s.name}</p>
                  {s.description && <p className="text-sm text-[var(--text-muted)]">{s.description}</p>}
                  <p className="text-sm mt-1">
                    <span className="font-bold" style={{ color: profile.theme.accent }}>
                      {money(s.price, profile.currency)}
                    </span>
                    {s.durationMin && <span className="text-[var(--text-dim)]"> · {s.durationMin} min</span>}
                  </p>
                </div>
                <ConfirmButton
                  href={waLink(profile.whatsapp, bookingMessage(profile, s.name))}
                  label="Réserver"
                  accent={profile.theme.accent}
                  className="shrink-0 rounded-full px-4 py-2 text-sm"
                  title="Confirmer la réservation ?"
                  message="Vous allez contacter le salon sur WhatsApp pour réserver cette prestation."
                />
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <Hours profile={profile} />
      <OwnerCard profile={profile} />
      <KakoFooter />
    </div>
  );
}
