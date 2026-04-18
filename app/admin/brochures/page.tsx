import { supabase } from "@/db";
import type { Brochure } from "@/db/types";
import { publicUrl } from "@/lib/storage";
import { BrochureUploadForm } from "@/components/admin/brochure-upload-form";
import { BrochureRowActions } from "@/components/admin/brochure-row-actions";
import {
  uploadBrochure,
  deleteBrochure,
  updateBrochureMeta,
} from "./actions";
import { CATEGORIES } from "./categories";

export const dynamic = "force-dynamic";

function PdfIcon() {
  return (
    <svg
      className="h-6 w-6"
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
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13" y2="17" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export default async function AdminBrochuresPage() {
  const { data, error } = await supabase
    .from("brochures")
    .select()
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw error;
  const rows: Brochure[] = data ?? [];

  const grouped = new Map<string, Brochure[]>();
  for (const r of rows) {
    const arr = grouped.get(r.category) ?? [];
    arr.push(r);
    grouped.set(r.category, arr);
  }

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand-blue mb-1">
            Equipment Library
          </p>
          <h1 className="text-3xl font-bold text-brand-dark-gray">Brochures</h1>
          <p className="text-sm text-gray-500 mt-1">
            {rows.length} {rows.length === 1 ? "brochure" : "brochures"} across {CATEGORIES.length} categories
          </p>
        </div>
      </header>

      <BrochureUploadForm action={uploadBrochure} categories={CATEGORIES} />

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-gray-500 font-medium">No brochures yet.</p>
          <p className="text-sm text-gray-400 mt-1">
            Upload PDF brochures above and they&rsquo;ll appear here grouped by category.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {CATEGORIES.map((cat) => {
            const items = grouped.get(cat) ?? [];
            if (items.length === 0) return null;
            return (
              <section key={cat}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-lg font-bold text-brand-dark-gray">
                    {cat}
                  </h2>
                  <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold">
                    {items.length}
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {items.map((b) => (
                    <article
                      key={b.id}
                      className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col"
                    >
                      <div className="p-5 border-b border-gray-100 flex items-start gap-3">
                        <div className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-red-50 text-red-600 shrink-0">
                          <PdfIcon />
                        </div>
                        <div className="min-w-0 flex-1">
                          <a
                            href={publicUrl("brochures", b.storage_path)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-dark-gray hover:text-brand-blue transition-colors break-words"
                          >
                            <span>{b.title}</span>
                            <ExternalIcon />
                          </a>
                          <p
                            className="text-xs text-gray-500 truncate font-mono mt-1"
                            title={b.filename}
                          >
                            {b.filename}
                          </p>
                        </div>
                      </div>
                      <div className="p-5 flex-1">
                        <BrochureRowActions
                          id={b.id}
                          title={b.title}
                          category={b.category}
                          categories={CATEGORIES}
                          updateMeta={updateBrochureMeta}
                          deleteBrochure={deleteBrochure}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
