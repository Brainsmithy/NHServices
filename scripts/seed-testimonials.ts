import { supabase } from "../db";

const SEED = [
  {
    first_name: "Sarah",
    last_name: "Mitchell",
    rating: 5,
    message:
      "Nick came out same-day when our furnace died in the middle of February. Quick diagnosis, fair pricing, and the install was clean. Couldn't have asked for better.",
  },
  {
    first_name: "Mark",
    last_name: "Patterson",
    rating: 5,
    message:
      "Nick installed a new heat pump for us last spring. He took the time to walk through every option and never once tried to upsell. Honest, knowledgeable, and the system has been flawless.",
  },
  {
    first_name: "Jennifer",
    last_name: "Walsh",
    rating: 5,
    message:
      "Showed up on time, professional from start to finish. Replaced our 20-year-old AC and the new unit runs so much quieter. Highly recommend NH Services to anyone in the Denver area.",
  },
  {
    first_name: "Robert",
    last_name: "Chen",
    rating: 5,
    message:
      "Fast, friendly, and reasonably priced. They serviced our furnace before winter hit and gave us peace of mind. We'll be using them every year.",
  },
  {
    first_name: "Linda",
    last_name: "Garcia",
    rating: 5,
    message:
      "Had a humidifier installed and a tune-up done in the same visit. The crew was respectful of our home and cleaned up everything before they left. Great experience all around.",
  },
  {
    first_name: "David",
    last_name: "Thompson",
    rating: 5,
    message:
      "Called for an emergency repair on a Sunday night and they got our heat back on within two hours. Genuinely caring people who clearly know their craft. Lifetime customer.",
  },
];

async function main() {
  let inserted = 0;
  let skipped = 0;
  for (const t of SEED) {
    // Idempotency — skip if a row with the same first+last+message already exists
    const { data: existing } = await supabase
      .from("testimonials")
      .select("id")
      .eq("first_name", t.first_name)
      .eq("last_name", t.last_name)
      .eq("message", t.message)
      .maybeSingle();
    if (existing) {
      console.log(`skip (already seeded): ${t.first_name} ${t.last_name}`);
      skipped++;
      continue;
    }
    const { error } = await supabase.from("testimonials").insert({
      ...t,
      approved: true,
    });
    if (error) {
      console.error(`insert failed for ${t.first_name}:`, error.message);
      continue;
    }
    console.log(`✓ seeded ${t.first_name} ${t.last_name} (${t.rating}★)`);
    inserted++;
  }
  console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
