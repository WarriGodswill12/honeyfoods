"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

  // Fetch real stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const products = await response.json();
          setStats({
            totalProducts: products.length,
            totalOrders: 0, // Will be implemented in Phase 5
            totalRevenue: 0, // Will be implemented in Phase 5
            pendingOrders: 0, // Will be implemented in Phase 5
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
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
              className="text-sm text-honey-gold hover:text-honey-gold/80"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-honey-gold/20 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-honey-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-charcoal-black">
                      Order #000{i}
                    </p>
                    <p className="text-sm text-gray-500">2 items</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-charcoal-black">
                    {formatPrice(5000 * i)}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                    <Clock className="h-3 w-3" />
                    Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
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
                <span className="font-medium">Add New Product</span>
              </button>
            </Link>

            <Link href="/admin/orders">
              <button className="w-full flex items-center gap-3 p-4 bg-warm-orange text-white rounded-xl hover:opacity-90 transition-opacity">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">View Pending Orders</span>
              </button>
            </Link>

            <Link href="/admin/dashboard">
              <button className="w-full flex items-center gap-3 p-4 bg-gray-100 text-charcoal-black rounded-xl hover:bg-gray-200 transition-colors">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">View Analytics</span>
              </button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
