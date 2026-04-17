"use client";

import { useState, useTransition } from "react";
import { Button, Input, Select, SelectItem } from "@heroui/react";

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
  const dirty = t.trim() !== title.trim() || c !== category;

  return (
    <div className="space-y-2">
      <Input
        size="sm"
        label="Title"
        value={t}
        onValueChange={setT}
      />
      <Select
        size="sm"
        label="Category"
        selectedKeys={[c]}
        onChange={(e) => setC(e.target.value)}
      >
        {categories.map((cat) => (
          <SelectItem key={cat}>{cat}</SelectItem>
        ))}
      </Select>
      <div className="flex gap-2">
        <Button
          size="sm"
          color="primary"
          variant="flat"
          isDisabled={!dirty || pending}
          isLoading={pending}
          onPress={() =>
            startTransition(async () => {
              await updateMeta(id, { title: t, category: c });
            })
          }
        >
          Save
        </Button>
        <Button
          size="sm"
          color="danger"
          variant="flat"
          isDisabled={pending}
          onPress={() => {
            if (!confirm("Delete this brochure?")) return;
            startTransition(async () => {
              await deleteBrochure(id);
            });
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
