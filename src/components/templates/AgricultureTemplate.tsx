import type { Profile } from "@/lib/types";
import {
  ProfileHeader, Section, Socials, MomoBadges, DeliveryInfo, LocationBlock, Reviews,
  WhatsAppFab, KakoFooter, OwnerCard,
} from "@/components/blocks";
import { CategoryIcon } from "@/components/icons";
import { Catalog } from "@/components/Catalog";

export default function AgricultureTemplate({ profile }: { profile: Profile }) {
  return (
    <div className="mx-auto w-full max-w-md lg:max-w-none bg-[var(--surface)] min-h-screen lg:min-h-0 pb-10">
      <ProfileHeader profile={profile} />
      <Socials profile={profile} />

      <div className="px-5">
        <MomoBadges profile={profile} />
        <div className="mt-3 rounded-2xl p-3 text-sm text-white font-medium flex items-center justify-center gap-2"
          style={{ background: `linear-gradient(135deg, ${profile.theme.from}, ${profile.theme.to})` }}>
          <CategoryIcon category="agriculture" size={18} /> Vente en gros & détail · produits frais de la ferme
        </div>
        <DeliveryInfo profile={profile} />
      </div>

      {profile.products?.length ? (
        <Catalog profile={profile} products={profile.products} sectionTitle="Nos produits" />
      ) : null}

      <OwnerCard profile={profile} />
      <KakoFooter />
    </div>
  );
}
