import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, schema } from "../db";

const email = process.env.ADMIN_EMAIL?.toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set.");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);

const [existing] = await db
  .select()
  .from(schema.users)
  .where(eq(schema.users.email, email))
  .limit(1);

if (existing) {
  await db
    .update(schema.users)
    .set({ passwordHash: hash, role: "admin" })
    .where(eq(schema.users.id, existing.id));
  console.log(`Updated admin: ${email}`);
} else {
  await db.insert(schema.users).values({
    email,
    passwordHash: hash,
    role: "admin",
  });
  console.log(`Created admin: ${email}`);
}

process.exit(0);
