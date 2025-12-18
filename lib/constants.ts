// Application-wide constants

export const APP_NAME = "Honey Foods";
export const APP_TAGLINE = "Taste is everything";

// Pagination
export const PRODUCTS_PER_PAGE = 12;
export const ORDERS_PER_PAGE = 20;

// Order status labels
export const ORDER_STATUS_LABELS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
} as const;

// Payment status labels
export const PAYMENT_STATUS_LABELS = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
} as const;

// Order status colors for UI
export const ORDER_STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-purple-100 text-purple-800",
  OUT_FOR_DELIVERY: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
} as const;

// Payment status colors for UI
export const PAYMENT_STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
} as const;

// Maximum file upload size (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image types
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Cart constants
export const MAX_QUANTITY_PER_ITEM = 99;
export const MIN_ORDER_AMOUNT = 500; // Minimum order of ₦500

// Delivery constants
export const DEFAULT_DELIVERY_FEE = 1500; // ₦1,500
export const FREE_DELIVERY_THRESHOLD = 10000; // Free delivery over ₦10,000

// API Routes
export const API_ROUTES = {
  PRODUCTS: "/api/products",
  ORDERS: "/api/orders",
  PAYMENT: "/api/payment",
  UPLOAD: "/api/upload",
  AUTH: "/api/auth",
} as const;

// Navigation links
export const CUSTOMER_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const ADMIN_NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Products", href: "/dashboard/products", icon: "Package" },
  { label: "Orders", href: "/dashboard/orders", icon: "ShoppingBag" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
] as const;

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: "Something went wrong. Please try again.",
  NETWORK: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION: "Please check your input and try again.",
  PAYMENT_FAILED: "Payment failed. Please try again.",
  OUT_OF_STOCK: "This product is currently out of stock.",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  PRODUCT_ADDED: "Product added to cart!",
  PRODUCT_REMOVED: "Product removed from cart",
  ORDER_PLACED: "Order placed successfully!",
  PAYMENT_SUCCESS: "Payment successful!",
  PRODUCT_CREATED: "Product created successfully",
  PRODUCT_UPDATED: "Product updated successfully",
  PRODUCT_DELETED: "Product deleted successfully",
  ORDER_UPDATED: "Order updated successfully",
} as const;

// Regex patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+?234|0)[789][01]\d{8}$/,
  URL: /^https?:\/\/.+/,
} as const;
