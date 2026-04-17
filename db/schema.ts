import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const testimonials = sqliteTable("testimonials", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  message: text("message").notNull(),
  rating: integer("rating").notNull(),
  approved: integer("approved", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
