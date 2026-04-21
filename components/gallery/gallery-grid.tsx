"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Modal,
  ModalContent,
  ModalBody,
} from "@heroui/react";
import { useGallery } from "@/lib/use-gallery";

export type GalleryItem = {
  id: string;
  url: string;
  alt: string;
  createdAt?: string;
};

const PAGE_SIZE = 12;

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ZoomIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

export function GalleryGrid({ images: initialImages }: { images: GalleryItem[] }) {
  const { data: images } = useGallery(initialImages);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const isOpen = activeIndex !== null;
  const active = activeIndex !== null ? images[activeIndex] : null;

  const close = useCallback(() => setActiveIndex(null), []);

  const goPrev = useCallback(() => {
    setActiveIndex((i) =>
      i === null ? null : (i - 1 + images.length) % images.length,
    );
  }, [images.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) =>
      i === null ? null : (i + 1) % images.length,
    );
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, goPrev, goNext, close]);

  if (images.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
        <p className="text-gray-600 font-medium">Gallery is empty.</p>
        <p className="text-sm text-gray-400 mt-1">
          Check back soon — new photos go up after every job.
        </p>
      </div>
    );
  }

  const visible = images.slice(0, visibleCount);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {visible.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative block w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 transition-shadow"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={item.url}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                priority={index < 4}
                loading={index < 4 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
              <div className="absolute top-3 right-3 inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/95 text-brand-dark-gray shadow-md opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90 transition-all">
                <ZoomIcon />
              </div>
            </div>
          </button>
        ))}
      </div>

      {visibleCount < images.length && (
        <div className="text-center mt-10">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((v) => Math.min(v + PAGE_SIZE, images.length))
            }
            className="inline-flex items-center gap-2 px-7 h-12 rounded-full text-white font-semibold bg-brand-gradient shadow-lg hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 transition-opacity"
          >
            Load more
            <span className="text-xs font-normal opacity-80">
              ({images.length - visibleCount} remaining)
            </span>
          </button>
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onClose={close}
        size="5xl"
        backdrop="blur"
        hideCloseButton
        classNames={{
          base: "bg-transparent shadow-none",
          body: "p-0",
        }}
      >
        <ModalContent>
          {active && (
            <ModalBody>
              <div className="relative">
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="absolute -top-2 right-0 sm:top-3 sm:right-3 z-10 inline-flex items-center justify-center h-10 w-10 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                >
                  <CloseIcon />
                </button>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous photo"
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center h-11 w-11 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                >
                  <ChevronIcon direction="left" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next photo"
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center h-11 w-11 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                >
                  <ChevronIcon direction="right" />
                </button>
                <div className="relative bg-black rounded-2xl overflow-hidden">
                  <Image
                    key={active.id}
                    src={active.url}
                    alt={active.alt}
                    width={1920}
                    height={1280}
                    sizes="100vw"
                    className="w-full h-auto max-h-[85vh] object-contain"
                    priority
                  />
                </div>
                <div className="mt-3 text-center text-xs text-white/70">
                  {(activeIndex ?? 0) + 1} of {images.length}
                </div>
              </div>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
