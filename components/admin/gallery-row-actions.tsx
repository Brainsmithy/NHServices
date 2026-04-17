"use client";

import { useState, useTransition } from "react";
import { Button, Input } from "@heroui/react";

type Props = {
  id: string;
  alt: string;
  updateAlt: (id: string, alt: string) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;
};

export function GalleryRowActions({ id, alt, updateAlt, deleteImage }: Props) {
  const [value, setValue] = useState(alt);
  const [pending, startTransition] = useTransition();
  const dirty = value.trim() !== alt.trim();

  return (
    <div className="space-y-2">
      <Input
        size="sm"
        label="Alt text"
        value={value}
        onValueChange={setValue}
        placeholder="Describe the image"
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          color="primary"
          variant="flat"
          isDisabled={!dirty || pending}
          isLoading={pending}
          onPress={() =>
            startTransition(async () => {
              await updateAlt(id, value);
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
            if (!confirm("Delete this image?")) return;
            startTransition(async () => {
              await deleteImage(id);
            });
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
