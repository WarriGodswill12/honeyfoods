"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerChildren } from "@/components/shared/animated";

type GalleryImage = {
  id: string;
  type: "hero" | "gallery";
  url: string;
  alt: string;
  order: number;
};

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("/api/gallery?type=gallery");
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-14">
      <FadeIn className="text-center mb-8 sm:mb-12">
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-black">
          Gallery
        </h1>
        <p className="text-gray-600 mt-3">A glimpse of our dishes and cakes</p>
      </FadeIn>

      <StaggerChildren
        delay={0.05}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
      >
        {images.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-500 text-lg mb-4">No gallery images yet.</p>
            <p className="text-gray-400 text-sm">
              Check back soon to see our beautiful collection of dishes and
              creations!
            </p>
          </div>
        ) : (
          images.map((img) => (
            <button
              key={img.id}
              className="group relative overflow-hidden rounded-2xl aspect-square shadow-sm hover:shadow-xl transition-all"
              onClick={() => setSelected(img)}
              aria-label={img.alt}
            >
              {/* Use next/image for optimization if possible */}
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-charcoal-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))
        )}
      </StaggerChildren>

      {/* Simple Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="relative max-w-3xl w-full">
            <Image
              src={selected.url}
              alt={selected.alt}
              width={1200}
              height={800}
              className="w-full h-auto rounded-xl"
            />
            <Button
              variant="secondary"
              className="absolute top-3 right-3"
              onClick={() => setSelected(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
