import Image from "next/image";
import { supabase } from "@/db";
import type { GalleryImage } from "@/db/types";
import { publicUrl } from "@/lib/storage";
import { MediaUploader } from "@/components/admin/media-uploader";
import {
  uploadGalleryImage,
  deleteGalleryImage,
  updateGalleryAlt,
} from "./actions";
import { GalleryRowActions } from "@/components/admin/gallery-row-actions";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const { data, error } = await supabase
    .from("gallery_images")
    .select()
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows: GalleryImage[] = data ?? [];

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand-blue mb-1">
            Media Library
          </p>
          <h1 className="text-3xl font-bold text-brand-dark-gray">Gallery</h1>
          <p className="text-sm text-gray-500 mt-1">
            {rows.length} {rows.length === 1 ? "image" : "images"} published to the public gallery
          </p>
        </div>
      </header>

      <MediaUploader
        action={uploadGalleryImage}
        accept="image/jpeg,image/png,image/webp"
        maxSizeBytes={5 * 1024 * 1024}
        label="photos"
      />

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-gray-500 font-medium">No gallery images yet.</p>
          <p className="text-sm text-gray-400 mt-1">
            Drop photos above to publish them to the public gallery.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rows.map((r, i) => (
            <article
              key={r.id}
              className="group rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-gray-100">
                <Image
                  src={publicUrl("gallery", r.storage_path)}
                  alt={r.alt ?? r.filename}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform group-hover:scale-[1.02]"
                  priority={i === 0}
                  loading={i < 3 ? "eager" : "lazy"}
                />
              </div>
              <div className="p-4 flex flex-col gap-3 flex-1">
                <p
                  className="text-xs text-gray-500 truncate font-mono"
                  title={r.filename}
                >
                  {r.filename}
                </p>
                <GalleryRowActions
                  id={r.id}
                  alt={r.alt ?? ""}
                  updateAlt={updateGalleryAlt}
                  deleteImage={deleteGalleryImage}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
