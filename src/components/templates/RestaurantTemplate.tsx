import type { Profile } from "@/lib/types";
import { money, waLink, foodMessage } from "@/lib/format";
import {
  ProfileHeader, Section, Socials, Hours, LocationBlock, MomoBadges, DeliveryInfo, Reviews,
  WhatsAppFab, KakoFooter, OwnerCard, Photo,
} from "@/components/blocks";
import { BuyButton } from "@/components/BuyButton";

const TAGS: Record<string, { label: string; cls: string }> = {
  populaire: { label: "★ Populaire", cls: "bg-amber-100 text-amber-700" },
  nouveau: { label: "Nouveau", cls: "bg-green-100 text-green-700" },
  epuise: { label: "Épuisé", cls: "bg-gray-200 text-[var(--text-muted)]" },
};

export default function RestaurantTemplate({ profile }: { profile: Profile }) {
  return (
    <div className="mx-auto w-full max-w-md lg:max-w-none bg-[var(--surface)] min-h-screen lg:min-h-0 pb-10">
      <ProfileHeader profile={profile} />
      <Socials profile={profile} />

      <div className="px-5">
        <MomoBadges profile={profile} />
        <DeliveryInfo profile={profile} />
      </div>

      {profile.menu?.map((section) => (
        <Section key={section.title} title={section.title}>
          <div className="space-y-2.5">
            {section.dishes.map((d, i) => {
              const tag = d.tag ? TAGS[d.tag] : null;
              const epuise = d.tag === "epuise" || d.available === false;
              return (
                <div key={i} className="rounded-2xl border border-[var(--border)] p-4 flex items-center gap-3">
                  <Photo src={d.imageUrl} theme={profile.theme} className="w-12 h-12 rounded-xl overflow-hidden shrink-0" iconSize={20} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-[var(--text)]">{d.name}</p>
                      {d.dailySpecial && <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700">🍲 Plat du jour</span>}
                      {tag && !epuise && <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tag.cls}`}>{tag.label}</span>}
                      {d.available === false && <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-gray-200 text-gray-500">Épuisé aujourd&apos;hui</span>}
                    </div>
                    {d.description && <p className="text-sm text-[var(--text-muted)]">{d.description}</p>}
                    <p className="text-sm mt-1 font-bold" style={{ color: profile.theme.accent }}>
                      {money(d.price, profile.currency)}
                    </p>
                  </div>
                  {epuise ? (
                    <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-white text-sm font-semibold bg-gray-500/40 pointer-events-none">Épuisé</span>
                  ) : (
                    <BuyButton
                      whatsapp={profile.whatsapp}
                      message={foodMessage(profile, d.name, d.price)}
                      amount={d.price}
                      currency={profile.currency}
                      momo={profile.momo}
                      requirePrepayment={profile.requirePrepayment}
                      accent={profile.theme.accent}
                      label="Commander"
                      className="shrink-0 rounded-full px-4 py-2 text-sm"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      ))}

      <Hours profile={profile} />
      <OwnerCard profile={profile} />
      <KakoFooter />
    </div>
  );
}
