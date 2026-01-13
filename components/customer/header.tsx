"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X, ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { useCart } from "@/store/cart-store";
import { useRouter } from "next/navigation";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getTotalItems } = useCart();
  const router = useRouter();

  const categories = [
    { label: "Nigerian Foods", href: "/shop?category=Nigerian%20Foods" },
    { label: "Pastries", href: "/shop?category=Pastries" },
    { label: "Cakes", href: "/shop?category=Cakes" },
    { label: "Shop All", href: "/shop" },
  ];

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-soft-cream/95 backdrop-blur-md border-b border-honey-gold/10 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex h-20 md:h-24 items-center justify-between gap-4">
          {/* Left: Menu & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-white transition-all active:scale-95"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-charcoal-black" />
              ) : (
                <Menu className="h-6 w-6 text-charcoal-black" />
              )}
            </button>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative group p-2 rounded-full hover:bg-white transition-all active:scale-95"
            >
              <ShoppingCart className="h-6 w-6 text-charcoal-black group-hover:text-honey-gold transition-colors" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-honey-gold text-xs font-bold text-white shadow-md">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </div>

          {/* Center: Logo */}
          <Link
            href="/"
            className="group flex items-center absolute left-1/2 -translate-x-1/2"
            aria-label={siteConfig.name}
          >
            <img
              src="/logo.png"
              alt={siteConfig.name}
              className="h-28 sm:h-32 md:h-36 lg:h-40 w-auto transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Right: Search Bar (Desktop) */}
          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 lg:w-80 px-4 py-2.5 pr-11 rounded-full border border-gray-200 focus:border-honey-gold focus:ring-2 focus:ring-honey-gold/20 outline-none transition-all text-sm font-body"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-honey-gold text-white hover:bg-warm-orange transition-colors"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Mobile Search Icon */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-white transition-all active:scale-95"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Search"
          >
            <Search className="h-6 w-6 text-charcoal-black" />
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center space-x-8 lg:space-x-10 py-4 border-t border-gray-100">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm lg:text-base font-semibold font-body text-charcoal-black hover:text-honey-gold transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-honey-gold after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}

          {/* Shop Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShopDropdownOpen(true)}
            onMouseLeave={() => setShopDropdownOpen(false)}
          >
            <button className="text-sm lg:text-base font-semibold font-body text-charcoal-black hover:text-honey-gold transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-honey-gold after:transition-all hover:after:w-full flex items-center gap-1">
              Shop
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  shopDropdownOpen && "rotate-180"
                )}
              />
            </button>

            {shopDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                {categories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="block px-4 py-2.5 text-sm font-body text-charcoal-black hover:bg-soft-cream hover:text-honey-gold transition-colors"
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-full border border-gray-200 focus:border-honey-gold focus:ring-2 focus:ring-honey-gold/20 outline-none transition-all text-sm font-body"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-honey-gold text-white hover:bg-warm-orange transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-semibold font-body text-charcoal-black hover:text-honey-gold transition-colors py-3 px-4 rounded-xl hover:bg-soft-cream active:bg-honey-gold/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Shop Submenu */}
              <div className="border-t border-gray-100 pt-2 mt-2">
                <p className="text-xs font-bold font-body text-gray-500 uppercase px-4 py-2">
                  Shop
                </p>
                {categories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="block text-base font-body text-charcoal-black hover:text-honey-gold transition-colors py-3 px-4 pl-8 rounded-xl hover:bg-soft-cream active:bg-honey-gold/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
