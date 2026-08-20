import type { Profile } from "@/lib/types";
import {
  ProfileHeader, Section, Socials, MomoBadges, DeliveryInfo, Reviews,
  WhatsAppFab, KakoFooter, OwnerCard,
} from "@/components/blocks";
import { Catalog } from "@/components/Catalog";

export default function EcommerceTemplate({ profile }: { profile: Profile }) {
  return (
    <div className="mx-auto w-full max-w-md lg:max-w-none bg-[var(--surface)] min-h-screen lg:min-h-0 pb-10">
      <ProfileHeader profile={profile} />
      <Socials profile={profile} />

      <div className="px-5">
        <MomoBadges profile={profile} />
        <DeliveryInfo profile={profile} />
      </div>

      {profile.products?.length ? (
        <Catalog profile={profile} products={profile.products} sectionTitle="Catalogue" />
      ) : null}

      <OwnerCard profile={profile} />
      <KakoFooter />
    </div>
  );
}
