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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-dark-gray">Gallery</h1>

      <MediaUploader
        action={uploadGalleryImage}
        accept="image/jpeg,image/png,image/webp"
        maxSizeBytes={5 * 1024 * 1024}
        label="photos"
      />

      {rows.length === 0 ? (
        <p className="text-gray-600">No gallery images yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {rows.map((r) => (
            <div
              key={r.id}
              className="rounded-lg border border-gray-200 bg-white overflow-hidden"
            >
              <div className="relative aspect-square bg-gray-50">
                <Image
                  src={publicUrl("gallery", r.storage_path)}
                  alt={r.alt ?? r.filename}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-3 space-y-2">
                <p className="text-xs text-gray-500 truncate" title={r.filename}>
                  {r.filename}
                </p>
                <GalleryRowActions
                  id={r.id}
                  alt={r.alt ?? ""}
                  updateAlt={updateGalleryAlt}
                  deleteImage={deleteGalleryImage}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
