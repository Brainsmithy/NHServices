"use server";

import { auth } from "@/auth";
import { supabase } from "@/db";
import { revalidatePath, revalidateTag } from "next/cache";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

async function assertAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

function extFor(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "bin";
}

function randomKey(): string {
  // Simple random key for the storage path (not user-visible)
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function uploadGalleryImage(formData: FormData): Promise<void> {
  await assertAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("No file provided.");
  if (!ALLOWED.has(file.type))
    throw new Error(`Unsupported type: ${file.type}`);
  if (file.size > MAX_BYTES) throw new Error("File is larger than 5 MB.");

  const storagePath = `${randomKey()}.${extFor(file.type)}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: upErr } = await supabase.storage
    .from("gallery")
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });
  if (upErr) throw upErr;

  // Highest current sort_order + 1 so new uploads land at the end
  const { data: max } = await supabase
    .from("gallery_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error: insErr } = await supabase.from("gallery_images").insert({
    storage_path: storagePath,
    filename: file.name,
    alt: null,
    sort_order: (max?.sort_order ?? 0) + 10,
  });
  if (insErr) {
    // Rollback storage upload on DB failure
    await supabase.storage.from("gallery").remove([storagePath]);
    throw insErr;
  }

  revalidateTag("gallery", "default");
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await assertAdmin();
  const { data: row, error: selErr } = await supabase
    .from("gallery_images")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();
  if (selErr) throw selErr;
  if (!row) return;

  const { error: delErr } = await supabase
    .from("gallery_images")
    .delete()
    .eq("id", id);
  if (delErr) throw delErr;

  await supabase.storage.from("gallery").remove([row.storage_path]);

  revalidateTag("gallery", "default");
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function updateGalleryAlt(id: string, alt: string): Promise<void> {
  await assertAdmin();
  const trimmed = alt.trim();
  const { error } = await supabase
    .from("gallery_images")
    .update({ alt: trimmed || null })
    .eq("id", id);
  if (error) throw error;
  revalidateTag("gallery", "default");
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}
