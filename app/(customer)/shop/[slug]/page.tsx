"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/store/cart-store";
import { formatPrice, slugify } from "@/lib/utils";
import {
  ShoppingCart,
  ArrowLeft,
  Plus,
  Minus,
  Package,
  Ruler,
  Home,
} from "lucide-react";
import { FadeIn, SlideInUp } from "@/components/shared/animated";
import type { Product } from "@/types/product";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [sizeVariations, setSizeVariations] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [params.slug]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      // Fetch all products
      const response = await fetch("/api/products?available=true");
      if (!response.ok) throw new Error("Failed to fetch products");
      const products = await response.json();

      // Find product by slug
      const foundProduct = products.find(
        (p: Product) => slugify(p.name) === params.slug
      );

      if (!foundProduct) {
        router.push("/shop");
        return;
      }

      setProduct(foundProduct);
      setAllProducts(products);

      // Extract base name (remove size info)
      const getBaseName = (name: string) => {
        return name
          .replace(/\s*-\s*(1|2)\s*Litre.*$/i, "")
          .replace(/\s*-\s*(1|2)\s*L.*$/i, "")
          .replace(/\s*\((Small|Medium|Large|Mini|Regular)\)$/i, "")
          .replace(/\s*(Small|Medium|Large|Mini|Regular)$/i, "")
          .replace(/\s*-\s*\d+\s*(?:inch|inches|").*$/i, "")
          .replace(/\s*-\s*\d+\s*(?:Pieces?|pcs)$/i, "")
          .trim();
      };

      const baseName = getBaseName(foundProduct.name);

      // Find size variations (products with same base name)
      const variations = products.filter(
        (p: Product) => getBaseName(p.name) === baseName
      );
      setSizeVariations(variations);

      // Get related products (same category, excluding current and variations)
      const variationIds = variations.map((v: Product) => v.id);
      const related = products
        .filter(
          (p: Product) =>
            p.category === foundProduct.category && !variationIds.includes(p.id)
        )
        .slice(0, 3);
      setRelatedProducts(related);
    } catch (error) {
      console.error("Error:", error);
      router.push("/shop");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    setIsAddingToCart(true);

    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.image,
        note: customNote || undefined,
      },
      quantity
    );

    setTimeout(() => {
      setIsAddingToCart(false);
      // Show success feedback
    }, 300);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleSizeChange = (productId: string) => {
    const selectedProduct = sizeVariations.find(
      (p) => p.id.toString() === productId
    );
    if (selectedProduct) {
      router.push(`/shop/${slugify(selectedProduct.name)}`);
    }
  };

  // Extract size from product name
  const extractSize = (name: string): string | null => {
    const sizePatterns = [
      /\b(Small|Medium|Large)\b/i,
      /\b(\d+\s*(?:L|Litre|Litres?))\b/i,
      /\b(Mini)\b/i,
      /\b(\d+\s*(?:inch|inches|"))\b/i,
      /\b(\d+\s*(?:Pieces?|pcs))\b/i,
    ];

    for (const pattern of sizePatterns) {
      const match = name.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const productSize = product ? extractSize(product.name) : null;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!product) {
    return null;
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
              <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
            </BreadcrumbItem>
            {product.category && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/shop?category=${encodeURIComponent(
                      product.category
                    )}`}
                  >
                    {product.category}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-honey-gold">
                {product.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Back Button */}
      <FadeIn>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-honey-gold transition-colors mb-6 sm:mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>
      </FadeIn>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Product Image Carousel */}
        <FadeIn>
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                <CarouselItem>
                  <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-soft-cream shadow-lg">
                    <Image
                      src={product.image || "/images/placeholder-product.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                    {product.featured && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="primary" className="text-sm">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              </CarouselContent>
              {/* Navigation will appear when multiple images are added */}
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>
        </FadeIn>

        {/* Product Info */}
        <SlideInUp delay={0.2}>
          <div className="flex flex-col h-full">
            <div className="mb-4">
              <Badge variant="secondary" className="mb-3">
                {product.category}
              </Badge>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-black mb-4">
                {product.name}
              </h1>
              <p className="text-3xl sm:text-4xl font-bold text-honey-gold mb-6">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Size Selector */}
            {sizeVariations.length > 1 ? (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <label className="block text-sm font-semibold text-charcoal-black mb-3">
                  <Ruler className="inline h-4 w-4 text-honey-gold mr-2" />
                  Select Size
                </label>
                <Select
                  value={product.id.toString()}
                  onValueChange={handleSizeChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeVariations.map((variation) => {
                      const size = extractSize(variation.name);
                      return (
                        <SelectItem
                          key={variation.id}
                          value={variation.id.toString()}
                        >
                          {size || variation.name} -{" "}
                          {formatPrice(variation.price)}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            ) : productSize ? (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-gray-700">
                  <Ruler className="h-5 w-5 text-honey-gold" />
                  <span className="font-semibold">Size:</span>
                  <span className="text-lg">{productSize}</span>
                </div>
              </div>
            ) : null}

            {/* Description */}
            {product.description && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-lg text-charcoal-black mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Product Details */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="font-semibold text-lg text-charcoal-black mb-3">
                Product Details
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-honey-gold" />
                  <span>
                    Category:{" "}
                    <strong className="text-charcoal-black">
                      {product.category}
                    </strong>
                  </span>
                </div>
                {productSize && (
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-honey-gold" />
                    <span>
                      Size/Quantity:{" "}
                      <strong className="text-charcoal-black">
                        {productSize}
                      </strong>
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-honey-gold" />
                  <span>
                    Price per unit:{" "}
                    <strong className="text-charcoal-black">
                      {formatPrice(product.price)}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-charcoal-black mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={decrementQuantity}
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 hover:border-honey-gold hover:bg-honey-gold/5 transition-all active:scale-95"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="text-2xl font-bold text-charcoal-black w-16 text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 hover:border-honey-gold hover:bg-honey-gold/5 transition-all active:scale-95"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Custom Note */}
            <div className="mb-6">
              <label
                htmlFor="note"
                className="block text-sm font-semibold text-charcoal-black mb-3"
              >
                Special Instructions (Optional)
              </label>
              <textarea
                id="note"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="E.g., Happy Birthday message for cake, dietary preferences, etc."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey-gold text-sm resize-none"
              />
            </div>

            {/* Add to Cart Button */}
            <div className="mt-auto space-y-3">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full text-base sm:text-lg py-6 active:scale-[0.98]"
              >
                {isAddingToCart ? (
                  <>
                    <LoadingSpinner className="mr-2" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add {quantity} to Cart -{" "}
                    {formatPrice(product.price * quantity)}
                  </>
                )}
              </Button>
              <p className="text-center text-sm text-gray-500">
                Free delivery on orders above £50
              </p>
            </div>
          </div>
        </SlideInUp>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 lg:mt-20">
          <FadeIn>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal-black mb-8 text-center">
              You May Also Like
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {relatedProducts.map((relatedProduct, index) => (
              <FadeIn key={relatedProduct.id} delay={index * 0.1}>
                <Link href={`/shop/${slugify(relatedProduct.name)}`}>
                  <div className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={
                          relatedProduct.image ||
                          "/images/placeholder-product.svg"
                        }
                        alt={relatedProduct.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 sm:p-5">
                      <Badge
                        variant="secondary"
                        className="mb-2 text-[10px] sm:text-xs"
                      >
                        {relatedProduct.category}
                      </Badge>
                      <h3 className="font-heading text-base sm:text-lg font-bold text-charcoal-black mb-2 line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-lg sm:text-xl font-bold text-honey-gold">
                        {formatPrice(relatedProduct.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
