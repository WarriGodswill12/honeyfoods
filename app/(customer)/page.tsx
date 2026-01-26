"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/store/cart-store";
import { formatPrice, slugify } from "@/lib/utils";
import {
  ArrowRight,
  ShoppingCart,
  Package,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { FadeIn, StaggerChildren } from "@/components/shared/animated";

// Hero Section with Background Image Slider
function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredGallery = useQuery(api.gallery.getFeaturedGalleryImages);

  const defaultSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1920&q=80",
      alt: "Jollof Rice",
    },
    {
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&q=80",
      alt: "Custom Cakes",
    },
    {
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&q=80",
      alt: "Fresh Pastries",
    },
    {
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=80",
      alt: "Party Platter",
    },
  ];

  // Use featured images if available, otherwise use defaults
  const slides =
    featuredGallery && featuredGallery.length > 0
      ? featuredGallery.map((img) => ({ image: img.url, alt: img.alt }))
      : defaultSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[70vh] sm:h-[80vh] lg:h-screen overflow-hidden">
      {/* Background Slider */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal-black/60" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12 h-full flex items-center justify-center">
        <FadeIn className="text-center max-w-4xl">
          <h1 className="font-heading text-3xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Authentic Flavours.
            <span className="text-honey-gold block mt-2">Delivered Fresh.</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto">
            Premium Nigerian cuisine and pastries crafted with love, delivered
            to your doorstep
          </p>
          <Link href="/shop">
            <Button
              size="lg"
              className="text-base sm:text-lg px-8 py-6 shadow-2xl hover:scale-105 transition-transform font-semibold"
            >
              Explore Our Menu
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

// Categories Section
// Our Menu Section
function CategoriesSection() {
  const categories = [
    {
      name: "Nigerian Foods",
      description: "Authentic West African flavors",
      image:
        "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&q=80",
      href: "/shop?category=Nigerian%20Foods",
    },
    {
      name: "Pastries",
      description: "Freshly baked daily",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
      href: "/shop?category=Pastries",
    },
    {
      name: "Cakes",
      description: "Custom made for your special moments",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
      href: "/shop?category=Cakes",
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-linear-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <FadeIn className="text-center mb-12 sm:mb-16">
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal-black mb-5">
            Our Menu
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our curated selection of authentic, flavor-packed dishes
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <StaggerChildren key={category.name} delay={index * 0.1}>
              <Link href={category.href}>
                <div className="group relative overflow-hidden rounded-3xl aspect-4/5 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-charcoal-black via-charcoal-black/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                    <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-white/90 text-sm sm:text-base mb-4">
                      {category.description}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full bg-white/10 border-white/30 text-white hover:bg-white hover:text-charcoal-black backdrop-blur-sm font-semibold"
                    >
                      Explore {category.name}
                    </Button>
                  </div>
                </div>
              </Link>
            </StaggerChildren>
          ))}
        </div>
      </div>
    </section>
  );
}

// Your Favourites (Featured Products)
function FeaturedProducts() {
  const allProducts = useQuery(api.products.getProducts, {});
  const { addItem } = useCart();

  // Get available products, limit to 6
  const products = allProducts
    ? allProducts.filter((p) => p.available).slice(0, 6)
    : [];

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-soft-cream">
      <div className="container mx-auto px-6 lg:px-12">
        <FadeIn className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-charcoal-black mb-4">
            Your Favourites
          </h2>
        </FadeIn>

        <StaggerChildren
          delay={0.1}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {products.map((product) => (
            <Link key={product._id} href={`/shop/${slugify(product.name)}`}>
              <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={product.image || "/images/placeholder-product.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 sm:p-5 lg:p-6">
                  <Badge
                    variant="secondary"
                    className="mb-2 text-[10px] sm:text-xs"
                  >
                    {product.category}
                  </Badge>
                  <h3 className="font-heading text-base sm:text-lg lg:text-xl font-bold text-charcoal-black mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                    {product.description || "Delicious homemade food"}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-heading text-lg sm:text-xl lg:text-2xl font-bold text-honey-gold">
                      £{product.price.toFixed(2)}
                    </p>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addItem({
                          productId: product._id,
                          name: product.name,
                          price: product.price,
                          imageUrl: product.image,
                        });
                      }}
                      className="active:scale-95 shrink-0"
                    >
                      <ShoppingCart className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Add</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </StaggerChildren>

        <div className="text-center mt-8 sm:mt-10 lg:mt-12">
          <Link href="/gallery">
            <Button
              size="lg"
              className="shadow-lg active:scale-95 text-sm sm:text-base"
            >
              View Gallery Photos
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorks() {
  const steps = [
    {
      icon: Package,
      title: "Browse & Order",
      description:
        "Explore our curated menu filled with authentic, flavor-packed dishes made with love.",
    },
    {
      icon: Sparkles,
      title: "Freshly Prepared",
      description:
        "Every order is freshly prepared with handpicked ingredients and traditional techniques.",
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description:
        "We bring your meal right to your doorstep, fast and with care.",
    },
    {
      icon: Star,
      title: "Enjoy & Savor",
      description:
        "Unwrap, savor, and enjoy a dining experience that feels homemade yet unforgettable.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <FadeIn className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-charcoal-black mb-4">
            How It Works
          </h2>
        </FadeIn>

        <StaggerChildren
          delay={0.15}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
        >
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-honey-gold/10 mb-6">
                <step.icon className="w-8 h-8 text-honey-gold" />
              </div>
              <h3 className="font-heading text-xl font-bold text-charcoal-black mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

// About Section with Image
// Welcome to Honey Foods Section
function AboutSection() {
  const [aboutImage, setAboutImage] = useState(
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80",
  );

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.aboutUsImage) {
          setAboutImage(data.aboutUsImage);
        }
      })
      .catch((err) => console.error("Error fetching settings:", err));
  }, []);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-7xl mx-auto">
          <FadeIn className="lg:w-1/2 w-full">
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={aboutImage}
                alt="About Honey Foods"
                className="w-full h-full object-cover"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="lg:w-1/2 w-full">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-charcoal-black mb-6 leading-tight">
              Welcome to Honey Foods
            </h2>
            <div className="space-y-5 text-gray-700">
              <p className="text-base sm:text-lg lg:text-xl leading-relaxed">
                At Honey Foods, we believe that great food should be both a
                visual masterpiece and a flavourful journey. Specialising in
                authentic Nigerian cuisine and premium pastries, we blend the
                refined art of presentation with the vibrant soul of West
                African flavors.
              </p>
              <p className="text-base sm:text-lg lg:text-xl leading-relaxed">
                Every dish is crafted with passion, using only the finest
                ingredients and time-honored recipes passed down through
                generations.
              </p>
            </div>
            <Link href="/about">
              <Button
                size="lg"
                className="mt-8 text-base font-semibold hover:scale-105 transition-transform"
              >
                Find Out More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// Gallery Section with Auto-Sliding Slideshow
function GallerySection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const galleryImages = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1920&q=80",
      alt: "Delicious Jollof Rice",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&q=80",
      alt: "Beautiful Custom Cake",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&q=80",
      alt: "Fresh Meat Pies",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=80",
      alt: "Party Platter",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1920&q=80",
      alt: "Golden Puff Puff",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1920&q=80",
      alt: "Elegant Wedding Cake",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length,
    );
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-linear-to-b from-soft-cream to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <FadeIn className="text-center mb-10 sm:mb-14">
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal-black mb-4">
            Our Gallery
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            A taste of what we create with love and passion
          </p>
        </FadeIn>

        {/* Slideshow */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative h-100 sm:h-125 lg:h-150 rounded-3xl overflow-hidden shadow-2xl">
            {galleryImages.map((image, index) => (
              <div
                key={image.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-charcoal-black/90 via-charcoal-black/50 to-transparent p-8">
                  <p className="text-white font-heading text-2xl sm:text-3xl lg:text-4xl font-bold">
                    {image.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/gallery">
            <Button
              size="lg"
              className="shadow-lg hover:scale-105 transition-transform text-base font-semibold"
            >
              View Gallery Photos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section with Background Image Slider */}
      <HeroSection />

      {/* Welcome to Honey Foods */}
      <AboutSection />

      {/* Gallery Slideshow */}
      <GallerySection />

      {/* Our Menu */}
      <CategoriesSection />

      {/* How It Works */}
      <HowItWorks />
    </div>
  );
}
