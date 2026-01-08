"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  ShoppingBag,
  Package,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  deliveryAddress: string;
  customNote: string | null;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);

        // Calculate stats
        const pending = data.orders.filter(
          (o: Order) => o.status === "PENDING"
        ).length;
        const delivered = data.orders.filter(
          (o: Order) => o.status === "DELIVERED"
        ).length;

        setStats({
          totalOrders: data.orders.length,
          pendingOrders: pending,
          deliveredOrders: delivered,
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
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
      CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      className: "bg-gray-100 text-gray-800",
    };

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold text-charcoal-black mb-2">
          Orders
        </h1>
        <p className="text-gray-600">
          Manage customer orders and track deliveries
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-xl">
              <ShoppingBag className="h-6 w-6 text-warm-orange" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="font-heading text-3xl font-bold text-charcoal-black">
                {stats.totalOrders}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="font-heading text-3xl font-bold text-charcoal-black">
                {stats.pendingOrders}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="font-heading text-3xl font-bold text-charcoal-black">
                {stats.deliveredOrders}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-honey-gold" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                    Order
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-charcoal-black">
                        {order.orderNumber}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-charcoal-black">
                        {order.customerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.customerEmail || order.customerPhone}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.orderItems.length}
                    </td>
                    <td className="px-6 py-4 font-medium text-charcoal-black">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(new Date(order.createdAt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
