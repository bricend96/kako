import type { Profile } from "@/lib/types";
import { money, waLink, listingMessage } from "@/lib/format";
import {
  ProfileHeader, Section, Socials, MomoBadges, LocationBlock, Reviews,
  WhatsAppFab, KakoFooter, OwnerCard, WhatsAppIcon, Photo,
} from "@/components/blocks";
import { MapPin, Bed, Ruler } from "@/components/icons";
import { ConfirmButton } from "@/components/ConfirmButton";

export default function ImmobilierTemplate({ profile }: { profile: Profile }) {
  return (
    <div className="mx-auto w-full max-w-md lg:max-w-none bg-[var(--surface)] min-h-screen lg:min-h-0 pb-10">
      <ProfileHeader profile={profile} />
      <Socials profile={profile} />

      <div className="px-5">
        <MomoBadges profile={profile} />
      </div>

      {profile.listings?.length ? (
        <Section title="Biens disponibles">
          <div className="space-y-3">
            {profile.listings.map((b) => (
              <div key={b.id} className="rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="h-32 relative overflow-hidden">
                  <Photo src={b.imageUrl} theme={profile.theme} className="w-full h-full" iconSize={34} />
                  {b.kind && (
                    <span
                      className="absolute top-2 left-2 rounded-full text-white text-[11px] font-semibold px-2.5 py-1"
                      style={{ background: profile.theme.accent }}
                    >
                      {b.kind}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-semibold text-[var(--text)]">{b.title}</p>
                  <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-[var(--text-muted)]">
                    {b.location && <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-2)] px-2 py-0.5"><MapPin size={12} /> {b.location}</span>}
                    {b.bedrooms != null && <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-2)] px-2 py-0.5"><Bed size={12} /> {b.bedrooms} ch.</span>}
                    {b.area && <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-2)] px-2 py-0.5"><Ruler size={12} /> {b.area}</span>}
                  </div>
                  {b.description && <p className="text-sm text-[var(--text-muted)] mt-2">{b.description}</p>}
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold" style={{ color: profile.theme.accent }}>
                      {money(b.price, profile.currency)}
                      {b.kind === "Location" && <span className="text-xs font-normal text-[var(--text-dim)]"> /mois</span>}
                    </span>
                    <ConfirmButton
                      href={waLink(profile.whatsapp, listingMessage(profile, b.title, b.price))}
                      label="Visiter"
                      accent={profile.theme.accent}
                      className="rounded-full px-4 py-2 text-sm"
                      iconSize={14}
                      title="Organiser une visite ?"
                      message="Vous allez contacter l'agence sur WhatsApp au sujet de ce bien."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <OwnerCard profile={profile} />
      <KakoFooter />
    </div>
  );
}
