"use client";

import { deleteProfileAction } from "./actions";

export default function DeleteButton({ slug, name }: { slug: string; name: string }) {
  return (
    <form
      action={deleteProfileAction.bind(null, slug)}
      onSubmit={(e) => {
        if (!confirm(`Supprimer définitivement « ${name} » ?`)) e.preventDefault();
      }}
    >
      <button className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50">
        Suppr.
      </button>
    </form>
  );
}
