import "dotenv/config";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./index";

await migrate(db, { migrationsFolder: "./db/migrations" });
console.log("Migrations applied.");
process.exit(0);
