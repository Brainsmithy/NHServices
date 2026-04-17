const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");

export type Bucket = "gallery" | "brochures";

export function publicUrl(bucket: Bucket, path: string): string {
  return `${base}/storage/v1/object/public/${bucket}/${encodeURI(path)}`;
}
