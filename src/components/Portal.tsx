"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Rend ses enfants directement dans <body> pour que les overlays en
 * `position: fixed` ne soient PAS confinés par un ancêtre transformé
 * (animate-fade-up, lift, backdrop-blur… créent un bloc conteneur).
 */
export function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}
