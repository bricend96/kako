"use client";

import { useEffect } from "react";

/** Bloque le scroll de la page tant que `active` est vrai (modale/panier/paiement ouvert). */
export function useLockScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}
