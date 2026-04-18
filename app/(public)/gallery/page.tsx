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
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => ({
      id: r.id,
      url: publicUrl("gallery", r.storage_path),
      alt: r.alt ?? r.filename,
      createdAt: r.created_at,
    }));
  },
  ["gallery:public"],
  { tags: ["gallery"], revalidate: 300 },
);

export default async function GalleryPage() {
  const images = await getGallery();
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-16 px-6 sm:px-10 md:px-16 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand-blue mb-3">
            Our Work
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark-gray leading-tight">
            Gallery
          </h1>
          <div className="h-1 w-20 mx-auto bg-brand-gradient mt-4 rounded-full" />
          <p className="mt-5 max-w-2xl mx-auto text-gray-600">
            A look inside the installs, repairs, and tune-ups we&rsquo;ve handled
            across the Denver metro. Click any photo to enlarge.
          </p>
          {images.length > 0 && (
            <p className="mt-2 text-sm text-gray-400">
              {images.length} {images.length === 1 ? "photo" : "photos"}
            </p>
          )}
        </header>

        <GalleryGrid images={images} />
      </div>
    </main>
  );
}
