"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/store/cart-store";
import { formatPrice, slugify } from "@/lib/utils";
import { ShoppingCart, Search, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import {
  FadeIn,
  SlideInUp,
  StaggerChildren,
} from "@/components/shared/animated";

function ShopPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { addItem } = useCart();

  // Read category from URL params on mount
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products?available=true");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique categories
  const categories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
  ];

  // Filter products
  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, products]);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.image,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">Shop</BreadcrumbPage>
            </BreadcrumbItem>
            {selectedCategory && selectedCategory !== "all" && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold text-honey-gold">
                    {selectedCategory}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <FadeIn>
        <div className="mb-8 sm:mb-10 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal-black mb-3 sm:mb-4">
            Our Products
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Browse our delicious selection of freshly made pastries and food
            items
          </p>
        </div>
      </FadeIn>

      {/* Search and Filters */}
      <SlideInUp delay={0.1}>
        <div className="mb-6 sm:mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md mx-auto px-2">
            <Search className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5 text-sm sm:text-base bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-honey-gold shadow-sm"
            />
          </div>

          {/* Category Filter Dropdown */}
          <div className="flex justify-center px-2">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-70 rounded-full border-gray-200 focus:ring-2 focus:ring-honey-gold">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories
                  .filter((cat) => cat !== "all")
                  .map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-center text-sm text-gray-600">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"} found
          </p>
        </div>
      </SlideInUp>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <SlideInUp delay={0.2}>
          <div className="mt-16 text-center">
            <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-soft-cream">
              <span className="text-7xl">🍰</span>
            </div>
            <h3 className="font-heading text-2xl font-bold text-charcoal-black mb-2">
              {searchQuery || selectedCategory !== "all"
                ? "No Products Found"
                : "Products Coming Soon"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search or filters"
                : "We're preparing something delicious for you. Check back soon!"}
            </p>
            {(searchQuery || selectedCategory !== "all") && (
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </SlideInUp>
      ) : (
        <StaggerChildren>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-2xl sm:rounded-3xl bg-white transition-all hover:shadow-lg shadow-sm"
              >
                <Link href={`/shop/${slugify(product.name)}`} className="block">
                  <div className="relative aspect-square bg-soft-cream">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/placeholder-product.jpg";
                      }}
                    />
                    {product.featured && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="primary">Featured</Badge>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4 sm:p-5 lg:p-6">
                  <Link href={`/shop/${slugify(product.name)}`}>
                    <div className="mb-2">
                      <Badge
                        variant="secondary"
                        className="text-[10px] sm:text-xs"
                      >
                        {product.category}
                      </Badge>
                    </div>
                    <h3 className="font-heading text-base sm:text-lg lg:text-xl font-bold text-charcoal-black mb-2 line-clamp-2 group-hover:text-honey-gold transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  </Link>

                  <div className="flex items-center justify-between gap-2">
                    <Link href={`/shop/${slugify(product.name)}`}>
                      <p className="font-heading text-lg sm:text-xl lg:text-2xl font-bold text-honey-gold cursor-pointer hover:text-warm-orange transition-colors">
                        {formatPrice(product.price)}
                      </p>
                    </Link>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="shrink-0 active:scale-95"
                    >
                      <ShoppingCart className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Add</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </StaggerChildren>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <ShopPageContent />
    </Suspense>
  );
}
