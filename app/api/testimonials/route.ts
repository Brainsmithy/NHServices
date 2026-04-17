import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, unstable_cache } from "next/cache";
import { z } from "zod";
import { supabase } from "@/db";
import type { Testimonial } from "@/db/types";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const InsertSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  message: z.string().trim().min(1).max(1000),
  rating: z.number().int().min(1).max(5),
});

const getApproved = unstable_cache(
  async (): Promise<Testimonial[]> => {
    const { data, error } = await supabase
      .from("testimonials")
      .select()
      .eq("approved", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
  ["testimonials:approved"],
  { tags: ["testimonials"], revalidate: 60 },
);

export async function GET() {
  const rows = await getApproved();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`testimonial:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json(
      { error: "Too many submissions. Try again later." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = InsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { data: inserted, error } = await supabase
    .from("testimonials")
    .insert({
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      message: parsed.data.message,
      rating: parsed.data.rating,
      approved: false,
    })
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidateTag("testimonials", "default");
  return NextResponse.json(inserted, { status: 201 });
}
