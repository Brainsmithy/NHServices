"use server";

import { auth } from "@/auth";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

async function assertAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function approveTestimonial(id: string) {
  await assertAdmin();
  await db
    .update(schema.testimonials)
    .set({ approved: true })
    .where(eq(schema.testimonials.id, id));
  revalidateTag("testimonials", "default");
  revalidatePath("/admin/testimonials");
}

export async function unapproveTestimonial(id: string) {
  await assertAdmin();
  await db
    .update(schema.testimonials)
    .set({ approved: false })
    .where(eq(schema.testimonials.id, id));
  revalidateTag("testimonials", "default");
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  await assertAdmin();
  await db.delete(schema.testimonials).where(eq(schema.testimonials.id, id));
  revalidateTag("testimonials", "default");
  revalidatePath("/admin/testimonials");
}
