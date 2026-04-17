"use client";

import { useRef, useState, useTransition } from "react";
import { Button } from "@heroui/react";

type Props = {
  action: (formData: FormData) => Promise<void>;
  accept: string; // e.g. "image/jpeg,image/png,image/webp"
  maxSizeBytes: number;
  label: string; // shown in the drop zone
  /** Optional extra form fields rendered below the drop zone (e.g. category). */
  children?: React.ReactNode;
};

export function MediaUploader({
  action,
  accept,
  maxSizeBytes,
  label,
  children,
}: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selected, setSelected] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const acceptedTypes = accept.split(",").map((s) => s.trim());

  function validate(files: File[]): string | null {
    for (const f of files) {
      if (acceptedTypes.length && !acceptedTypes.includes(f.type)) {
        return `"${f.name}" has an unsupported type (${f.type}).`;
      }
      if (f.size > maxSizeBytes) {
        return `"${f.name}" is too large (${(f.size / 1024 / 1024).toFixed(1)}MB > ${(maxSizeBytes / 1024 / 1024).toFixed(0)}MB).`;
      }
    }
    return null;
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const arr = Array.from(files);
    const err = validate(arr);
    if (err) {
      setError(err);
      setSelected([]);
      return;
    }
    setError(null);
    setSelected(arr);
  }

  async function uploadOne(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    // Carry any sibling form fields (e.g. category, title) into the action
    if (formRef.current) {
      for (const [k, v] of new FormData(formRef.current).entries()) {
        if (k !== "file") fd.append(k, v);
      }
    }
    await action(fd);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selected.length === 0) return;
    startTransition(async () => {
      try {
        for (const f of selected) await uploadOne(f);
        setSelected([]);
        if (fileInput.current) fileInput.current.value = "";
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      }
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg border border-gray-200 bg-white p-4"
    >
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInput.current?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition ${
          dragOver
            ? "border-brand-blue bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <p className="text-sm text-gray-600">
          {selected.length > 0
            ? `${selected.length} file(s) ready to upload`
            : `Drop ${label} here, or click to pick files`}
        </p>
        <input
          ref={fileInput}
          type="file"
          name="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {selected.length > 0 && (
        <ul className="text-sm text-gray-600 space-y-1">
          {selected.map((f, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="truncate">{f.name}</span>
              <span className="text-xs text-gray-400">
                {(f.size / 1024).toFixed(0)} KB
              </span>
            </li>
          ))}
        </ul>
      )}

      {children}

      {error && (
        <p className="text-sm text-red-700 bg-red-50 rounded px-2 py-1">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <Button
          type="submit"
          color="primary"
          isDisabled={selected.length === 0 || pending}
          isLoading={pending}
        >
          Upload {selected.length > 0 ? `(${selected.length})` : ""}
        </Button>
        {selected.length > 0 && !pending && (
          <Button
            type="button"
            variant="flat"
            onPress={() => {
              setSelected([]);
              if (fileInput.current) fileInput.current.value = "";
            }}
          >
            Clear
          </Button>
        )}
      </div>
    </form>
  );
}
