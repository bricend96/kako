"use client";

import React from "react";

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-[var(--text)] mb-1">{label}</span>
      {children}
      {hint && <span className="block text-xs text-[var(--text-dim)] mt-1">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-[var(--text)] placeholder:text-[var(--text-dim)] outline-none focus:border-[var(--focus)] text-sm";

export function Text({
  value, onChange, placeholder,
}: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputCls} />
  );
}

export function Area({
  value, onChange, placeholder,
}: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <textarea value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} rows={3} className={inputCls} />
  );
}

export function Num({
  value, onChange, placeholder,
}: { value: number | undefined; onChange: (v: number) => void; placeholder?: string }) {
  return (
    <input
      type="number"
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      className={inputCls}
    />
  );
}

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5">
      <h3 className="font-bold text-[var(--text)] mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

/** Éditeur de galerie d'emojis / liste de chaînes courtes. */
export function EmojiListEditor({
  items, onChange,
}: { items: string[]; onChange: (items: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((v, i) => (
        <div key={i} className="relative">
          <input
            value={v}
            onChange={(e) => onChange(items.map((it, j) => (j === i ? e.target.value : it)))}
            className="w-12 h-12 text-center text-2xl rounded-xl border border-[var(--border)] outline-none focus:border-[var(--focus)]"
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="absolute -top-1.5 -right-1.5 bg-[var(--surface)] rounded-full w-5 h-5 text-[var(--text-dim)] hover:text-red-500 border border-[var(--border)] text-xs leading-none"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, "✨"])}
        className="w-12 h-12 rounded-xl border-2 border-dashed border-[var(--border)] text-[var(--text-dim)] text-xl hover:bg-[var(--surface-2)]"
      >
        +
      </button>
    </div>
  );
}

/** Éditeur de liste générique : ajoute/supprime des éléments. */
export function ListEditor<T>({
  items, onChange, blank, render, addLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  blank: () => T;
  render: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  addLabel: string;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-[var(--border)] p-3 relative">
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="absolute top-2 right-2 text-[var(--text-dim)] hover:text-red-500 text-lg leading-none"
            aria-label="Supprimer"
          >
            ×
          </button>
          <div className="space-y-2 pr-5">
            {render(item, (patch) =>
              onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)))
            )}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, blank()])}
        className="w-full rounded-xl border-2 border-dashed border-[var(--border)] text-[var(--text-muted)] text-sm font-medium py-2.5 hover:bg-[var(--surface-2)]"
      >
        + {addLabel}
      </button>
    </div>
  );
}
