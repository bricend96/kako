import type { Profile } from "@/lib/types";
import { money, waLink, bookingRoomMessage } from "@/lib/format";
import {
  ProfileHeader, Section, Socials, MomoBadges, LocationBlock, Reviews,
  WhatsAppFab, KakoFooter, OwnerCard, WhatsAppIcon, Photo,
} from "@/components/blocks";
import { Bed, Ruler } from "@/components/icons";
import { ConfirmButton } from "@/components/ConfirmButton";

export default function HotellerieTemplate({ profile }: { profile: Profile }) {
  return (
    <div className="mx-auto w-full max-w-md lg:max-w-none bg-[var(--surface)] min-h-screen lg:min-h-0 pb-10">
      <ProfileHeader profile={profile} />
      <Socials profile={profile} />

      <div className="px-5">
        <MomoBadges profile={profile} />
      </div>

      {profile.listings?.length ? (
        <Section title="Nos chambres">
          <div className="space-y-3">
            {profile.listings.map((r) => (
              <div key={r.id} className="rounded-2xl border border-[var(--border)] overflow-hidden">
                <Photo src={r.imageUrl} theme={profile.theme} className="h-28 w-full overflow-hidden" iconSize={32} />
                <div className="p-4">
                  <p className="font-semibold text-[var(--text)]">{r.title}</p>
                  <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-[var(--text-muted)]">
                    {r.bedrooms != null && <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-2)] px-2 py-0.5"><Bed size={12} /> {r.bedrooms} lit(s)</span>}
                    {r.area && <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-2)] px-2 py-0.5"><Ruler size={12} /> {r.area}</span>}
                  </div>
                  {r.description && <p className="text-sm text-[var(--text-muted)] mt-2">{r.description}</p>}
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold" style={{ color: profile.theme.accent }}>
                      {money(r.price, profile.currency)}
                      <span className="text-xs font-normal text-[var(--text-dim)]"> /nuit</span>
                    </span>
                    <ConfirmButton
                      href={waLink(profile.whatsapp, bookingRoomMessage(profile, r.title, r.price))}
                      label="Réserver"
                      accent={profile.theme.accent}
                      className="rounded-full px-4 py-2 text-sm"
                      iconSize={14}
                      title="Confirmer la réservation ?"
                      message="Vous allez contacter l'établissement sur WhatsApp pour réserver cette chambre."
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
