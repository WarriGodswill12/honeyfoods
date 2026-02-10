import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================
// QUERIES
// ============================================

// Get all products (with optional filters)
export const getProducts = query({
  args: {
    category: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    available: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let products = await ctx.db.query("products").order("desc").collect();

    // Apply filters
    if (args.category) {
      products = products.filter((p) => p.category === args.category);
    }
    if (args.featured !== undefined) {
      products = products.filter((p) => p.featured === args.featured);
    }
    if (args.available !== undefined) {
      products = products.filter((p) => p.available === args.available);
    }

    return products;
  },
});

// Get product by ID
export const getProductById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get product by slug
export const getProductBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// ============================================
// MUTATIONS
// ============================================

// Create product
export const createProduct = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    image: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    images: v.optional(v.array(v.string())),
    imagesStorageIds: v.optional(v.array(v.id("_storage"))),
    imagePublicId: v.optional(v.string()),
    imagePublicIds: v.optional(v.array(v.string())),
    available: v.boolean(),
    featured: v.boolean(),
    category: v.optional(v.string()),
    flavors: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Check if slug already exists
    const existing = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      throw new Error("A product with this slug already exists");
    }

    const now = Date.now();
    return await ctx.db.insert("products", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update product
export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    image: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    images: v.optional(v.array(v.string())),
    imagesStorageIds: v.optional(v.array(v.id("_storage"))),
    imagePublicId: v.optional(v.string()),
    imagePublicIds: v.optional(v.array(v.string())),
    available: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
    category: v.optional(v.string()),
    flavors: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // If updating slug, check it doesn't exist
    if (updates.slug) {
      const existing = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", updates.slug as string))
        .first();

      if (existing && existing._id !== id) {
        throw new Error("A product with this slug already exists");
      }
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});

// Delete product
export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    // Check if product is in any orders
    const orderItems = await ctx.db
      .query("orderItems")
      .withIndex("by_product", (q) => q.eq("productId", args.id))
      .first();

    if (orderItems) {
      throw new Error(
        "Cannot delete product that has been ordered. Consider marking it as unavailable instead.",
      );
    }

    await ctx.db.delete(args.id);
  },
});

// Get products by IDs (for cart validation)
export const getProductsByIds = query({
  args: { ids: v.array(v.id("products")) },
  handler: async (ctx, args) => {
    const products = await Promise.all(args.ids.map((id) => ctx.db.get(id)));
    return products.filter((p) => p !== null);
  },
});
// Delete all products (admin only - use with caution)
export const deleteAllProducts = mutation({
  args: {},
  handler: async (ctx, args) => {
    // Get all products
    const products = await ctx.db.query("products").collect();

    // Delete each product
    let count = 0;
    for (const product of products) {
      await ctx.db.delete(product._id);
      count++;
    }

    return { count };
  },
});
