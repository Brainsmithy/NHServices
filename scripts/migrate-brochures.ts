import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { supabase } from "../db";

const BROCHURES_DIR = "public/brochures";

const SEED: Array<{ filename: string; title: string; category: string }> = [
  { filename: "R801T UH Brochure.pdf", title: "RUUD — R801T Gas Furnace", category: "Heating" },
  { filename: "R802V Brochure.pdf", title: "RUUD — R802V Modulating Furnace", category: "Heating" },
  { filename: "R921V Brochure.pdf", title: "RUUD — R921V Modulating Furnace", category: "Heating" },
  { filename: "R962V Brochure.pdf", title: "RUUD — R962V Modulating Furnace", category: "Heating" },
  { filename: "RA13NZ Brochure.pdf", title: "RUUD — RA13NZ Air Conditioner", category: "Air Conditioning" },
  { filename: "RA15AZ Brochure.pdf", title: "RUUD — RA15AZ Air Conditioner", category: "Air Conditioning" },
  { filename: "HALO-LED-Spec-sheet-web.pdf", title: "REME HALO-LED Air Purifier", category: "Air Purification" },
  { filename: "NPE-2 Consumer Brochure 2204.pdf", title: "Navien NPE-2 Water Heater", category: "Water Heaters" },
];

function randomKey() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}.pdf`;
}

async function main() {
  let uploaded = 0;
  let skipped = 0;
  const perCategory: Record<string, number> = {};

  for (const row of SEED) {
    // Idempotency — skip if a brochure with this filename already exists
    const { data: existing } = await supabase
      .from("brochures")
      .select("id")
      .eq("filename", row.filename)
      .maybeSingle();
    if (existing) {
      console.log(`skip (already migrated): ${row.filename}`);
      skipped++;
      continue;
    }

    const buf = await readFile(join(BROCHURES_DIR, row.filename));
    const storagePath = randomKey();

    const { error: upErr } = await supabase.storage
      .from("brochures")
      .upload(storagePath, buf, { contentType: "application/pdf", upsert: false });
    if (upErr) {
      console.error(`upload failed for ${row.filename}:`, upErr.message);
      continue;
    }

    const order = (perCategory[row.category] ?? 0) + 10;
    perCategory[row.category] = order;

    const { error: insErr } = await supabase.from("brochures").insert({
      storage_path: storagePath,
      filename: row.filename,
      title: row.title,
      category: row.category,
      sort_order: order,
    });
    if (insErr) {
      console.error(`insert failed for ${row.filename}:`, insErr.message);
      await supabase.storage.from("brochures").remove([storagePath]);
      continue;
    }

    console.log(`✓ uploaded ${row.filename} → ${storagePath} (${row.category})`);
    uploaded++;
  }

  console.log(`\nDone. Uploaded: ${uploaded}, Skipped: ${skipped}.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
