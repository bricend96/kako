"use client";

import { useState } from "react";
import type { Profile } from "@/lib/types";
import { Portal } from "./Portal";
import { useLockScroll } from "./useLockScroll";

/** Stories / statuts circulaires + visionneuse plein écran. */
export function Stories({ profile, className = "" }: { profile: Profile; className?: string }) {
  const stories = profile.stories;
  const [idx, setIdx] = useState<number | null>(null);
  useLockScroll(idx !== null);

  if (!stories?.length) return null;

  return (
    <div className={className}>
      <div className="hscroll flex gap-3 -mx-1 px-1 pb-1">
        {stories.map((st, i) => (
          <button key={i} onClick={() => setIdx(i)} className="shrink-0 flex flex-col items-center gap-1 w-16">
            <span className="w-16 h-16 rounded-full p-[2px]" style={{ background: `linear-gradient(135deg, ${profile.theme.from}, ${profile.theme.to})` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={st.imageUrl} alt="" className="w-full h-full rounded-full object-cover ring-2 ring-[var(--surface)]" />
            </span>
            <span className="text-[10px] text-[var(--text-muted)] truncate w-full text-center">{st.caption ?? "Story"}</span>
          </button>
        ))}
      </div>

      {idx !== null && (
        <Portal>
          <div className="fixed inset-0 z-[60] bg-black grid place-items-center" role="dialog" aria-modal="true">
            <div className="relative w-full max-w-md h-full sm:h-[85vh] sm:rounded-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={stories[idx].imageUrl} alt="" className="w-full h-full object-cover" />
              <div className="absolute top-0 inset-x-0 flex gap-1 p-2">
                {stories.map((_, i) => (
                  <span key={i} className={`h-1 flex-1 rounded-full ${i <= idx ? "bg-white" : "bg-white/30"}`} />
                ))}
              </div>
              {stories[idx].caption && (
                <p className="absolute bottom-6 inset-x-0 text-center text-white font-medium px-6 drop-shadow">{stories[idx].caption}</p>
              )}
              <button onClick={() => setIdx((c) => (c! > 0 ? c! - 1 : c))} className="absolute left-0 top-0 h-full w-1/3" aria-label="Précédent" />
              <button onClick={() => setIdx((c) => (c! < stories.length - 1 ? c! + 1 : null))} className="absolute right-0 top-0 h-full w-2/3" aria-label="Suivant" />
              <button onClick={() => setIdx(null)} className="absolute top-3 right-3 grid place-items-center w-9 h-9 rounded-full bg-black/50 text-white text-xl" aria-label="Fermer">×</button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
