import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================
// QUERIES
// ============================================

// Get settings (singleton)
export const getSettings = query({
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").first();

    // Return default settings if none exist
    if (!settings) {
      return {
        deliveryFee: 500, // £5.00
        freeDeliveryThreshold: undefined,
        taxRate: undefined,
        currency: "GBP",
        storeName: undefined,
        storeEmail: undefined,
        storePhone: undefined,
        storeAddress: undefined,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    }

    return settings;
  },
});

// ============================================
// MUTATIONS
// ============================================

// Create or update settings
export const updateSettings = mutation({
  args: {
    deliveryFee: v.optional(v.number()),
    freeDeliveryThreshold: v.optional(v.number()),
    minOrderAmount: v.optional(v.number()),
    taxRate: v.optional(v.number()),
    currency: v.optional(v.string()),
    storeName: v.optional(v.string()),
    storeEmail: v.optional(v.string()),
    storePhone: v.optional(v.string()),
    storeAddress: v.optional(v.string()),
    storeTagline: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("settings").first();
    const now = Date.now();

    if (existing) {
      // Update existing settings
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: now,
      });
      return await ctx.db.get(existing._id);
    } else {
      // Create new settings
      const id = await ctx.db.insert("settings", {
        deliveryFee: args.deliveryFee ?? 50,
        freeDeliveryThreshold: args.freeDeliveryThreshold,
        minOrderAmount: args.minOrderAmount,
        taxRate: args.taxRate,
        currency: args.currency ?? "GBP",
        storeName: args.storeName,
        storeEmail: args.storeEmail,
        storePhone: args.storePhone,
        storeAddress: args.storeAddress,
        storeTagline: args.storeTagline,
        createdAt: now,
        updatedAt: now,
      });
      return await ctx.db.get(id);
    }
  },
});
