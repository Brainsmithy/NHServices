import { unstable_cache } from "next/cache";
import { AppNavbar } from "@/components/navbar/app-navbar";
import type { BrochureCategoryGroup } from "@/components/navbar/equipment-dropdown";
import { PaymentLogos } from "@/components/sections/payment-logos";
import { Footer } from "@/components/footer/footer";
import { supabase, isSupabaseConfigured } from "@/db";
import { publicUrl } from "@/lib/storage";

const getBrochureCategories = unstable_cache(
  async (): Promise<BrochureCategoryGroup[]> => {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from("brochures")
      .select()
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });
    if (error) throw error;
    const grouped = new Map<string, BrochureCategoryGroup>();
    for (const b of data ?? []) {
      const existing = grouped.get(b.category);
      const g: BrochureCategoryGroup =
        existing ?? { name: b.category, brochures: [] };
      g.brochures.push({
        id: b.id,
        title: b.title,
        url: publicUrl("brochures", b.storage_path),
      });
      grouped.set(b.category, g);
    }
    return Array.from(grouped.values());
  },
  ["brochures:nav"],
  { tags: ["brochures"], revalidate: 300 },
);

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const brochureCategories = await getBrochureCategories();
  const logoUrl = isSupabaseConfigured()
    ? publicUrl("brand", "nh-logo.png")
    : "/nhservices-logo-svg.svg";
  return (
    <>
      <AppNavbar
        brochureCategories={brochureCategories}
        logoUrl={logoUrl}
      />
      <PaymentLogos />
      {children}
      <Footer />
    </>
  );
}
