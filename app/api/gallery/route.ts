import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/db";
import { publicUrl } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json([]);
  const { data, error } = await supabase
    .from("gallery_images")
    .select()
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const items = (data ?? []).map((r) => ({
    id: r.id,
    url: publicUrl("gallery", r.storage_path),
    alt: r.alt ?? r.filename,
    createdAt: r.created_at,
  }));
  return NextResponse.json(items);
}
