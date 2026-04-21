"use client";

import { useState } from "react";
import { MediaUploader } from "./media-uploader";
import type { uploadBrochure } from "@/app/admin/brochures/actions";

type Props = {
  action: typeof uploadBrochure;
  categories: readonly string[];
};

export function BrochureUploadForm({ action, categories }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0] ?? "Heating");

  return (
    <MediaUploader
      action={action}
      accept="application/pdf"
      maxSizeBytes={10 * 1024 * 1024}
      label="brochure PDF"
    >
      <div>
        <label
          htmlFor="brochure-title"
          className="block text-sm font-semibold text-brand-dark-gray mb-1.5"
        >
          Title
          <span className="text-brand-orange ml-0.5">*</span>
        </label>
        <input
          id="brochure-title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., RUUD — R801T Gas Furnace"
          className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-base text-brand-dark-gray placeholder:text-gray-400 transition-colors hover:border-brand-blue focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
        />
      </div>
      <div>
        <label
          htmlFor="brochure-category"
          className="block text-sm font-semibold text-brand-dark-gray mb-1.5"
        >
          Category
          <span className="text-brand-orange ml-0.5">*</span>
        </label>
        <select
          id="brochure-category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white text-base text-brand-dark-gray transition-colors hover:border-brand-blue focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </MediaUploader>
  );
}
