"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { ShoppingBag, Package } from "lucide-react";

export default function OrdersPage() {
  // Placeholder - will be replaced with real API calls
  const orders = [
    {
      id: "1",
      orderNumber: "HF-001",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      total: 15000,
      status: "pending",
      createdAt: new Date(),
      items: 3,
    },
    {
      id: "2",
      orderNumber: "HF-002",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      total: 8500,
      status: "processing",
      createdAt: new Date(Date.now() - 86400000),
      items: 2,
    },
    {
      id: "3",
      orderNumber: "HF-003",
      customerName: "Bob Johnson",
      customerEmail: "bob@example.com",
      total: 12000,
      status: "delivered",
      createdAt: new Date(Date.now() - 172800000),
      items: 4,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
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
                {orders.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="font-heading text-3xl font-bold text-charcoal-black">
                {orders.filter((o) => o.status === "pending").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="font-heading text-3xl font-bold text-charcoal-black">
                {orders.filter((o) => o.status === "delivered").length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
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
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
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
                      {order.customerEmail}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{order.items}</td>
                  <td className="px-6 py-4 font-medium text-charcoal-black">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
