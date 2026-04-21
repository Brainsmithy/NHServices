"use server";

import { auth } from "@/auth";
import { supabase } from "@/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { CATEGORIES } from "./categories";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = new Set(["application/pdf"]);

async function assertAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

function randomKey(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function validateCategory(c: string): c is (typeof CATEGORIES)[number] {
  return (CATEGORIES as readonly string[]).includes(c);
}

export async function uploadBrochure(formData: FormData): Promise<void> {
  await assertAdmin();
  const file = formData.get("file");
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();

  if (!(file instanceof File)) throw new Error("No file provided.");
  if (!ALLOWED.has(file.type))
    throw new Error(`Unsupported type: ${file.type}. PDF only.`);
  if (file.size > MAX_BYTES) throw new Error("File is larger than 10 MB.");
  if (!title) throw new Error("Title is required.");
  if (!validateCategory(category))
    throw new Error(`Invalid category: ${category}`);

  const storagePath = `${randomKey()}.pdf`;
  const arrayBuffer = await file.arrayBuffer();

  const { error: upErr } = await supabase.storage
    .from("brochures")
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });
  if (upErr) throw upErr;

  const { data: max } = await supabase
    .from("brochures")
    .select("sort_order")
    .eq("category", category)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error: insErr } = await supabase.from("brochures").insert({
    storage_path: storagePath,
    filename: file.name,
    title,
    category,
    sort_order: (max?.sort_order ?? 0) + 10,
  });
  if (insErr) {
    await supabase.storage.from("brochures").remove([storagePath]);
    throw insErr;
  }

  revalidateTag("brochures", "default");
  revalidatePath("/admin/brochures");
  revalidatePath("/");
}

export async function deleteBrochure(id: string): Promise<void> {
  await assertAdmin();
  const { data: row, error: selErr } = await supabase
    .from("brochures")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();
  if (selErr) throw selErr;
  if (!row) return;

  const { error: delErr } = await supabase
    .from("brochures")
    .delete()
    .eq("id", id);
  if (delErr) throw delErr;

  await supabase.storage.from("brochures").remove([row.storage_path]);

  revalidateTag("brochures", "default");
  revalidatePath("/admin/brochures");
  revalidatePath("/");
}

export async function updateBrochureMeta(
  id: string,
  patch: { title?: string; category?: string },
): Promise<void> {
  await assertAdmin();
  const update: Record<string, string> = {};
  if (patch.title !== undefined) {
    const t = patch.title.trim();
    if (!t) throw new Error("Title cannot be empty.");
    update.title = t;
  }
  if (patch.category !== undefined) {
    if (!validateCategory(patch.category))
      throw new Error(`Invalid category: ${patch.category}`);
    update.category = patch.category;
  }
  if (Object.keys(update).length === 0) return;
  const { error } = await supabase.from("brochures").update(update).eq("id", id);
  if (error) throw error;
  revalidateTag("brochures", "default");
  revalidatePath("/admin/brochures");
  revalidatePath("/");
}
