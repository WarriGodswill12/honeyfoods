"use client";

import { useCart } from "@/store/cart-store";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Trash2, Plus, Minus, ShoppingBag, Home } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/constants";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCart();
  const settings = useQuery(api.settings.getSettings);

  // Cart total and settings are in pounds
  const subtotal = getTotalPrice();
  const freeThreshold = settings?.freeDeliveryThreshold ?? Infinity;
  const deliveryFee =
    subtotal >= freeThreshold
      ? 0
      : (settings?.deliveryFee ?? DEFAULT_DELIVERY_FEE);
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 sm:mb-8 flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-soft-cream">
            <ShoppingBag className="h-14 w-14 sm:h-16 sm:w-16 text-gray-400" />
          </div>
          <h1 className="font-heading mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold text-charcoal-black">
            Your Cart is Empty
          </h1>
          <p className="mb-6 sm:mb-8 text-sm sm:text-base text-gray-600 px-4">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link href="/shop">
            <Button size="lg" className="active:scale-95">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList className="flex items-center">
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="flex items-center hover:text-honey-gold transition-colors"
              >
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="flex items-center" />
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/shop"
                className="flex items-center hover:text-honey-gold transition-colors"
              >
                Shop
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="flex items-center" />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center font-semibold text-honey-gold">
                Cart
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="font-heading mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold text-charcoal-black">
        Shopping Cart
      </h1>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-3 sm:space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-3 sm:gap-4 rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 lg:p-5 shadow-sm"
              >
                {/* Product Image */}
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-charcoal-black line-clamp-2">
                      {item.name}
                    </h3>
                    {item.flavor && (
                      <p className="mt-0.5 text-xs sm:text-sm text-gray-600">
                        Flavor:{" "}
                        <span className="font-medium">{item.flavor}</span>
                      </p>
                    )}
                    {item.note && (
                      <p className="mt-0.5 text-xs text-gray-500 italic line-clamp-1">
                        Note: {item.note}
                      </p>
                    )}
                    <p className="mt-1 text-base sm:text-lg font-bold text-warm-orange">
                      £{item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 active:scale-95"
                      >
                        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <span className="w-10 sm:w-12 text-center font-semibold text-sm sm:text-base">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 active:scale-95"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-500 hover:text-red-700 p-2 active:scale-95"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-6 lg:p-8 shadow-sm">
            <h2 className="font-heading mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-charcoal-black">
              Order Summary
            </h2>

            <div className="space-y-3 sm:space-y-4 pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-gray-100">
              <div className="flex justify-between text-sm sm:text-base text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base text-gray-600">
                <span>Delivery Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-semibold">FREE</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 flex justify-between text-base sm:text-lg font-bold">
              <span>Total</span>
              <span className="text-warm-orange text-lg sm:text-xl">
                {formatPrice(total)}
              </span>
            </div>

            {settings?.freeDeliveryThreshold !== undefined &&
              subtotal < settings.freeDeliveryThreshold && (
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                  {(settings as any)?.freeDeliveryText
                    ? (settings as any).freeDeliveryText.replace(
                        "{amount}",
                        `£${(settings.freeDeliveryThreshold - subtotal).toFixed(2)}`,
                      )
                    : `Add £${(settings.freeDeliveryThreshold - subtotal).toFixed(2)} more for free delivery!`}
                </p>
              )}

            <Link href="/checkout" className="mt-4 sm:mt-6 block">
              <Button size="lg" className="w-full active:scale-[0.98]">
                Proceed to Checkout
              </Button>
            </Link>

            <Link href="/shop" className="mt-3 block">
              <Button
                variant="outline"
                size="lg"
                className="w-full active:scale-[0.98]"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
