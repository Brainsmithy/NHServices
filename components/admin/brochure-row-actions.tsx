"use client";

import { useState, useTransition } from "react";

type Props = {
  id: string;
  title: string;
  category: string;
  categories: readonly string[];
  updateMeta: (
    id: string,
    patch: { title?: string; category?: string },
  ) => Promise<void>;
  deleteBrochure: (id: string) => Promise<void>;
};

export function BrochureRowActions({
  id,
  title,
  category,
  categories,
  updateMeta,
  deleteBrochure,
}: Props) {
  const [t, setT] = useState(title);
  const [c, setC] = useState(category);
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const dirty = t.trim() !== title.trim() || c !== category;

  const handleSave = () => {
    startTransition(async () => {
      await updateMeta(id, { title: t, category: c });
      setSavedAt(Date.now());
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this brochure? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteBrochure(id);
    });
  };

  const showSaved = savedAt !== null && !dirty && !pending;

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor={`title-${id}`}
          className="block text-xs font-semibold text-gray-600 mb-1"
        >
          Title
        </label>
        <input
          id={`title-${id}`}
          type="text"
          value={t}
          onChange={(e) => setT(e.target.value)}
          className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm text-brand-dark-gray transition-colors hover:border-brand-blue focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
        />
      </div>
      <div>
        <label
          htmlFor={`cat-${id}`}
          className="block text-xs font-semibold text-gray-600 mb-1"
        >
          Category
        </label>
        <select
          id={`cat-${id}`}
          value={c}
          onChange={(e) => setC(e.target.value)}
          className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm text-brand-dark-gray bg-white transition-colors hover:border-brand-blue focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      {showSaved && (
        <p className="text-xs text-green-600 font-medium">Saved ✓</p>
      )}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || pending}
          className="flex-1 h-9 inline-flex items-center justify-center rounded-lg bg-brand-blue text-white text-xs font-semibold shadow-sm hover:bg-brand-blue/90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {pending && dirty ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          aria-label="Delete brochure"
          className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
