"use client";

import { useState, useTransition } from "react";

type Props = {
  id: string;
  alt: string;
  updateAlt: (id: string, alt: string) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;
};

export function GalleryRowActions({ id, alt, updateAlt, deleteImage }: Props) {
  const [value, setValue] = useState(alt);
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const dirty = value.trim() !== alt.trim();

  const handleSave = () => {
    startTransition(async () => {
      await updateAlt(id, value);
      setSavedAt(Date.now());
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this image? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteImage(id);
    });
  };

  const showSaved = savedAt !== null && !dirty && !pending;

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor={`alt-${id}`}
          className="block text-xs font-semibold text-gray-600 mb-1"
        >
          Alt text
        </label>
        <input
          id={`alt-${id}`}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Describe the image"
          className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm text-brand-dark-gray placeholder:text-gray-400 transition-colors hover:border-brand-blue focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
        />
        {showSaved && (
          <p className="text-xs text-green-600 font-medium mt-1">Saved ✓</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || pending}
          className="flex-1 h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-blue text-white text-xs font-semibold shadow-sm hover:bg-brand-blue/90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {pending && dirty ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          aria-label="Delete image"
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
