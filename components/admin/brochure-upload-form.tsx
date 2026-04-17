"use client";

import { useState } from "react";
import { Input, Select, SelectItem } from "@heroui/react";
import { MediaUploader } from "./media-uploader";
import type { uploadBrochure } from "@/app/admin/brochures/actions";

type Props = {
  action: typeof uploadBrochure;
  categories: readonly string[];
};

export function BrochureUploadForm({ action, categories }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Heating");

  return (
    <MediaUploader
      action={action}
      accept="application/pdf"
      maxSizeBytes={10 * 1024 * 1024}
      label="brochure PDF"
    >
      <Input
        name="title"
        label="Title"
        placeholder="e.g., RUUD — R801T Gas Furnace"
        value={title}
        onValueChange={setTitle}
        isRequired
      />
      <Select
        name="category"
        label="Category"
        selectedKeys={[category]}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map((c) => (
          <SelectItem key={c}>{c}</SelectItem>
        ))}
      </Select>
    </MediaUploader>
  );
}
