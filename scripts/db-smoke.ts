import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { supabase } from "../db";

async function main() {
  const { data: inserted, error: insertErr } = await supabase
    .from("testimonials")
    .insert({
      first_name: "Smoke",
      last_name: "Test",
      message: "testing",
      rating: 5,
      approved: true,
    })
    .select()
    .single();
  if (insertErr) throw insertErr;
  console.log("Inserted:", inserted);

  const { data: rows, error: selErr } = await supabase
    .from("testimonials")
    .select()
    .eq("id", inserted!.id);
  if (selErr) throw selErr;
  console.log("Selected:", rows);

  const { error: delErr } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", inserted!.id);
  if (delErr) throw delErr;
  console.log("Deleted.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
