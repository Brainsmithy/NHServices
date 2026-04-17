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

const imageArray: string[] = [
  "/images/gallery/gallery1.jpeg",
  "/images/gallery/gallery2.jpeg",
  "/images/gallery/gallery3.jpg",
  "/images/gallery/gallery4.jpg",
  "/images/gallery/gallery5.jpg",
  "/images/gallery/gallery6.jpg",
  "/images/gallery/gallery7.jpg",
  "/images/gallery/gallery8.jpg",
  "/images/gallery/gallery9.jpg",
  "/images/gallery/gallery10.jpg",
  "/images/gallery/gallery11.jpg",
  "/images/gallery/gallery12.jpg",
  "/images/gallery/gallery13.jpg",
  "/images/gallery/gallery14.jpg",
  "/images/gallery/gallery15.jpg",
  "/images/gallery/gallery16.jpg",
  "/images/gallery/gallery17.jpg",
  "/images/gallery/gallery18.jpg",
  "/images/gallery/gallery19.jpg",
  "/images/gallery/gallery20.jpg",
  "/images/gallery/gallery21.jpg",
  "/images/gallery/IMG_5627.jpeg",
  "/images/gallery/IMG_5665.jpeg",
  "/images/gallery/IMG_5786.jpeg",
  "/images/gallery/IMG_5929.jpeg",
  "/images/gallery/IMG_6101.jpeg",
  "/images/gallery/IMG_6199.jpeg",
  "/images/gallery/IMG_6201.jpeg",
  "/images/gallery/IMG_6714.jpeg",
  "/images/gallery/IMG_6737.jpeg",
  "/images/gallery/IMG_6922.jpeg",
  "/images/gallery/IMG_7071.jpeg",
  "/images/gallery/IMG_7465.jpeg",
  "/images/gallery/IMG_7467.jpeg",
  "/images/gallery/IMG_7468.jpeg",
  "/images/gallery/IMG_7469.jpeg",
  "/images/gallery/IMG_7686.jpeg",
];

export function GalleryGrid() {
  const [visibleImages, setVisibleImages] = useState(8);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const loadMoreImages = () =>
    setVisibleImages((v) => Math.min(v + 8, imageArray.length));

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalIsOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 bg-gray-300 rounded-xl gap-4 justify-center p-2">
        {imageArray.slice(0, visibleImages).map((url, index) => (
          <div key={index} className="mb-4">
            <button
              type="button"
              onClick={() => handleImageClick(url)}
              className="cursor-pointer block w-full p-0 bg-transparent border-0"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={url}
                  alt={`Gallery ${index + 1}`}
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
      {visibleImages < imageArray.length && (
        <div className="text-center my-4">
          <Button
            className="w-1/2 sm:w-1/4 text-white font-semibold h-12 shadow-lg text-lg bg-brand-gradient"
            onPress={loadMoreImages}
          >
            Load More
          </Button>
        </div>
      )}
      <Modal isOpen={modalIsOpen} placement="center" onClose={closeModal}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Gallery Image</ModalHeader>
          <ModalBody>
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Gallery Image"
                width={1600}
                height={1200}
                sizes="100vw"
                className="w-full h-auto"
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onPress={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
