"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { DEFAULT_DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/constants";
import {
  ShoppingBag,
  CreditCard,
  Package,
  MapPin,
  User,
  Mail,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn, SlideInUp } from "@/components/shared/animated";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [applePayAvailable, setApplePayAvailable] = useState(false);

  // Form state
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    deliveryNotes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = getTotalPrice();
  const deliveryFee =
    subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DEFAULT_DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  // Check if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  // Check Apple Pay availability
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window as any).ApplePaySession &&
      (window as any).ApplePaySession.canMakePayments()
    ) {
      setApplePayAvailable(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!customerInfo.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!customerInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!customerInfo.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!customerInfo.address.trim()) {
      newErrors.address = "Delivery address is required";
    }
    if (!customerInfo.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!customerInfo.postcode.trim()) {
      newErrors.postcode = "Postcode is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleApplePayClick = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // TODO: Implement Apple Pay payment request when backend is ready
      // For now, simulate payment processing
      console.log("Apple Pay clicked with order:", {
        customerInfo,
        items,
        total,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect to success page (will create this next)
      router.push("/order-confirmation?orderId=DEMO-12345");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualCheckout = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // TODO: Implement manual payment flow when backend is ready
      console.log("Manual checkout with order:", {
        customerInfo,
        items,
        total,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      router.push("/order-confirmation?orderId=DEMO-12345");
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-soft-cream py-6 sm:py-8 lg:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-6 sm:mb-8">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-honey-gold transition-colors"
            >
              ← Back to Cart
            </Link>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-black mb-2">
            Checkout
          </h1>
          <p className="text-gray-600 mb-8">Complete your order</p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Customer Information Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <SlideInUp delay={0.1}>
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-honey-gold/10">
                    <User className="h-5 w-5 text-honey-gold" />
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-charcoal-black">
                    Contact Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-semibold text-charcoal-black mb-2"
                    >
                      Full Name *
                    </label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={customerInfo.fullName}
                      onChange={handleInputChange}
                      className={errors.fullName ? "border-red-500" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-charcoal-black mb-2"
                      >
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-charcoal-black mb-2"
                      >
                        Phone Number *
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+44 XXX XXX XXXX"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SlideInUp>

            {/* Delivery Address */}
            <SlideInUp delay={0.2}>
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-honey-gold/10">
                    <MapPin className="h-5 w-5 text-honey-gold" />
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-charcoal-black">
                    Delivery Address
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-semibold text-charcoal-black mb-2"
                    >
                      Street Address *
                    </label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="123 Main Street"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-semibold text-charcoal-black mb-2"
                      >
                        City *
                      </label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        placeholder="London"
                        value={customerInfo.city}
                        onChange={handleInputChange}
                        className={errors.city ? "border-red-500" : ""}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="postcode"
                        className="block text-sm font-semibold text-charcoal-black mb-2"
                      >
                        Postcode *
                      </label>
                      <Input
                        id="postcode"
                        name="postcode"
                        type="text"
                        placeholder="SW1A 1AA"
                        value={customerInfo.postcode}
                        onChange={handleInputChange}
                        className={errors.postcode ? "border-red-500" : ""}
                      />
                      {errors.postcode && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.postcode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="deliveryNotes"
                      className="block text-sm font-semibold text-charcoal-black mb-2"
                    >
                      Delivery Notes (Optional)
                    </label>
                    <Textarea
                      id="deliveryNotes"
                      name="deliveryNotes"
                      placeholder="e.g., Ring doorbell, leave at reception, etc."
                      rows={3}
                      value={customerInfo.deliveryNotes}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </SlideInUp>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <SlideInUp delay={0.3}>
              <div className="sticky top-20 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-honey-gold/10">
                    <ShoppingBag className="h-5 w-5 text-honey-gold" />
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-charcoal-black">
                    Order Summary
                  </h2>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-charcoal-black line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Qty: {item.quantity}
                        </p>
                        {item.note && (
                          <p className="text-xs text-gray-500 italic mt-1 line-clamp-1">
                            Note: {item.note}
                          </p>
                        )}
                      </div>
                      <p className="text-sm font-bold text-honey-gold shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">
                      {deliveryFee === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        formatPrice(deliveryFee)
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Total</span>
                  <span className="text-honey-gold text-xl">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* Payment Buttons */}
                <div className="space-y-3">
                  {applePayAvailable && (
                    <Button
                      size="lg"
                      onClick={handleApplePayClick}
                      disabled={isProcessing}
                      className="w-full bg-black hover:bg-gray-800 text-white"
                    >
                      {isProcessing ? (
                        <LoadingSpinner className="mr-2" />
                      ) : (
                        <svg
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                        </svg>
                      )}
                      {isProcessing ? "Processing..." : "Pay with Apple Pay"}
                    </Button>
                  )}

                  <Button
                    size="lg"
                    onClick={handleManualCheckout}
                    disabled={isProcessing}
                    className="w-full active:scale-[0.98]"
                  >
                    {isProcessing ? (
                      <LoadingSpinner className="mr-2" />
                    ) : (
                      <CreditCard className="h-5 w-5 mr-2" />
                    )}
                    {isProcessing ? "Processing..." : "Continue to Payment"}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Your payment information is secure and encrypted
                </p>
              </div>
            </SlideInUp>
          </div>
        </div>
      </div>
    </div>
  );
}
