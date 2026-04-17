export const CATEGORIES = [
  "Heating",
  "Air Conditioning",
  "Air Purification",
  "Water Heaters",
] as const;

export type Category = (typeof CATEGORIES)[number];
