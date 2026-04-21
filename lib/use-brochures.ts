"use client";

import { useRealtimeResource } from "./use-realtime-resource";
import type { BrochureCategoryGroup } from "@/components/navbar/equipment-dropdown";

export function useBrochures(initial?: BrochureCategoryGroup[]) {
  return useRealtimeResource<BrochureCategoryGroup[]>({
    endpoint: "/api/brochures",
    table: "brochures",
    initial,
    empty: [],
  });
}
