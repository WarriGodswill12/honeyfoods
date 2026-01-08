"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Bell, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/gallery", label: "Gallery" },
    { href: "/admin/settings", label: "Settings" },
  ];

  useEffect(() => {
    fetchPendingOrders();
    // Poll for new orders every 30 seconds
    const interval = setInterval(fetchPendingOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const response = await fetch("/api/orders?status=PENDING&limit=5");
      if (response.ok) {
        const data = await response.json();
        setPendingOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching pending orders:", error);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/admin/dashboard"
            className="font-heading text-xl font-bold text-charcoal-black"
          >
            HoneyFoods <span className="text-honey-gold">Admin</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "bg-honey-gold/10 text-honey-gold"
                      : "text-gray-600 hover:text-charcoal-black hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                  {item.href === "/admin/orders" &&
                    pendingOrders.length > 0 && (
                      <Badge className="ml-2 bg-red-500">
                        {pendingOrders.length}
                      </Badge>
                    )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                {pendingOrders.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {pendingOrders.length}
                  </span>
                )}
              </Button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="font-semibold text-charcoal-black">
                      Pending Orders
                    </h3>
                  </div>
                  {pendingOrders.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                      No pending orders
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      {pendingOrders.map((order) => (
                        <Link
                          key={order.id}
                          href="/admin/orders"
                          onClick={() => setShowNotifications(false)}
                          className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-charcoal-black text-sm">
                                {order.orderNumber}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {order.customerName}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-honey-gold">
                              £{(order.total / 100).toFixed(2)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  <div className="px-4 py-2 border-t border-gray-100">
                    <Link
                      href="/admin/orders"
                      onClick={() => setShowNotifications(false)}
                      className="text-sm text-honey-gold hover:text-honey-gold/80 font-medium"
                    >
                      View All Orders →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Logout */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="hidden md:flex"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-between ${
                      isActive
                        ? "bg-honey-gold/10 text-honey-gold"
                        : "text-gray-600 hover:text-charcoal-black hover:bg-gray-50"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.href === "/admin/orders" &&
                      pendingOrders.length > 0 && (
                        <Badge className="bg-red-500">
                          {pendingOrders.length}
                        </Badge>
                      )}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="px-4 py-3 text-left text-gray-600 hover:text-charcoal-black hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
