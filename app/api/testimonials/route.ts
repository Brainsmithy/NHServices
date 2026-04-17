import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { revalidateTag, unstable_cache } from "next/cache";
import { z } from "zod";
import { db, schema } from "@/db";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const InsertSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  message: z.string().trim().min(1).max(1000),
  rating: z.number().int().min(1).max(5),
});

const getApproved = unstable_cache(
  async () =>
    db
      .select()
      .from(schema.testimonials)
      .where(eq(schema.testimonials.approved, true))
      .orderBy(desc(schema.testimonials.createdAt)),
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

  const [inserted] = await db
    .insert(schema.testimonials)
    .values({ ...parsed.data, approved: false })
    .returning();

  revalidateTag("testimonials", "default");
  return NextResponse.json(inserted, { status: 201 });
}
