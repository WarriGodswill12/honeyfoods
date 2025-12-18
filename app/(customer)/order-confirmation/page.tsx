"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Package,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  ArrowRight,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";

interface OrderDetails {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
    note?: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  createdAt: string;
  estimatedDelivery: string;
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    // TODO: Replace with actual API call to fetch order details
    // For now, using demo data
    const fetchOrder = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Demo order data
        const demoOrder: OrderDetails = {
          orderId: orderId,
          customerName: "Demo Customer",
          email: "customer@example.com",
          phone: "+44 7123 456789",
          address: "123 Demo Street",
          city: "London",
          postcode: "SW1A 1AA",
          items: [
            {
              id: "1",
              name: "Sample Product",
              price: 29.99,
              quantity: 2,
              imageUrl:
                "https://images.unsplash.com/photo-1586201375761-83865001e31c",
              note: "Please handle with care",
            },
          ],
          subtotal: 59.98,
          deliveryFee: 5.0,
          total: 64.98,
          status: "confirmed",
          createdAt: new Date().toISOString(),
          estimatedDelivery: new Date(
            Date.now() + 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
        };

        setOrder(demoOrder);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  const handleWhatsAppContact = () => {
    const phone = "447123456789"; // TODO: Replace with actual business phone
    const message = encodeURIComponent(
      `Hi, I have a question about my order ${orderId}`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-honey-gold"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-charcoal-black mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn't find the order you're looking for.
          </p>
          <Link href="/">
            <Button>
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-charcoal-black mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you for your order. We've received your payment and will start
            preparing your items.
          </p>
          <div className="bg-honey-gold/10 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-xl md:text-2xl font-bold text-honey-gold">
              {order.orderId}
            </p>
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
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Order Date</span>
              <span className="font-medium text-charcoal-black">
                {formatDate(order.createdAt)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Estimated Delivery</span>
              <span className="font-medium text-honey-gold">
                {formatDate(order.estimatedDelivery)}
              </span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-xl font-bold text-charcoal-black mb-4">
            Order Items
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-4 border-b last:border-b-0"
              >
                <div className="relative w-20 h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-charcoal-black truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                  {item.note && (
                    <p className="text-sm text-gray-500 italic mt-1">
                      Note: {item.note}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-medium text-charcoal-black">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatPrice(item.price)} each
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
            <div>
              <p className="text-sm text-gray-600 flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                Email
              </p>
              <p className="font-medium text-charcoal-black">{order.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                Phone
              </p>
              <p className="font-medium text-charcoal-black">{order.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Delivery Address</p>
              <p className="font-medium text-charcoal-black">
                {order.address}
                <br />
                {order.city}, {order.postcode}
              </p>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-honey-gold/10 rounded-lg p-6 md:p-8 mb-6">
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
                  Order Confirmation Email
                </p>
                <p className="text-sm text-gray-600">
                  We've sent a confirmation email to {order.email} with your
                  order details.
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
            If you have any questions about your order, feel free to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleWhatsAppContact}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Us on WhatsApp
            </Button>
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
