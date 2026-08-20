import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProfile, getStats, getSubscriberCount, getReports, getComplaints } from "@/lib/store";
import { reliabilityIndex } from "@/lib/reliability";
import { ProfileTabs } from "@/components/ProfileTabs";
import CoiffeurTemplate from "@/components/templates/CoiffeurTemplate";
import EcommerceTemplate from "@/components/templates/EcommerceTemplate";
import RestaurantTemplate from "@/components/templates/RestaurantTemplate";
import EcoleTemplate from "@/components/templates/EcoleTemplate";
import ArtisteTemplate from "@/components/templates/ArtisteTemplate";
import ServiceTemplate from "@/components/templates/ServiceTemplate";
import ImmobilierTemplate from "@/components/templates/ImmobilierTemplate";
import OngTemplate from "@/components/templates/OngTemplate";
import AgricultureTemplate from "@/components/templates/AgricultureTemplate";
import HotellerieTemplate from "@/components/templates/HotellerieTemplate";
import { SiteShell } from "@/components/SiteShell";
import { Lock } from "@/components/icons";
import { TrackView } from "@/components/TrackView";
import { ActivityFeed } from "@/components/ActivityFeed";
import { SafetyNotice } from "@/components/SafetyNotice";
import { MobileTopBar } from "@/components/MobileTopBar";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfile(slug);
  if (!profile) return { title: "Page introuvable — kako" };
  return {
    title: `${profile.businessName} — ${profile.tagline}`,
    description: profile.bio,
    openGraph: { title: profile.businessName, description: profile.bio },
  };
}

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await getProfile(slug);
  if (!profile) notFound();
  const [stats, subscriberCount, reports, complaints] = await Promise.all([
    getStats(slug), getSubscriberCount(slug), getReports(slug), getComplaints(slug),
  ]);

  const reviews = profile.reviews ?? [];
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const ageMonths = Math.max(0, (Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30));
  const reliability = reliabilityIndex({
    verified: !!profile.verified,
    avgRating,
    reviewCount: reviews.length,
    clientsServed: profile.clientsServed ?? 0,
    subscribers: subscriberCount,
    reports,
    complaints: complaints.length,
    ageMonths,
    hasMomo: (profile.momo?.length ?? 0) > 0,
    hasDelivery: !!profile.delivery?.available,
    socials: profile.socials?.filter((s) => s.url).length ?? 0,
  });

  let template: React.ReactNode;
  switch (profile.category) {
    case "coiffeur": template = <CoiffeurTemplate profile={profile} />; break;
    case "ecommerce": template = <EcommerceTemplate profile={profile} />; break;
    case "restaurant": template = <RestaurantTemplate profile={profile} />; break;
    case "ecole": template = <EcoleTemplate profile={profile} />; break;
    case "artiste": template = <ArtisteTemplate profile={profile} />; break;
    case "immobilier": template = <ImmobilierTemplate profile={profile} />; break;
    case "ong": template = <OngTemplate profile={profile} />; break;
    case "agriculture": template = <AgricultureTemplate profile={profile} />; break;
    case "hotellerie": template = <HotellerieTemplate profile={profile} />; break;
    case "artisan":
    case "sante":
    case "evenementiel":
    case "transport":
      template = <ServiceTemplate profile={profile} />; break;
    default: notFound();
  }

  return (
    <>
      {!profile.published && (
        <div className="bg-amber-400 text-amber-950 text-center text-sm font-medium py-1.5 flex items-center justify-center gap-1.5">
          <Lock size={14} /> Brouillon : visible uniquement via ce lien tant que le site n&apos;est pas publié.
        </div>
      )}
      <SiteShell profile={profile}>
        <ProfileTabs
          profile={profile}
          reliability={reliability}
          subscriberCount={subscriberCount}
          reportsCount={reports}
          complaintsCount={complaints.length}
        >
          {template}
        </ProfileTabs>
      </SiteShell>
      {profile.published && <TrackView slug={profile.slug} />}
      {profile.published && <ActivityFeed profile={profile} views={stats.views} />}
      {profile.published && !profile.verified && <SafetyNotice slug={profile.slug} />}
      {profile.published && (
        <MobileTopBar
          businessName={profile.businessName}
          verified={profile.verified}
          slug={profile.slug}
          subscriberCount={subscriberCount}
          country={profile.country}
          accent={profile.theme.accent}
          avatarUrl={profile.avatarUrl}
        />
      )}
    </>
  );
}
