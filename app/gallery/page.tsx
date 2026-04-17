import Image from "next/image";
import { GalleryGrid } from "@/components/gallery/gallery-grid";

export const metadata = {
  title: "Gallery — NH Services",
  description:
    "Photos from NH Services HVAC installations and service calls across the Denver metro area.",
};

export default function GalleryPage() {
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
      <h2 className="text-center font-bold text-4xl mb-4">Gallery</h2>
      <GalleryGrid />
    </main>
  );
}
