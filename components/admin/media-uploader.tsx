"use client";

import { useRef, useState, useTransition } from "react";

type Props = {
  action: (formData: FormData) => Promise<void>;
  accept: string; // e.g. "image/jpeg,image/png,image/webp"
  maxSizeBytes: number;
  label: string; // shown in the drop zone
  /** Optional extra form fields rendered inside the form (e.g. category). */
  children?: React.ReactNode;
};

function UploadIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-brand-blue"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

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
  const maxSizeMb = Math.round(maxSizeBytes / 1024 / 1024);

  function validate(files: File[]): string | null {
    for (const f of files) {
      if (acceptedTypes.length && !acceptedTypes.includes(f.type)) {
        return `"${f.name}" has an unsupported type (${f.type}).`;
      }
      if (f.size > maxSizeBytes) {
        return `"${f.name}" is too large (${(f.size / 1024 / 1024).toFixed(1)}MB > ${maxSizeMb}MB).`;
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

  function removeFile(index: number) {
    setSelected((prev) => prev.filter((_, i) => i !== index));
  }

  async function uploadOne(file: File) {
    const fd = new FormData();
    fd.append("file", file);
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

  const friendlyTypes = acceptedTypes
    .map((t) => t.split("/")[1]?.toUpperCase())
    .filter(Boolean)
    .join(", ");

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 space-y-5"
    >
      <button
        type="button"
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
        className={`w-full rounded-xl border-2 border-dashed py-10 px-6 text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue ${
          dragOver
            ? "border-brand-blue bg-blue-50/60 scale-[1.01]"
            : "border-gray-300 hover:border-brand-blue hover:bg-blue-50/30"
        }`}
      >
        <div className={`inline-flex items-center justify-center h-14 w-14 rounded-full mb-3 ${
          dragOver ? "bg-brand-blue text-white" : "bg-blue-50 text-brand-blue"
        } transition-colors`}>
          <UploadIcon />
        </div>
        <p className="text-base font-semibold text-brand-dark-gray">
          {selected.length > 0
            ? `${selected.length} file${selected.length === 1 ? "" : "s"} ready to upload`
            : `Drop ${label} here, or click to browse`}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {friendlyTypes} · up to {maxSizeMb}MB each
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
      </button>

      {selected.length > 0 && (
        <ul className="space-y-2">
          {selected.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
            >
              <FileIcon />
              <span className="flex-1 truncate text-sm text-brand-dark-gray font-medium">
                {f.name}
              </span>
              <span className="text-xs text-gray-400 shrink-0">
                {(f.size / 1024).toFixed(0)} KB
              </span>
              {!pending && (
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  aria-label={`Remove ${f.name}`}
                  className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <CloseIcon />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {children && <div className="space-y-3">{children}</div>}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={selected.length === 0 || pending}
          className="inline-flex items-center gap-2 px-5 h-10 rounded-lg bg-brand-gradient text-white text-sm font-semibold shadow-sm hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
        >
          {pending ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Uploading…
            </>
          ) : (
            <>
              <UploadIcon className="h-4 w-4" />
              <span>Upload{selected.length > 0 ? ` (${selected.length})` : ""}</span>
            </>
          )}
        </button>
        {selected.length > 0 && !pending && (
          <button
            type="button"
            onClick={() => {
              setSelected([]);
              if (fileInput.current) fileInput.current.value = "";
            }}
            className="px-4 h-10 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
}
