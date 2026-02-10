"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Package,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Home,
  Download,
  Printer,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";
import { siteConfig } from "@/config/site";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  image: string;
  selectedFlavor?: string;
}

interface OrderDetails {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  deliveryAddress: string;
  customNote: string | null;
  orderItems: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  createdAt: string;
  updatedAt: string;
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const paymentIntent = searchParams.get("payment_intent");
  const paymentIntentClientSecret = searchParams.get(
    "payment_intent_client_secret",
  );
  const redirectStatus = searchParams.get("redirect_status");

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    // Check if payment was cancelled or failed
    if (redirectStatus === "failed") {
      setError("Payment was cancelled or failed. Please try again.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${orderId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Order not found");
          } else {
            setError("Failed to load order details");
          }
          return;
        }

        const data = await response.json();

        // Verify payment status matches order
        if (
          data.paymentStatus !== "paid" &&
          data.paymentStatus !== "succeeded"
        ) {
          setError(
            "Payment not completed. Please complete your payment to view order details.",
          );
          return;
        }

        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, redirectStatus, router]);

  const handlePrintReceipt = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-honey-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    const isCancelledPayment =
      error?.includes("cancelled") || error?.includes("not completed");

    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div
            className={`${
              isCancelledPayment ? "bg-yellow-100" : "bg-red-100"
            } rounded-full p-4 inline-block mb-4`}
          >
            <Package
              className={`h-12 w-12 ${
                isCancelledPayment ? "text-yellow-600" : "text-red-600"
              }`}
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-charcoal-black mb-4">
            {isCancelledPayment
              ? "Payment Required"
              : error || "Order Not Found"}
          </h1>
          <p className="text-gray-600 mb-6">
            {isCancelledPayment
              ? "Your order has been created but payment was not completed. Please complete the payment to proceed with your order."
              : "We couldn't find the order you're looking for. Please check your order number or contact support."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {isCancelledPayment && orderId && (
              <Link href={`/checkout?orderId=${orderId}`}>
                <Button className="w-full sm:w-auto">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Complete Payment
                </Button>
              </Link>
            )}
            <Link href="/">
              <Button
                variant={isCancelledPayment ? "outline" : "default"}
                className="w-full sm:w-auto"
              >
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Print Styles */}
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-area,
            .print-area * {
              visibility: visible;
            }
            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>

        <div className="print-area">
          {/* Success Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-charcoal-black mb-2">
              Thank You for Your Order!
            </h1>
            <p className="text-gray-600 mb-2">
              Your payment has been processed successfully.
            </p>
            {order.customerEmail && (
              <p className="text-gray-600 mb-4">
                We have sent your full order receipt to{" "}
                <span className="font-semibold text-honey-gold">
                  {order.customerEmail}
                </span>
              </p>
            )}
            <div className="bg-honey-gold/10 rounded-lg p-4 inline-block">
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="text-xl md:text-2xl font-bold text-honey-gold">
                {order.orderNumber}
              </p>
            </div>

            {/* Print/Download Button */}
            <div className="mt-6 no-print">
              <Button
                onClick={handlePrintReceipt}
                variant="outline"
                className="gap-2"
              >
                <Printer className="w-4 h-4" />
                Print Receipt
              </Button>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
            <h2 className="text-xl font-bold text-charcoal-black mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-honey-gold" />
              Order Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {order.status.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.paymentStatus === "PAID"
                      ? "bg-green-100 text-green-800"
                      : order.paymentStatus === "PENDING"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Order Date</span>
                <span className="font-medium text-charcoal-black">
                  {formatDate(new Date(order.createdAt))}
                </span>
              </div>
              {order.paymentMethod && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium text-charcoal-black capitalize">
                    {order.paymentMethod}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
            <h2 className="text-xl font-bold text-charcoal-black mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b last:border-b-0"
                >
                  <div className="relative w-20 h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-charcoal-black truncate">
                      {item.name}
                    </h3>
                    {item.selectedFlavor && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        Flavor: {item.selectedFlavor}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-medium text-charcoal-black">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>{formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-charcoal-black pt-2 border-t">
                <span>Total Paid</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
            <h2 className="text-xl font-bold text-charcoal-black mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-honey-gold" />
              Delivery Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-charcoal-black">
                  {order.customerName}
                </p>
              </div>
              {order.customerEmail && (
                <div>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </p>
                  <p className="font-medium text-charcoal-black">
                    {order.customerEmail}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  Phone
                </p>
                <p className="font-medium text-charcoal-black">
                  {order.customerPhone}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Delivery Address</p>
                <p className="font-medium text-charcoal-black">
                  {order.deliveryAddress}
                </p>
              </div>
              {order.customNote && (
                <div>
                  <p className="text-sm text-gray-600">Delivery Notes</p>
                  <p className="font-medium text-charcoal-black italic">
                    {order.customNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-honey-gold/10 rounded-lg p-6 md:p-8 mb-6 no-print">
          <h2 className="text-xl font-bold text-charcoal-black mb-4">
            What's Next?
          </h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="bg-honey-gold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <div className="ml-3">
                <p className="font-medium text-charcoal-black">
                  Order Confirmation
                </p>
                <p className="text-sm text-gray-600">
                  {order.customerEmail
                    ? `We've sent a confirmation email to ${order.customerEmail} with your order details.`
                    : "You'll receive an SMS confirmation shortly with your order details."}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-honey-gold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <div className="ml-3">
                <p className="font-medium text-charcoal-black">
                  Order Preparation
                </p>
                <p className="text-sm text-gray-600">
                  Our team will carefully prepare your order for delivery.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-honey-gold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <div className="ml-3">
                <p className="font-medium text-charcoal-black">
                  Delivery Updates
                </p>
                <p className="text-sm text-gray-600">
                  We'll keep you updated via email and SMS about your delivery
                  status.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-honey-gold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">4</span>
              </div>
              <div className="ml-3">
                <p className="font-medium text-charcoal-black">
                  Enjoy Your Food
                </p>
                <p className="text-sm text-gray-600">
                  Your delicious African and Caribbean food will arrive fresh
                  and ready to enjoy!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-charcoal-black mb-4">
            Need Help?
          </h2>
          <p className="text-gray-600 mb-6">
            If you have any questions about your order, feel free to contact us
            at {siteConfig.contact.phone} or {siteConfig.contact.email}.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/contact" className="flex-1">
              <Button className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Contact Us
              </Button>
            </Link>
            <Link href="/shop" className="flex-1">
              <Button variant="outline" className="w-full">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <Link href="/" className="block mt-3">
            <Button variant="ghost" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
          </Link>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Thank you for choosing Honey Foods. We appreciate your business!
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-honey-gold"></div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
