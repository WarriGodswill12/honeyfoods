"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { useCart } from "@/store/cart-store";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-soft-cream/80 backdrop-blur-md border-b border-honey-gold/10">
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 sm:px-6 lg:px-12">
        {/* Logo */}
        <Link href="/" className="group flex items-center flex-shrink-0">
          <img
            src="/logo.png"
            alt={siteConfig.name}
            className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 xl:space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm lg:text-base font-medium text-charcoal-black hover:text-honey-gold transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-honey-gold after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Cart & Mobile Menu */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Cart Button */}
          <Link
            href="/cart"
            className="relative group p-2 sm:p-2.5 rounded-full hover:bg-white transition-all active:scale-95"
          >
            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-charcoal-black group-hover:text-honey-gold transition-colors" />
            {/* Cart Badge */}
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-honey-gold text-xs font-bold text-white shadow-md">
                {getTotalItems()}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 sm:p-2.5 rounded-full hover:bg-white transition-all active:scale-95"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-charcoal-black" />
            ) : (
              <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-charcoal-black" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="container mx-auto flex flex-col space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-medium text-charcoal-black hover:text-honey-gold transition-colors py-3 px-4 rounded-xl hover:bg-soft-cream active:bg-honey-gold/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
