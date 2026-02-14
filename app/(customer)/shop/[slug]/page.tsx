"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Calendar,
} from "lucide-react";
import { FadeIn, SlideInUp } from "@/components/shared/animated";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const allProducts = useQuery(api.products.getProducts, { available: true });
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Calendar state for cakes
  const [cakeCalendarInfo, setCakeCalendarInfo] = useState({
    deliveryDate: "",
    cakeTitle: "",
    cakeNote: "",
  });

  // Get available products
  const products = useMemo(() => {
    if (!allProducts) return [];
    return allProducts.filter((p) => p.available);
  }, [allProducts]);

  // Find current product by slug
  const product = useMemo(() => {
    return products.find((p) => slugify(p.name) === params.slug) || null;
  }, [products, params.slug]);

  // Get related products (same category, exclude current)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p._id !== product._id)
      .slice(0, 4);
  }, [products, product]);

  // Get size variations (similar name pattern)
  const sizeVariations = useMemo(() => {
    if (!product) return [];
    const baseName = product.name
      .replace(/\s*(small|medium|large|mini|regular|jumbo)\s*/gi, "")
      .trim();
    return products.filter(
      (p) =>
        p._id !== product._id &&
        p.name.toLowerCase().includes(baseName.toLowerCase()),
    );
  }, [products, product]);

  useEffect(() => {
    if (allProducts && !product) {
      router.push("/shop");
    }
    // Set default flavor when product changes or loads
    if (product?.flavors && product.flavors.length > 0 && !selectedFlavor) {
      setSelectedFlavor(product.flavors[0]);
    }
  }, [allProducts, product, router, selectedFlavor]);

  const handleAddToCart = () => {
    if (!product) return;

    // Check if flavor is required but not selected
    if (product.flavors && product.flavors.length > 0 && !selectedFlavor) {
      alert("Please select a flavor");
      return;
    }

    setIsAddingToCart(true);

    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.price, // Now in pounds
      imageUrl: product.image,
      note: customNote || undefined,
      flavor: selectedFlavor || undefined,
      // Calendar info for cakes
      deliveryDate:
        product.category?.toLowerCase() === "cakes"
          ? cakeCalendarInfo.deliveryDate || undefined
          : undefined,
      cakeTitle:
        product.category?.toLowerCase() === "cakes"
          ? cakeCalendarInfo.cakeTitle || undefined
          : undefined,
      cakeNote:
        product.category?.toLowerCase() === "cakes"
          ? cakeCalendarInfo.cakeNote || undefined
          : undefined,
    };

    addItem(cartItem, quantity);

    setTimeout(() => {
      setIsAddingToCart(false);
      toast.success("Added to cart", {
        description: `${product.name} ${selectedFlavor ? `(${selectedFlavor})` : ""} x${quantity}`,
      });
    }, 300);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleSizeChange = (productId: string) => {
    const selectedProduct = sizeVariations.find(
      (p) => p._id.toString() === productId,
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

  if (allProducts === undefined) {
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
                      product.category,
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
                {/* Show all images if product has multiple images, otherwise show primary image */}
                {product.images && product.images.length > 0 ? (
                  product.images.map((img, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-soft-cream shadow-lg">
                        <Image
                          src={img || "/images/placeholder-product.svg"}
                          alt={`${product.name} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                          priority={index === 0}
                        />
                        {product.featured && index === 0 && (
                          <div className="absolute top-4 right-4">
                            <Badge variant="primary" className="text-sm">
                              Featured
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CarouselItem>
                  ))
                ) : (
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
                )}
              </CarouselContent>
              {/* Show navigation only if there are multiple images */}
              {((product.images && product.images.length > 1) || false) && (
                <>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </>
              )}
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
                £{product.price.toFixed(2)}
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
                  value={product._id.toString()}
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
                          key={variation._id}
                          value={variation._id.toString()}
                        >
                          {size || variation.name} - £
                          {variation.price.toFixed(2)}
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
                      £{product.price.toFixed(2)}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Flavor Selector */}
            {product.flavors && product.flavors.length > 0 && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <label className="block text-sm font-semibold text-charcoal-black mb-3">
                  <Package className="inline h-4 w-4 text-honey-gold mr-2" />
                  Select Flavor <span className="text-red-500">*</span>
                </label>
                <Select
                  value={selectedFlavor}
                  onValueChange={setSelectedFlavor}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a flavor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {product.flavors.map((flavor) => (
                      <SelectItem key={flavor} value={flavor}>
                        {flavor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Calendar Section for Cakes */}
            {product.category?.toLowerCase() === "cakes" && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warm-orange/10">
                    <Calendar className="h-4 w-4 text-warm-orange" />
                  </div>
                  <h3 className="font-semibold text-lg text-charcoal-black">
                    Cake Delivery Schedule (Optional)
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="deliveryDate"
                      className="block text-sm font-semibold text-charcoal-black mb-2"
                    >
                      Preferred Delivery Date
                    </label>
                    <Input
                      id="deliveryDate"
                      name="deliveryDate"
                      type="date"
                      value={cakeCalendarInfo.deliveryDate}
                      onChange={(e) =>
                        setCakeCalendarInfo({
                          ...cakeCalendarInfo,
                          deliveryDate: e.target.value,
                        })
                      }
                      min={new Date().toISOString().split("T")[0]}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave blank for standard delivery timing
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="cakeTitle"
                      className="block text-sm font-semibold text-charcoal-black mb-2"
                    >
                      Event/Occasion Title
                    </label>
                    <Input
                      id="cakeTitle"
                      name="cakeTitle"
                      type="text"
                      placeholder="e.g., John's Birthday, Anniversary, Wedding"
                      value={cakeCalendarInfo.cakeTitle}
                      onChange={(e) =>
                        setCakeCalendarInfo({
                          ...cakeCalendarInfo,
                          cakeTitle: e.target.value,
                        })
                      }
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cakeNote"
                      className="block text-sm font-semibold text-charcoal-black mb-2"
                    >
                      Special Instructions for Cake
                    </label>
                    <Textarea
                      id="cakeNote"
                      name="cakeNote"
                      placeholder="e.g., Happy Birthday message, dietary requirements, decoration requests"
                      rows={3}
                      value={cakeCalendarInfo.cakeNote}
                      onChange={(e) =>
                        setCakeCalendarInfo({
                          ...cakeCalendarInfo,
                          cakeNote: e.target.value,
                        })
                      }
                      maxLength={200}
                    />
                  </div>
                </div>
              </div>
            )}

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
                    Add {quantity} to Cart - £
                    {(product.price * quantity).toFixed(2)}
                  </>
                )}
              </Button>
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
              <FadeIn key={relatedProduct._id} delay={index * 0.1}>
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
                        £{relatedProduct.price.toFixed(2)}
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
