"use client";

import { useEffect } from "react";

/** Enregistre une vue au montage + un clic sur tout lien WhatsApp (wa.me). */
export function TrackView({ slug }: { slug: string }) {
  useEffect(() => {
    const send = (type: "view" | "wa") =>
      navigator.sendBeacon?.("/api/track", new Blob([JSON.stringify({ slug, type })], { type: "application/json" }));

    send("view");

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href*="wa.me"]');
      if (a) send("wa");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [slug]);

  return null;
}
