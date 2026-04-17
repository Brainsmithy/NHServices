import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { desc, eq } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db
    .select()
    .from(schema.testimonials)
    .where(eq(schema.testimonials.approved, true))
    .orderBy(desc(schema.testimonials.createdAt));

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { firstName, lastName, message, rating } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof message !== "string" ||
    typeof rating !== "number" ||
    !firstName.trim() ||
    !lastName.trim() ||
    !message.trim() ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json(
      { error: "firstName, lastName, message, and rating (1-5) are required" },
      { status: 400 },
    );
  }

  const [inserted] = await db
    .insert(schema.testimonials)
    .values({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      message: message.trim().slice(0, 300),
      rating: Math.round(rating),
      approved: true,
    })
    .returning();

  return NextResponse.json(inserted, { status: 201 });
}
