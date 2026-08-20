import type { Profile } from "@/lib/types";
import { money, waLink, enrollMessage } from "@/lib/format";
import {
  ProfileHeader, Section, Socials, Hours, LocationBlock, MomoBadges, Reviews,
  WhatsAppFab, KakoFooter, OwnerCard, WhatsAppIcon,
} from "@/components/blocks";
import { CategoryIcon } from "@/components/icons";
import { ConfirmButton } from "@/components/ConfirmButton";

export default function EcoleTemplate({ profile }: { profile: Profile }) {
  return (
    <div className="mx-auto w-full max-w-md lg:max-w-none bg-[var(--surface)] min-h-screen lg:min-h-0 pb-10">
      <ProfileHeader profile={profile} />
      <Socials profile={profile} />

      <div className="px-5">
        <MomoBadges profile={profile} />
      </div>

      {profile.enrollNote ? (
        <div className="px-5 mt-4">
          <div
            className="rounded-2xl p-4 text-sm text-white font-medium flex items-center gap-2"
            style={{ background: `linear-gradient(135deg, ${profile.theme.from}, ${profile.theme.to})` }}
          >
            <CategoryIcon category="ecole" size={18} /> {profile.enrollNote}
          </div>
        </div>
      ) : null}

      {profile.programs?.length ? (
        <Section title="Programmes & formations">
          <div className="space-y-2.5">
            {profile.programs.map((p, i) => (
              <div key={i} className="rounded-2xl border border-[var(--border)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--text)]">{p.name}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {p.level && <span className="text-xs rounded-full bg-blue-50 text-blue-700 px-2 py-0.5">{p.level}</span>}
                      {p.duration && <span className="text-xs rounded-full bg-[var(--surface-2)] text-[var(--text-muted)] px-2 py-0.5">⏱ {p.duration}</span>}
                    </div>
                    {p.description && <p className="text-sm text-[var(--text-muted)] mt-1.5">{p.description}</p>}
                    {p.price != null && (
                      <p className="text-sm mt-1 font-bold" style={{ color: profile.theme.accent }}>
                        {money(p.price, profile.currency)}
                      </p>
                    )}
                  </div>
                </div>
                <ConfirmButton
                  href={waLink(profile.whatsapp, enrollMessage(profile, p.name))}
                  label="S'inscrire"
                  accent={profile.theme.accent}
                  className="mt-3 w-full sm:w-auto rounded-full px-5 py-2.5 text-sm"
                  title="Confirmer l'inscription ?"
                  message="Vous allez être redirigé vers WhatsApp pour finaliser votre inscription."
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
