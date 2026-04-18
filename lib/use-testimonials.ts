"use client";

import { useEffect, useRef, useState } from "react";
import { browserSupabase } from "@/db/browser";

export interface Testimonial {
  id: string;
  firstName: string;
  lastName: string;
  message: string;
  rating: number;
}

interface ApiTestimonial {
  id: string;
  first_name: string;
  last_name: string;
  message: string;
  rating: number;
}

function mapRows(rows: ApiTestimonial[]): Testimonial[] {
  return rows.map((r) => ({
    id: r.id,
    firstName: r.first_name,
    lastName: r.last_name,
    message: r.message,
    rating: r.rating,
  }));
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const refetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/testimonials", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load testimonials");
        const data = (await res.json()) as ApiTestimonial[];
        if (!cancelled) setTestimonials(mapRows(data));
      } catch (err) {
        console.error("[testimonials] load failed", err);
        if (!cancelled) setTestimonials([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    const scheduleRefetch = () => {
      if (refetchTimer.current) clearTimeout(refetchTimer.current);
      refetchTimer.current = setTimeout(load, 400);
    };

    void load();

    const supa = browserSupabase();
    const channel = supa
      ? supa
          .channel("public-testimonials")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "testimonials" },
            scheduleRefetch,
          )
          .subscribe()
      : null;

    return () => {
      cancelled = true;
      if (refetchTimer.current) clearTimeout(refetchTimer.current);
      if (channel && supa) void supa.removeChannel(channel);
    };
  }, []);

  return { testimonials, isLoading };
}
