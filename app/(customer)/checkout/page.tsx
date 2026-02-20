"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { getStripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PaymentForm } from "@/components/customer/payment-form";
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
  const { items, getTotalPrice, clearCart } = useCart();
  const settings = useQuery(api.settings.getSettings);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Form state
  const [deliveryMethod, setDeliveryMethod] = useState<"DELIVERY" | "PICKUP">(
    "DELIVERY",
  );
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

  // Check if cart contains cakes with calendar info
  const hasCakes = () => {
    return items.some(
      (item) => item.deliveryDate || item.cakeTitle || item.cakeNote,
    );
  };

  // Get aggregated calendar info for all cake items in cart
  const getAggregatedCakeCalendarInfo = () => {
    const cakeItems = items.filter(
      (item) => item.deliveryDate || item.cakeTitle || item.cakeNote,
    );

    if (cakeItems.length === 0) return undefined;

    // Return the first cake's calendar info found
    const firstCake = cakeItems[0];
    return {
      deliveryDate: firstCake.deliveryDate || "",
      cakeTitle: firstCake.cakeTitle || "",
      cakeNote: firstCake.cakeNote || "",
    };
  };

  // Cart total and settings are in pounds
  const subtotal = getTotalPrice();
  const freeThreshold = settings?.freeDeliveryThreshold ?? Infinity;
  // No delivery fee for pickup orders
  const deliveryFee =
    deliveryMethod === "PICKUP"
      ? 0
      : subtotal >= freeThreshold
        ? 0
        : (settings?.deliveryFee ?? DEFAULT_DELIVERY_FEE);
  const total = subtotal + deliveryFee;

  // Check if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

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
    // Address is only required for delivery orders
    if (deliveryMethod === "DELIVERY") {
      if (!customerInfo.address.trim()) {
        newErrors.address = "Delivery address is required";
      }
      if (!customerInfo.city.trim()) {
        newErrors.city = "City is required";
      }
      if (!customerInfo.postcode.trim()) {
        newErrors.postcode = "Postcode is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleProceedToPayment = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const orderResponse = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerInfo,
          deliveryMethod,
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price, // In pounds
            flavor: item.flavor,
            // Calendar info for cakes
            deliveryDate: item.deliveryDate,
            cakeTitle: item.cakeTitle,
            cakeNote: item.cakeNote,
          })),
          subtotal, // In pounds
          deliveryFee, // In pounds
          total, // Total in pounds
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error("Order creation failed:", errorData);
        throw new Error(errorData.error || "Failed to create order");
      }

      const orderData = await orderResponse.json();
      setOrderId(orderData.orderId);

      // Create payment intent
      const paymentResponse = await fetch("/api/payment/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.orderId,
          customerEmail: customerInfo.email,
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error("Failed to initialize payment");
      }

      const paymentData = await paymentResponse.json();
      setClientSecret(paymentData.clientSecret);
      setShowPayment(true);
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Failed to process order");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = (successOrderId: string) => {
    clearCart();
    router.push(`/order-confirmation?orderId=${successOrderId}`);
  };

  const handlePaymentError = (error: string) => {
    alert(`Payment failed: ${error}`);
    setShowPayment(false);
    setClientSecret(null);
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

            {/* Delivery Method */}
            <SlideInUp delay={0.15}>
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-honey-gold/10">
                    <Package className="h-5 w-5 text-honey-gold" />
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-charcoal-black">
                    Delivery Method
                  </h2>
                </div>

                <div className="space-y-3">
                  <div
                    onClick={() => setDeliveryMethod("DELIVERY")}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      deliveryMethod === "DELIVERY"
                        ? "border-honey-gold bg-honey-gold/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="DELIVERY"
                        checked={deliveryMethod === "DELIVERY"}
                        onChange={() => setDeliveryMethod("DELIVERY")}
                        className="w-4 h-4 text-honey-gold"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-charcoal-black">
                          Home Delivery
                        </div>
                        <div className="text-sm text-gray-600">
                          We'll deliver to your address{" "}
                          {deliveryFee > 0 &&
                            `(£${deliveryFee.toFixed(2)} fee)`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setDeliveryMethod("PICKUP")}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      deliveryMethod === "PICKUP"
                        ? "border-honey-gold bg-honey-gold/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="PICKUP"
                        checked={deliveryMethod === "PICKUP"}
                        onChange={() => setDeliveryMethod("PICKUP")}
                        className="w-4 h-4 text-honey-gold"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-charcoal-black">
                          Pickup from Store
                        </div>
                        <div className="text-sm text-gray-600">
                          Collect from our location (No delivery fee)
                        </div>
                      </div>
                    </div>
                  </div>

                  {deliveryMethod === "PICKUP" && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Pickup Location:</strong> We'll notify you via
                        SMS and email when your order is ready for pickup.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </SlideInUp>

            {/* Delivery Address - Only show for delivery orders */}
            {deliveryMethod === "DELIVERY" && (
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
                      />{" "}
                    </div>
                  </div>
                </div>
              </SlideInUp>
            )}
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
                        £{(item.price * item.quantity).toFixed(2)}
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

                  {/* Free delivery messages */}
                  {deliveryMethod === "DELIVERY" &&
                    settings?.freeDeliveryThreshold !== undefined &&
                    subtotal < settings.freeDeliveryThreshold && (
                      <div className="pt-2 space-y-2">
                        <p className="text-xs text-gray-600 bg-green-50 p-2.5 rounded-lg">
                          Add £
                          {(settings.freeDeliveryThreshold - subtotal).toFixed(
                            2,
                          )}{" "}
                          more for free delivery!
                        </p>
                        {(settings as any)?.freeDeliveryText && (
                          <p className="text-xs text-gray-600 bg-blue-50 p-2.5 rounded-lg border border-blue-200">
                            {(settings as any).freeDeliveryText.replace(
                              "{amount}",
                              `£${(settings.freeDeliveryThreshold - subtotal).toFixed(2)}`,
                            )}
                          </p>
                        )}
                      </div>
                    )}
                </div>

                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Total</span>
                  <span className="text-honey-gold text-xl">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* Payment Buttons */}
                {!showPayment ? (
                  <div className="space-y-3">
                    <Button
                      size="lg"
                      onClick={handleProceedToPayment}
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

                    <p className="text-xs text-gray-500 text-center mt-4">
                      Supports Apple Pay, Google Pay, and credit cards
                    </p>
                  </div>
                ) : (
                  clientSecret &&
                  orderId && (
                    <div className="mt-6">
                      <Elements
                        stripe={getStripe()}
                        options={{
                          clientSecret,
                          appearance: {
                            theme: "stripe",
                            variables: {
                              colorPrimary: "#e0a81f",
                            },
                          },
                        }}
                      >
                        <PaymentForm
                          orderId={orderId}
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                        />
                      </Elements>
                    </div>
                  )
                )}

                {!showPayment && (
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Your payment information is secure and encrypted
                  </p>
                )}
              </div>
            </SlideInUp>
          </div>
        </div>
      </div>
    </div>
  );
}
