"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Package,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Loader2,
  StickyNote,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  image: string;
  selectedFlavor?: string;
  // Calendar fields for cakes
  deliveryDate?: string;
  cakeTitle?: string;
  cakeNote?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  deliveryMethod?: "DELIVERY" | "PICKUP";
  deliveryAddress: string;
  customNote: string | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
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
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Failed to load order details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!order) return;

    try {
      setIsUpdating(true);
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
      } else {
        alert("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkReadyForPickup = async () => {
    if (!order) return;

    try {
      setIsUpdating(true);
      const response = await fetch(`/api/orders/${orderId}/mark-ready`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh order data
        await fetchOrder();
        alert("Customer has been notified that the order is ready for pickup!");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to mark order as ready");
      }
    } catch (error) {
      console.error("Error marking order ready:", error);
      alert("Failed to mark order as ready");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: "Pending", className: "bg-orange-100 text-orange-800" },
      CONFIRMED: { label: "Confirmed", className: "bg-blue-100 text-blue-800" },
      PREPARING: {
        label: "Preparing",
        className: "bg-purple-100 text-purple-800",
      },
      OUT_FOR_DELIVERY: {
        label: "Out for Delivery",
        className: "bg-indigo-100 text-indigo-800",
      },
      DELIVERED: {
        label: "Delivered",
        className: "bg-green-100 text-green-800",
      },
      READY_FOR_PICKUP: {
        label: "Ready for Pickup",
        className: "bg-teal-100 text-teal-800",
      },
      PICKED_UP: {
        label: "Picked Up",
        className: "bg-green-100 text-green-800",
      },
      CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      className: "bg-gray-100 text-gray-800",
    };

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-honey-gold" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold text-charcoal-black mb-2">
            {error || "Order Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            The order you're looking for doesn't exist.
          </p>
          <Link href="/admin/orders">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-charcoal-black">
              Order {order.orderNumber}
            </h1>
            <p className="text-gray-600 mt-1">
              Placed on {formatDate(new Date(order.createdAt))}
            </p>
          </div>
        </div>
        {getStatusBadge(order.status)}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-charcoal-black mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-honey-gold" />
              Order Items ({order.orderItems.length}{" "}
              {order.orderItems.length === 1 ? "item" : "items"})
            </h2>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                      Product
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">
                      Unit Price
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">
                      Quantity
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-4 px-2">
                        <div className="flex gap-3 items-center">
                          <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-charcoal-black">
                              {item.name}
                            </h3>
                            {item.selectedFlavor && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                Flavor: {item.selectedFlavor}
                              </p>
                            )}
                            {/* Calendar info for this cake item */}
                            {(item.deliveryDate ||
                              item.cakeTitle ||
                              item.cakeNote) && (
                              <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-md">
                                <p className="text-xs font-semibold text-orange-800 flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Cake Details
                                </p>
                                {item.deliveryDate && (
                                  <p className="text-xs text-orange-700 mt-1">
                                    <strong>Delivery Date:</strong>{" "}
                                    {new Date(
                                      item.deliveryDate + "T00:00:00",
                                    ).toLocaleDateString("en-GB", {
                                      weekday: "short",
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </p>
                                )}
                                {item.cakeTitle && (
                                  <p className="text-xs text-orange-700 mt-1">
                                    <strong>Event:</strong> {item.cakeTitle}
                                  </p>
                                )}
                                {item.cakeNote && (
                                  <p className="text-xs text-orange-700 mt-1">
                                    <strong>Instructions:</strong>{" "}
                                    {item.cakeNote}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center text-gray-600">
                        {formatPrice(item.price)}
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex justify-center">
                          <span className="bg-honey-gold/10 text-honey-gold font-semibold px-4 py-1 rounded-full">
                            {item.quantity}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-right font-semibold text-charcoal-black">
                        {formatPrice(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              <div className="flex justify-between text-xl font-bold text-charcoal-black pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </Card>

          {/* Customer Information */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-charcoal-black mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-honey-gold" />
              Customer Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-charcoal-black">
                  {order.customerName}
                </p>
              </div>
              {order.customerEmail && (
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </p>
                  <p className="font-medium text-charcoal-black">
                    {order.customerEmail}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Phone
                </p>
                <p className="font-medium text-charcoal-black">
                  {order.customerPhone}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  Delivery Method
                </p>
                <Badge
                  className={
                    order.deliveryMethod === "PICKUP"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }
                >
                  {order.deliveryMethod === "PICKUP" ? "Pickup" : "Delivery"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {order.deliveryMethod === "PICKUP"
                    ? "Pickup Note"
                    : "Delivery Address"}
                </p>
                <p className="font-medium text-charcoal-black">
                  {order.deliveryAddress}
                </p>
              </div>
              {order.customNote && (
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <StickyNote className="h-4 w-4" />
                    Delivery Notes
                  </p>
                  <p className="font-medium text-charcoal-black italic">
                    {order.customNote}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status Update */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-charcoal-black mb-4">
              Update Status
            </h2>

            {order.deliveryMethod === "PICKUP" &&
              order.status === "PREPARING" && (
                <Button
                  onClick={handleMarkReadyForPickup}
                  disabled={isUpdating}
                  className="w-full mb-4 bg-green-600 hover:bg-green-700 text-white"
                >
                  {isUpdating
                    ? "Notifying..."
                    : "✓ Mark Ready & Notify Customer"}
                </Button>
              )}

            <div className="space-y-2">
              {(order.deliveryMethod === "PICKUP"
                ? [
                    "PENDING",
                    "CONFIRMED",
                    "PREPARING",
                    "READY_FOR_PICKUP",
                    "PICKED_UP",
                    "CANCELLED",
                  ]
                : [
                    "PENDING",
                    "CONFIRMED",
                    "PREPARING",
                    "OUT_FOR_DELIVERY",
                    "DELIVERED",
                    "CANCELLED",
                  ]
              ).map((status) => (
                <Button
                  key={status}
                  onClick={() => handleUpdateStatus(status)}
                  disabled={isUpdating || order.status === status}
                  variant={order.status === status ? "default" : "outline"}
                  className="w-full justify-start"
                >
                  {status.replace(/_/g, " ")}
                </Button>
              ))}
            </div>
          </Card>

          {/* Payment Information */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-charcoal-black mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-honey-gold" />
              Payment
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge
                  className={`mt-1 ${
                    order.paymentStatus === "PAID"
                      ? "bg-green-100 text-green-800"
                      : order.paymentStatus === "PENDING"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.paymentStatus}
                </Badge>
              </div>
              {order.paymentMethod && (
                <div>
                  <p className="text-sm text-gray-600">Method</p>
                  <p className="font-medium text-charcoal-black capitalize">
                    {order.paymentMethod}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-honey-gold">
                  {formatPrice(order.total)}
                </p>
              </div>
            </div>
          </Card>

          {/* Order Timeline */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-charcoal-black mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-honey-gold" />
              Timeline
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Order Placed</p>
                <p className="font-medium text-charcoal-black">
                  {formatDate(new Date(order.createdAt))}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-medium text-charcoal-black">
                  {formatDate(new Date(order.updatedAt))}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
