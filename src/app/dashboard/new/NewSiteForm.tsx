"use client";

import { useState, useTransition } from "react";
import { CATEGORIES } from "@/lib/categories";
import type { Category } from "@/lib/types";
import { createProfileAction } from "../actions";
import { CategoryIcon } from "@/components/icons";

export default function NewSiteForm() {
  const [category, setCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [pending, start] = useTransition();

  function submit() {
    if (!category || !name.trim()) return;
    start(async () => {
      await createProfileAction(category, name.trim());
    });
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-[var(--text)] mb-3">1. Quel est ton métier ?</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`text-left rounded-2xl border-2 p-4 transition ${
              category === c.key ? "border-[var(--focus)] bg-[var(--surface-2)]" : "border-[var(--border)] hover:border-[var(--border)]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl grid place-items-center text-white"
                style={{ background: `linear-gradient(135deg, ${c.theme.from}, ${c.theme.to})` }}
              >
                <CategoryIcon category={c.key} size={22} />
              </div>
              <div>
                <p className="font-semibold text-[var(--text)]">{c.label}</p>
                <p className="text-xs text-[var(--text-muted)]">{c.goal}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-[var(--text)] mt-8 mb-3">2. Nom de ton activité</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ex : Awa Beauté, Chez Fatou…"
        className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-[var(--text)] outline-none focus:border-[var(--focus)]"
      />

      <button
        onClick={submit}
        disabled={!category || !name.trim() || pending}
        className="mt-6 w-full rounded-xl bg-[var(--btn)] text-white font-semibold py-3.5 disabled:opacity-40"
      >
        {pending ? "Création…" : "Créer mon site →"}
      </button>
    </div>
  );
}
