"use client";

import { useRealtimeResource } from "./use-realtime-resource";
import type { GalleryItem } from "@/components/gallery/gallery-grid";

export function useGallery(initial?: GalleryItem[]) {
  return useRealtimeResource<GalleryItem[]>({
    endpoint: "/api/gallery",
    table: "gallery_images",
    initial,
    empty: [],
  });
}
