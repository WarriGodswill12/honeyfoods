"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerChildren } from "@/components/shared/animated";

export default function GalleryPage() {
  const allImages = useQuery(api.gallery.getGalleryImages, { type: "gallery" });
  type GalleryImageType = NonNullable<typeof allImages>[number];
  const [selected, setSelected] = useState<GalleryImageType | null>(null);

  const images = allImages || [];

  // Find index of selected image
  const selectedIndex = selected
    ? images.findIndex((img) => img._id === selected._id)
    : -1;

  // Carousel navigation handlers
  const showPrev = () => {
    if (images.length && selectedIndex > 0) {
      setSelected(images[selectedIndex - 1]);
    }
  };
  const showNext = () => {
    if (images.length && selectedIndex < images.length - 1) {
      setSelected(images[selectedIndex + 1]);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!selected) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, selectedIndex, images]);

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
              key={img._id}
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
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-2xl sm:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto"
            onClick={(e) => e.stopPropagation()}
            // Touch swipe support
            onTouchStart={(e) => {
              e.currentTarget.dataset.touchStartX = String(
                e.touches[0].clientX,
              );
            }}
            onTouchEnd={(e) => {
              const startX = Number(e.currentTarget.dataset.touchStartX);
              const endX = e.changedTouches[0].clientX;
              if (startX - endX > 50) showNext();
              if (endX - startX > 50) showPrev();
            }}
          >
            {/* Left arrow */}
            {selectedIndex > 0 && (
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg z-10 sm:left-0 sm:-translate-x-full"
                onClick={showPrev}
                aria-label="Previous image"
              >
                <span className="text-2xl">&#8592;</span>
              </button>
            )}
            {/* Right arrow */}
            {selectedIndex < images.length - 1 && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg z-10 sm:right-0 sm:translate-x-full"
                onClick={showNext}
                aria-label="Next image"
              >
                <span className="text-2xl">&#8594;</span>
              </button>
            )}
            <Image
              src={selected.url}
              alt={selected.alt}
              width={1920}
              height={1080}
              className="w-full h-auto max-h-[80vh] sm:max-h-[90vh] rounded-xl object-contain"
              style={{ minHeight: "300px" }}
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
