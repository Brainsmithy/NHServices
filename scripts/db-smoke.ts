import "dotenv/config";
import { db, schema } from "../db";
import { eq } from "drizzle-orm";

async function main() {
  const [inserted] = await db
    .insert(schema.testimonials)
    .values({
      firstName: "Smoke",
      lastName: "Test",
      message: "testing",
      rating: 5,
      approved: true,
    })
    .returning();
  console.log("Inserted:", inserted);

  const rows = await db.select().from(schema.testimonials).where(eq(schema.testimonials.id, inserted.id));
  console.log("Selected:", rows);

  await db.delete(schema.testimonials).where(eq(schema.testimonials.id, inserted.id));
  console.log("Deleted.");
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
