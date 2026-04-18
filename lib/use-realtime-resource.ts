"use client";

import { useEffect, useRef, useState } from "react";
import { browserSupabase } from "@/db/browser";

interface Options<T> {
  endpoint: string;
  table: string;
  initial?: T;
  empty: T;
  parse?: (raw: unknown) => T;
}

export function useRealtimeResource<T>({
  endpoint,
  table,
  initial,
  empty,
  parse,
}: Options<T>) {
  const [data, setData] = useState<T>(initial ?? empty);
  const [isLoading, setIsLoading] = useState(initial === undefined);
  const refetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(endpoint, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load ${endpoint}`);
        const raw = (await res.json()) as unknown;
        if (cancelled) return;
        setData(parse ? parse(raw) : (raw as T));
      } catch (err) {
        console.error(`[realtime:${table}] load failed`, err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    const scheduleRefetch = () => {
      if (refetchTimer.current) clearTimeout(refetchTimer.current);
      refetchTimer.current = setTimeout(load, 400);
    };

    if (initial === undefined) void load();

    const supa = browserSupabase();
    const channel = supa
      ? supa
          .channel(`public-${table}`)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table },
            scheduleRefetch,
          )
          .subscribe()
      : null;

    return () => {
      cancelled = true;
      if (refetchTimer.current) clearTimeout(refetchTimer.current);
      if (channel && supa) void supa.removeChannel(channel);
    };
  }, [endpoint, table, parse, initial]);

  return { data, isLoading, setData };
}
