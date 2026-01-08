"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
  Eye,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
  orderItems: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real stats from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await fetch("/api/products");
        const products = productsResponse.ok
          ? await productsResponse.json()
          : [];

        // Fetch orders
        const ordersResponse = await fetch("/api/orders?limit=5");
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setStats({
            totalProducts: products.length,
            totalOrders: ordersData.stats?.totalOrders || 0,
            totalRevenue: ordersData.stats?.totalRevenue || 0,
            pendingOrders: ordersData.stats?.pendingOrders || 0,
          });
          setRecentOrders(ordersData.orders || []);
        } else {
          setStats((prev) => ({ ...prev, totalProducts: products.length }));
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-honey-gold",
      bgColor: "bg-honey-gold/10",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-warm-orange",
      bgColor: "bg-warm-orange/10",
    },
    {
      title: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold text-charcoal-black mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's an overview of your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="font-heading text-3xl font-bold text-charcoal-black">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-bold text-charcoal-black">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm text-honey-gold hover:text-honey-gold/80 font-medium"
            >
              View All →
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-honey-gold"></div>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => {
                const statusConfig = {
                  PENDING: {
                    label: "Pending",
                    color: "text-orange-600 bg-orange-50",
                    icon: Clock,
                  },
                  CONFIRMED: {
                    label: "Confirmed",
                    color: "text-blue-600 bg-blue-50",
                    icon: CheckCircle,
                  },
                  PREPARING: {
                    label: "Preparing",
                    color: "text-purple-600 bg-purple-50",
                    icon: Package,
                  },
                  OUT_FOR_DELIVERY: {
                    label: "Out for Delivery",
                    color: "text-indigo-600 bg-indigo-50",
                    icon: ShoppingBag,
                  },
                  DELIVERED: {
                    label: "Delivered",
                    color: "text-green-600 bg-green-50",
                    icon: CheckCircle,
                  },
                  CANCELLED: {
                    label: "Cancelled",
                    color: "text-red-600 bg-red-50",
                    icon: Clock,
                  },
                };

                const status =
                  statusConfig[order.status as keyof typeof statusConfig] ||
                  statusConfig.PENDING;
                const StatusIcon = status.icon;

                return (
                  <Link
                    key={order.id}
                    href="/admin/orders"
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-honey-gold/20 flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-honey-gold" />
                      </div>
                      <div>
                        <p className="font-medium text-charcoal-black">
                          {order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.customerName} • {order.orderItems.length}{" "}
                          {order.orderItems.length === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-charcoal-black mb-1">
                        {formatPrice(order.total)}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 text-xs ${status.color} px-2 py-1 rounded-full`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="font-heading text-xl font-bold text-charcoal-black mb-6">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <Link href="/admin/products">
              <button className="w-full flex items-center gap-3 p-4 bg-honey-gold text-white rounded-xl hover:opacity-90 transition-opacity">
                <Package className="h-5 w-5" />
                <span className="font-medium">Manage Products</span>
              </button>
            </Link>

            <Link href="/admin/orders">
              <button className="w-full flex items-center gap-3 p-4 bg-warm-orange text-white rounded-xl hover:opacity-90 transition-opacity">
                <Eye className="h-5 w-5" />
                <span className="font-medium">View All Orders</span>
              </button>
            </Link>

            <Link href="/admin/settings">
              <button className="w-full flex items-center gap-3 p-4 bg-gray-100 text-charcoal-black rounded-xl hover:bg-gray-200 transition-colors">
                <DollarSign className="h-5 w-5" />
                <span className="font-medium">Update Settings</span>
              </button>
            </Link>

            <Link href="/admin/gallery">
              <button className="w-full flex items-center gap-3 p-4 bg-gray-100 text-charcoal-black rounded-xl hover:bg-gray-200 transition-colors">
                <Package className="h-5 w-5" />
                <span className="font-medium">Manage Images</span>
              </button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
