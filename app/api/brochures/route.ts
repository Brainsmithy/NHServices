import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/db";
import { publicUrl } from "@/lib/storage";
import type { BrochureCategoryGroup } from "@/components/navbar/equipment-dropdown";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json([]);
  const { data, error } = await supabase
    .from("brochures")
    .select()
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const grouped = new Map<string, BrochureCategoryGroup>();
  for (const b of data ?? []) {
    const existing = grouped.get(b.category);
    const g: BrochureCategoryGroup =
      existing ?? { name: b.category, brochures: [] };
    g.brochures.push({
      id: b.id,
      title: b.title,
      url: publicUrl("brochures", b.storage_path),
    });
    grouped.set(b.category, g);
  }
  return NextResponse.json(Array.from(grouped.values()));
}
