import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Providers } from "./providers";
import { AppNavbar } from "@/components/navbar/app-navbar";
import type { BrochureCategoryGroup } from "@/components/navbar/equipment-dropdown";
import { Footer } from "@/components/footer/footer";
import { supabase, isSupabaseConfigured } from "@/db";
import { publicUrl } from "@/lib/storage";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://nhserviceshvac.com",
  ),
  title: {
    default: "NH Services — HVAC in Colorado",
    template: "%s | NH Services",
  },
  description:
    "Family-run HVAC service, installation, and maintenance in the Denver metro area.",
  openGraph: {
    title: "NH Services — HVAC in Colorado",
    description: "Family-run HVAC service, installation, and maintenance.",
    url: "/",
    siteName: "NH Services",
    images: [{ url: "/images/van-pic.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/nhservices-logo-svg.svg",
  },
};

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const brochureCategories = await getBrochureCategories();
  const logoUrl = isSupabaseConfigured()
    ? publicUrl("brand", "nh-logo.png")
    : "/nhservices-logo-svg.svg";
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppNavbar
            brochureCategories={brochureCategories}
            logoUrl={logoUrl}
          />
          {children}
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
