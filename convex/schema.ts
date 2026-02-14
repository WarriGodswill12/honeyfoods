import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table (for admin authentication and user data)
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    passwordHash: v.optional(v.string()), // Optional for social auth
    role: v.union(v.literal("ADMIN"), v.literal("SUPER_ADMIN")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  // Products table
  products: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    price: v.number(), // Store as pounds (decimal)
    image: v.string(), // Primary image URL (for backward compatibility)
    imageStorageId: v.optional(v.id("_storage")), // Primary image storage ID
    images: v.optional(v.array(v.string())), // Multiple product images (URLs for backward compatibility)
    imagesStorageIds: v.optional(v.array(v.id("_storage"))), // Multiple product images storage IDs
    imagePublicId: v.optional(v.string()), // Cloudinary public ID for deletion (deprecated)
    imagePublicIds: v.optional(v.array(v.string())), // Cloudinary public IDs for multiple images (deprecated)
    available: v.boolean(),
    featured: v.boolean(),
    category: v.optional(v.string()),
    flavors: v.optional(v.array(v.string())), // Array of available flavors for this product
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_availability", ["available", "featured"])
    .index("by_category", ["category"]),

  // Orders table
  orders: defineTable({
    orderNumber: v.string(),
    customerName: v.string(),
    customerEmail: v.optional(v.string()),
    customerPhone: v.string(),
    deliveryMethod: v.optional(
      v.union(v.literal("DELIVERY"), v.literal("PICKUP")),
    ), // Optional for backwards compatibility
    deliveryAddress: v.string(), // For delivery orders or pickup location info
    customNote: v.optional(v.string()),
    subtotal: v.number(), // in pounds (decimal)
    deliveryFee: v.number(), // in pounds (decimal) - 0 for pickup
    total: v.number(), // in pounds (decimal)
    status: v.union(
      v.literal("PENDING"),
      v.literal("CONFIRMED"),
      v.literal("PREPARING"),
      v.literal("OUT_FOR_DELIVERY"),
      v.literal("DELIVERED"),
      v.literal("READY_FOR_PICKUP"), // New status for pickup orders
      v.literal("PICKED_UP"), // New status when customer picks up
      v.literal("CANCELLED"),
    ),
    paymentStatus: v.union(
      v.literal("PENDING"),
      v.literal("PAID"),
      v.literal("FAILED"),
      v.literal("REFUNDED"),
    ),
    paymentMethod: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_orderNumber", ["orderNumber"])
    .index("by_status", ["status"])
    .index("by_paymentStatus", ["paymentStatus"])
    .index("by_deliveryMethod", ["deliveryMethod"])
    .index("by_createdAt", ["createdAt"]),

  // Order Items table
  orderItems: defineTable({
    orderId: v.id("orders"),
    productId: v.id("products"),
    name: v.string(), // Snapshot of product name
    price: v.number(), // Snapshot of price at time of order (in pounds)
    quantity: v.number(),
    subtotal: v.number(), // in pounds (decimal)
    selectedFlavor: v.optional(v.string()), // Selected flavor for this item
    // Calendar fields for individual cake items
    deliveryDate: v.optional(v.string()), // ISO date string for cake delivery
    cakeTitle: v.optional(v.string()), // Title for the cake occasion
    cakeNote: v.optional(v.string()), // Special notes for this cake
  })
    .index("by_order", ["orderId"])
    .index("by_product", ["productId"]),

  // Payments table
  payments: defineTable({
    orderId: v.id("orders"),
    amount: v.number(), // in pounds (decimal)
    currency: v.string(),
    provider: v.string(), // 'stripe', 'paystack', 'applepay'
    providerPaymentId: v.string(), // Required - payment intent ID from provider
    providerMetadata: v.optional(v.any()), // JSON data
    status: v.union(
      v.literal("PENDING"),
      v.literal("PAID"),
      v.literal("FAILED"),
      v.literal("REFUNDED"),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_order", ["orderId"])
    .index("by_providerPaymentId", ["providerPaymentId"]),

  // Gallery Images table
  galleryImages: defineTable({
    type: v.string(), // 'gallery', 'hero', 'banner', etc.
    url: v.string(), // Image URL (for backward compatibility)
    storageId: v.optional(v.id("_storage")), // Convex storage ID
    alt: v.string(),
    order: v.optional(v.number()), // Deprecated - kept for backward compatibility with existing data
    featured: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_featured", ["featured"]),

  // Settings table (singleton)
  settings: defineTable({
    deliveryFee: v.number(), // in pounds (decimal)
    freeDeliveryThreshold: v.optional(v.number()), // in pounds (decimal)
    freeDeliveryText: v.optional(v.string()), // Custom text for free delivery message
    minOrderAmount: v.optional(v.number()), // in pounds (decimal)
    taxRate: v.optional(v.number()),
    currency: v.string(),
    storeName: v.optional(v.string()),
    storeEmail: v.optional(v.string()),
    storePhone: v.optional(v.string()),
    storeAddress: v.optional(v.string()),
    storeTagline: v.optional(v.string()),
    heroBackgroundImage: v.optional(v.string()), // Image URL (for backward compatibility)
    heroBackgroundImageStorageId: v.optional(v.id("_storage")), // Convex storage ID
    aboutUsImage: v.optional(v.string()), // Image URL (for backward compatibility)
    aboutUsImageStorageId: v.optional(v.id("_storage")), // Convex storage ID
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
});
