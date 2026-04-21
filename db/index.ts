import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazy client — does NOT fail at module load if env vars are missing.
// Fails only when a Supabase method is actually called. This lets the
// Vercel build collect page data before env vars are set, and lets
// routes that short-circuit on missing env (see isSupabaseConfigured)
// skip network work entirely.
let _client: SupabaseClient | null = null;

function makeClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase env missing: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_client) _client = makeClient();
    const value = Reflect.get(_client, prop, _client);
    return typeof value === "function" ? value.bind(_client) : value;
  },
}) as SupabaseClient;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export type * from "./types";
