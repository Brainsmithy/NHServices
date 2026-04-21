"use server";

import { auth } from "@/auth";
import { supabase } from "@/db";
import { revalidatePath, revalidateTag } from "next/cache";

async function assertAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function approveTestimonial(id: string) {
  await assertAdmin();
  const { error } = await supabase
    .from("testimonials")
    .update({ approved: true })
    .eq("id", id);
  if (error) throw error;
  revalidateTag("testimonials", "default");
  revalidatePath("/admin/testimonials");
}

export async function unapproveTestimonial(id: string) {
  await assertAdmin();
  const { error } = await supabase
    .from("testimonials")
    .update({ approved: false })
    .eq("id", id);
  if (error) throw error;
  revalidateTag("testimonials", "default");
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  await assertAdmin();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;
  revalidateTag("testimonials", "default");
  revalidatePath("/admin/testimonials");
}
