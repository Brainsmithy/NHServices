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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-dark-gray">Brochures</h1>

      <BrochureUploadForm action={uploadBrochure} categories={CATEGORIES} />

      {rows.length === 0 ? (
        <p className="text-gray-600">No brochures yet.</p>
      ) : (
        <div className="space-y-6">
          {CATEGORIES.map((cat) => {
            const items = grouped.get(cat) ?? [];
            if (items.length === 0) return null;
            return (
              <section key={cat}>
                <h2 className="text-lg font-semibold text-brand-dark-gray mb-2">
                  {cat}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {items.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-lg border border-gray-200 bg-white p-3 space-y-2"
                    >
                      <a
                        href={publicUrl("brochures", b.storage_path)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-brand-blue underline break-words"
                      >
                        {b.title}
                      </a>
                      <p
                        className="text-xs text-gray-500 truncate"
                        title={b.filename}
                      >
                        {b.filename}
                      </p>
                      <BrochureRowActions
                        id={b.id}
                        title={b.title}
                        category={b.category}
                        categories={CATEGORIES}
                        updateMeta={updateBrochureMeta}
                        deleteBrochure={deleteBrochure}
                      />
                    </div>
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
