import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import bcrypt from "bcryptjs";
import { supabase } from "../db";

const email = process.env.ADMIN_EMAIL?.toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set.");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);

const { data: existing, error: selErr } = await supabase
  .from("users")
  .select("id")
  .eq("email", email)
  .maybeSingle();
if (selErr) {
  console.error(selErr);
  process.exit(1);
}

if (existing) {
  const { error } = await supabase
    .from("users")
    .update({ password_hash: hash, role: "admin" })
    .eq("id", existing.id);
  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.log(`Updated admin: ${email}`);
} else {
  const { error } = await supabase.from("users").insert({
    email,
    password_hash: hash,
    role: "admin",
  });
  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.log(`Created admin: ${email}`);
}

process.exit(0);
