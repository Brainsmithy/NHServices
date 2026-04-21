import { readFile } from "node:fs/promises";
import { supabase } from "../db";

const LOGO_PATH = process.argv[2];
const BUCKET = "brand";
const STORAGE_KEY = "nh-logo.png";

if (!LOGO_PATH) {
  console.error("Usage: tsx scripts/upload-logo.ts <path-to-logo>");
  process.exit(1);
}

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.id === BUCKET);
  if (exists) {
    console.log(`bucket "${BUCKET}" already exists`);
    return;
  }
  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
  });
  if (error) throw error;
  console.log(`created public bucket "${BUCKET}"`);
}

async function main() {
  await ensureBucket();
  const buf = await readFile(LOGO_PATH);

  // Upsert so re-runs replace the current logo instead of erroring
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(STORAGE_KEY, buf, { contentType: "image/png", upsert: true });
  if (error) throw error;

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${STORAGE_KEY}`;
  console.log(`\n✓ uploaded. Public URL:\n${url}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
