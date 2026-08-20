"use client";

import { useEffect, useState } from "react";
import { Portal } from "./Portal";
import { VerifiedBadge } from "@/components/blocks";
import { SubscribeButton } from "./SubscribeButton";

// Barre du haut fixe, mobile uniquement, qui apparaît au scroll :
// nom de la page + badge vérifié + icône d'abonnement.
export function MobileTopBar({
  businessName, verified, slug, subscriberCount, country, accent, avatarUrl,
}: {
  businessName: string; verified?: boolean; slug: string;
  subscriberCount: number; country?: string; accent: string; avatarUrl?: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Portal>
      <div
        className={`lg:hidden fixed top-0 inset-x-0 z-40 glass backdrop-blur-2xl backdrop-saturate-150 border-b border-[var(--border)] transition-transform duration-300 ${show ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="flex items-center gap-2 px-4 py-2.5">
          {avatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
          )}
          <span className="font-bold text-[var(--text)] truncate flex items-center gap-1.5 min-w-0">
            <span className="truncate">{businessName}</span>
            {verified && <VerifiedBadge size={16} />}
          </span>
          <span className="ml-auto shrink-0">
            <SubscribeButton slug={slug} initialCount={subscriberCount} country={country} accent={accent} compact />
          </span>
        </div>
      </div>
    </Portal>
  );
}
