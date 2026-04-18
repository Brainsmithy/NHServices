"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

export type GalleryItem = {
  id: string;
  url: string;
  alt: string;
};

export function GalleryGrid({ images }: { images: GalleryItem[] }) {
  const [visibleImages, setVisibleImages] = useState(8);
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const loadMoreImages = () =>
    setVisibleImages((v) => Math.min(v + 8, images.length));

  const openModal = (item: GalleryItem) => {
    setSelected(item);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelected(null);
    setModalIsOpen(false);
  };

  if (images.length === 0) {
    return (
      <p className="text-center text-gray-600 py-8">
        Gallery is empty. Check back soon!
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 bg-gray-300 rounded-xl gap-4 justify-center p-2">
        {images.slice(0, visibleImages).map((item, index) => (
          <div key={item.id} className="mb-4">
            <button
              type="button"
              onClick={() => openModal(item)}
              className="cursor-pointer block w-full p-0 bg-transparent border-0"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.url}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover rounded-xl drop-shadow-xl p-2 transition-transform hover:scale-105"
                  priority={index < 4}
                />
              </div>
            </button>
          </div>
        ))}
      </div>
      {visibleImages < images.length && (
        <div className="text-center my-4">
          <Button
            className="w-1/2 sm:w-1/4 text-white font-semibold h-12 rounded-lg shadow-lg text-lg bg-brand-gradient"
            onPress={loadMoreImages}
          >
            Load More
          </Button>
        </div>
      )}
      <Modal isOpen={modalIsOpen} placement="center" onClose={closeModal}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {selected?.alt ?? "Gallery Image"}
          </ModalHeader>
          <ModalBody>
            {selected && (
              <Image
                src={selected.url}
                alt={selected.alt}
                width={1600}
                height={1200}
                sizes="100vw"
                className="w-full h-auto"
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button className="rounded-lg" color="secondary" onPress={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
