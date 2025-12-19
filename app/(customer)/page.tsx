"use client";

import { useState, useEffect } from "react";
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
  Star,
} from "lucide-react";
import { FadeIn, StaggerChildren } from "@/components/shared/animated";
import type { Product } from "@/types/product";

// Hero Product Highlights
function HeroHighlights() {
  const highlights = [
    {
      title: "Golden. Fluffy. Irresistible.",
      subtitle: "Puff Puff",
      cta: "Grab Puff Puff",
      href: "/shop?category=Snacks",
      image:
        "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=800&q=80",
    },
    {
      title: "Crisp. Bold. Addictive.",
      subtitle: "Chicken Wings",
      cta: "Get Your Wings",
      href: "/shop?category=Proteins",
      image:
        "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&q=80",
    },
    {
      title: "Flavour in Every Bite",
      subtitle: "Mini Pastries",
      cta: "Order Pastries",
      href: "/shop?category=Mini%20Pastries",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    },
    {
      title: "Spiced to Perfection",
      subtitle: "Nigerian Rice",
      cta: "Taste the Rice",
      href: "/shop?category=Rice%201L",
      image:
        "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&q=80",
    },
  ];

  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-soft-cream">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {highlights.map((highlight, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <Link href={highlight.href}>
                <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl aspect-3/4 bg-charcoal-black shadow-md">
                  <Image
                    src={highlight.image}
                    alt={highlight.subtitle}
                    fill
                    className="object-cover opacity-70 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-charcoal-black/90 via-charcoal-black/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 lg:p-6">
                    <p className="text-honey-gold font-semibold text-[10px] sm:text-xs lg:text-sm mb-1 sm:mb-2 uppercase tracking-wider">
                      {highlight.subtitle}
                    </p>
                    <h3 className="text-white font-heading text-sm sm:text-lg lg:text-2xl font-bold mb-2 sm:mb-3 lg:mb-4 leading-tight">
                      {highlight.title}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs sm:text-sm bg-white/10 border-white/20 text-white hover:bg-white hover:text-charcoal-black backdrop-blur-sm py-1.5 sm:py-2"
                    >
                      {highlight.cta}
                    </Button>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// Categories Section
function CategoriesSection() {
  const categories = [
    {
      name: "Nigerian Foods",
      image:
        "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&q=80",
      href: "/shop?category=Nigerian%20Foods",
    },
    {
      name: "Pastries",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
      href: "/shop?category=Pastries",
    },
    {
      name: "Cakes",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
      href: "/shop?category=Cakes",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <FadeIn className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-charcoal-black mb-4">
            Our Menu
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our curated selection of authentic, flavor-packed dishes
          </p>
        </FadeIn>

        <StaggerChildren
          delay={0.1}
          className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto"
        >
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <div className="group relative overflow-hidden rounded-full w-32 h-32 ring-2 ring-honey-gold/20 hover:ring-honey-gold transition-all duration-300">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-charcoal-black/80 to-transparent flex items-end justify-center pb-2 sm:pb-3">
                  <p className="text-white font-semibold text-xs sm:text-sm text-center px-1 sm:px-2">
                    {category.name}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

// Your Favourites (Featured Products)
function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    fetch("/api/products?available=true")
      .then((res) => res.json())
      .then((data) => setProducts(data.slice(0, 6)))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

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
            <Link key={product.id} href={`/shop/${slugify(product.name)}`}>
              <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={product.image}
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
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-heading text-lg sm:text-xl lg:text-2xl font-bold text-honey-gold">
                      {formatPrice(product.price)}
                    </p>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addItem({
                          productId: product.id,
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
          <Link href="/shop">
            <Button
              size="lg"
              className="shadow-lg active:scale-95 text-sm sm:text-base"
            >
              View Full Menu
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
function AboutSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-soft-cream">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-12 max-w-6xl mx-auto">
          <FadeIn className="lg:w-1/2 w-full">
            <div className="relative aspect-4/3 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
                alt="About Honey Foods"
                fill
                className="object-cover"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="lg:w-1/2 w-full">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-charcoal-black mb-4 sm:mb-5 lg:mb-6">
              Welcome to Honey Foods
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-5 lg:mb-6">
              At Honey Foods, we believe that great food should be both a visual
              masterpiece and a flavourful journey. Specialising in authentic
              Nigerian cuisine and premium pastries, we blend the refined art of
              presentation with the vibrant soul of West African flavors.
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-7 lg:mb-8">
              Every dish is crafted with passion, using only the finest
              ingredients and time-honored recipes passed down through
              generations.
            </p>
            <Link href="/about">
              <Button
                size="lg"
                className="active:scale-95 text-sm sm:text-base"
              >
                Find Out More
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// Newsletter Section
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    }, 1000);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-charcoal-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <FadeIn className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 px-4">
            Join the Honey Foods family and enjoy 10% off your next order. Be
            the first to discover new flavours and exclusive treats.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base rounded-full text-charcoal-black focus:outline-none focus:ring-2 focus:ring-honey-gold"
            />
            <Button
              type="submit"
              size="lg"
              disabled={status === "loading"}
              className="rounded-full px-6 sm:px-8 active:scale-95 text-sm sm:text-base"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>

          {status === "success" && (
            <p className="mt-4 text-honey-gold font-semibold">
              Thanks for subscribing! Check your email for your discount code.
            </p>
          )}
        </FadeIn>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Main Hero */}
      <section className="relative bg-linear-to-br from-honey-gold/10 via-soft-cream to-warm-orange/10 py-16 sm:py-20 lg:py-24 xl:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <FadeIn className="text-center max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-4 sm:mb-6 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
            >
              Order before Thursday 3pm for weekend delivery
            </Badge>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-charcoal-black mb-4 sm:mb-5 lg:mb-6 leading-tight px-2">
              Authentic Flavours.
              <span className="text-honey-gold block mt-1 sm:mt-2">
                Delivered Fresh.
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-6 sm:mb-8 lg:mb-10 leading-relaxed px-4">
              Premium Nigerian cuisine and pastries crafted with love, delivered
              to your doorstep
            </p>
            <Link href="/shop">
              <Button
                size="lg"
                className="text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-4 sm:py-5 lg:py-6 shadow-xl active:scale-95"
              >
                Explore Our Menu
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Hero Product Highlights */}
      <HeroHighlights />

      {/* Categories */}
      <CategoriesSection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* How It Works */}
      <HowItWorks />

      {/* About Section */}
      <AboutSection />

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}
