import type { Profile } from "@/lib/types";
import { waLink, donateMessage, volunteerMessage } from "@/lib/format";
import {
  ProfileHeader, Section, Socials, MomoBadges, Reviews,
  WhatsAppFab, KakoFooter, OwnerCard, WhatsAppIcon,
} from "@/components/blocks";
import { Gallery } from "@/components/Gallery";
import { Heart, Target, Image, CategoryIcon } from "@/components/icons";

export default function OngTemplate({ profile }: { profile: Profile }) {
  return (
    <div className="mx-auto w-full max-w-md lg:max-w-none bg-[var(--surface)] min-h-screen lg:min-h-0 pb-10">
      <ProfileHeader profile={profile} />
      <Socials profile={profile} />

      <div className="px-5">
        <MomoBadges profile={profile} />
      </div>

      {/* Appel aux dons */}
      <div className="px-5 mt-4">
        <div
          className="rounded-2xl p-4 text-white"
          style={{ background: `linear-gradient(135deg, ${profile.theme.from}, ${profile.theme.to})` }}
        >
          {profile.enrollNote && <p className="text-sm font-medium flex items-center gap-1.5"><Heart size={16} /> {profile.enrollNote}</p>}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <a
              href={waLink(profile.whatsapp, donateMessage(profile))}
              target="_blank"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--surface)] px-4 py-2.5 text-sm font-bold active:scale-95 transition"
              style={{ color: profile.theme.accent }}
            >
              <Heart size={16} /> Faire un don
            </a>
            <a
              href={waLink(profile.whatsapp, volunteerMessage(profile))}
              target="_blank"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/70 px-4 py-2.5 text-sm font-semibold text-white active:scale-95 transition"
            >
              <CategoryIcon category="ong" size={16} /> Bénévolat
            </a>
          </div>
        </div>
      </div>

      {profile.gallery?.length ? (
        <Section title="Sur le terrain">
          <Gallery images={profile.gallery} theme={profile.theme} />
        </Section>
      ) : null}

      {profile.programs?.length ? (
        <Section title="Nos projets & actions">
          <div className="space-y-2.5">
            {profile.programs.map((p, i) => (
              <div key={i} className="rounded-2xl border border-[var(--border)] p-4">
                <p className="font-semibold text-[var(--text)]">{p.name}</p>
                {p.duration && (
                  <span className="inline-flex items-center gap-1 mt-1 text-xs rounded-full px-2 py-0.5" style={{ background: `${profile.theme.accent}18`, color: profile.theme.accent }}>
                    <Target size={12} /> {p.duration}
                  </span>
                )}
                {p.description && <p className="text-sm text-[var(--text-muted)] mt-1.5">{p.description}</p>}
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
