import { readdir, readFile } from "node:fs/promises";
import { extname, basename, join } from "node:path";
import { supabase } from "../db";

const GALLERY_DIR = "public/images/gallery";

function mimeFor(ext: string): string | null {
  const e = ext.toLowerCase();
  if (e === ".jpg" || e === ".jpeg") return "image/jpeg";
  if (e === ".png") return "image/png";
  if (e === ".webp") return "image/webp";
  return null;
}

async function main() {
  const entries = await readdir(GALLERY_DIR);
  const files = entries
    .filter((f) => !f.startsWith("."))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  console.log(`Found ${files.length} files in ${GALLERY_DIR}`);

  let uploaded = 0;
  let skipped = 0;
  let order = 10;

  for (const filename of files) {
    const mime = mimeFor(extname(filename));
    if (!mime) {
      console.log(`skip (unknown type): ${filename}`);
      continue;
    }

    // Idempotency — skip if a row with this filename already exists.
    const { data: existing } = await supabase
      .from("gallery_images")
      .select("id")
      .eq("filename", filename)
      .maybeSingle();
    if (existing) {
      console.log(`skip (already migrated): ${filename}`);
      skipped++;
      order += 10;
      continue;
    }

    const buf = await readFile(join(GALLERY_DIR, filename));
    const storagePath = `${Date.now().toString(36)}-${basename(filename, extname(filename))}${extname(filename).toLowerCase() === ".jpeg" ? ".jpg" : extname(filename).toLowerCase()}`;

    const { error: upErr } = await supabase.storage
      .from("gallery")
      .upload(storagePath, buf, { contentType: mime, upsert: false });
    if (upErr) {
      console.error(`upload failed for ${filename}:`, upErr.message);
      continue;
    }

    const { error: insErr } = await supabase.from("gallery_images").insert({
      storage_path: storagePath,
      filename,
      alt: null,
      sort_order: order,
    });
    if (insErr) {
      console.error(`insert failed for ${filename}:`, insErr.message);
      await supabase.storage.from("gallery").remove([storagePath]);
      continue;
    }

    console.log(`✓ uploaded ${filename} → ${storagePath}`);
    uploaded++;
    order += 10;
  }

  console.log(`\nDone. Uploaded: ${uploaded}, Skipped: ${skipped}.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
