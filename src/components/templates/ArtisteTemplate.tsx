import type { Profile } from "@/lib/types";
import { waLink, bookingArtistMessage, tipMessage } from "@/lib/format";
import {
  ProfileHeader, Section, Socials, Reviews,
  WhatsAppFab, KakoFooter, OwnerCard, WhatsAppIcon,
} from "@/components/blocks";
import { Gallery } from "@/components/Gallery";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Ticket, Heart, Play, Headphones, Calendar, Image } from "@/components/icons";

export default function ArtisteTemplate({ profile }: { profile: Profile }) {
  return (
    <div className="mx-auto w-full max-w-md lg:max-w-none bg-[var(--surface)] min-h-screen lg:min-h-0 pb-10">
      <ProfileHeader profile={profile} />
      <Socials profile={profile} />

      {/* Actions clés artiste */}
      <div className="px-5 mt-5 grid grid-cols-2 gap-2">
        <a
          href={waLink(profile.whatsapp, bookingArtistMessage(profile))}
          target="_blank"
          className="inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-3 text-white text-sm font-semibold active:scale-95 transition"
          style={{ background: `linear-gradient(135deg, ${profile.theme.from}, ${profile.theme.to})` }}
        >
          <Ticket size={16} /> Me booker
        </a>
        {profile.tipsEnabled && (
          <a
            href={waLink(profile.whatsapp, tipMessage(profile))}
            target="_blank"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--border)] px-4 py-3 text-[var(--text)] text-sm font-semibold active:scale-95 transition"
          >
            <Heart size={16} /> Me soutenir
          </a>
        )}
      </div>

      {profile.tracks?.length ? (
        <Section title="Mes titres">
          <div className="space-y-2">
            {profile.tracks.map((t, i) => (
              <a
                key={i}
                href={t.url || "#"}
                target={t.url ? "_blank" : undefined}
                className="flex items-center gap-3 rounded-2xl border border-[var(--border)] p-3 active:scale-[0.99] transition"
              >
                <div
                  className="w-11 h-11 rounded-xl grid place-items-center text-white shrink-0"
                  style={{ background: `linear-gradient(135deg, ${profile.theme.from}, ${profile.theme.to})` }}
                >
                  <Play size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--text)] truncate">{t.title}</p>
                  {t.duration && <p className="text-xs text-[var(--text-dim)]">{t.duration}</p>}
                </div>
                <Headphones size={16} className="text-[var(--text-dim)]" />
              </a>
            ))}
          </div>
        </Section>
      ) : null}

      {profile.gallery?.length ? (
        <Section title="Galerie">
          <Gallery images={profile.gallery} theme={profile.theme} />
        </Section>
      ) : null}

      {profile.events?.length ? (
        <Section title="Concerts & dates">
          <div className="space-y-2.5">
            {profile.events.map((e, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] p-4">
                <Calendar size={22} className="text-[var(--text-muted)] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--text)]">{e.date}</p>
                  <p className="text-sm text-[var(--text-muted)]">{e.venue} · {e.city}</p>
                </div>
                {e.ticketUrl ? (
                  <a
                    href={e.ticketUrl}
                    target="_blank"
                    className="shrink-0 rounded-full px-4 py-2 text-white text-sm font-semibold active:scale-95 transition"
                    style={{ background: profile.theme.accent }}
                  >
                    Billets
                  </a>
                ) : (
                  <ConfirmButton
                    href={waLink(profile.whatsapp, bookingArtistMessage(profile))}
                    label="Infos"
                    accent={profile.theme.accent}
                    className="shrink-0 rounded-full px-3 py-2 text-sm"
                    iconSize={14}
                    title="Contacter l'artiste ?"
                    message="Vous allez être redirigé vers WhatsApp pour plus d'infos sur cette date."
                  />
                )}
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
