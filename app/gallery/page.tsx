import Image from "next/image";
import { unstable_cache } from "next/cache";
import { GalleryGrid, type GalleryItem } from "@/components/gallery/gallery-grid";
import { supabase, isSupabaseConfigured } from "@/db";
import { publicUrl } from "@/lib/storage";

export const metadata = {
  title: "Gallery — NH Services",
  description:
    "Photos from NH Services HVAC installations and service calls across the Denver metro area.",
};

const getGallery = unstable_cache(
  async (): Promise<GalleryItem[]> => {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from("gallery_images")
      .select()
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => ({
      id: r.id,
      url: publicUrl("gallery", r.storage_path),
      alt: r.alt ?? r.filename,
    }));
  },
  ["gallery:public"],
  { tags: ["gallery"], revalidate: 300 },
);

export default async function GalleryPage() {
  const images = await getGallery();
  return (
    <main className="min-h-screen flex flex-col">
      <div className="mb-4 mt-4 flex justify-center">
        <Image
          src="/images/logos/nhservices-logo.png"
          alt="NH Services"
          width={200}
          height={144}
          style={{ width: "auto" }}
          className="h-36 w-auto"
          priority
        />
      </div>
      <h1 className="text-center font-bold text-4xl mb-4">Gallery</h1>
      <GalleryGrid images={images} />
    </main>
  );
}
