import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================
// QUERIES
// ============================================

// Get payment by order ID
export const getPaymentByOrderId = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .first();
  },
});

// Get payment by provider payment ID
export const getPaymentByProviderPaymentId = query({
  args: { providerPaymentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_providerPaymentId", (q) =>
        q.eq("providerPaymentId", args.providerPaymentId),
      )
      .first();
  },
});

// Get payment by Stripe payment intent ID (alias for getPaymentByProviderPaymentId)
export const getPaymentByStripeId = query({
  args: { stripePaymentIntentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_providerPaymentId", (q) =>
        q.eq("providerPaymentId", args.stripePaymentIntentId),
      )
      .first();
  },
});

// ============================================
// MUTATIONS
// ============================================

// Create payment
export const createPayment = mutation({
  args: {
    orderId: v.id("orders"),
    amount: v.number(),
    currency: v.string(),
    provider: v.string(),
    providerPaymentId: v.string(), // Required for payment lookup
    providerMetadata: v.optional(v.any()),
    status: v.union(
      v.literal("PENDING"),
      v.literal("PAID"),
      v.literal("FAILED"),
      v.literal("REFUNDED"),
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("payments", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update payment status
export const updatePaymentStatus = mutation({
  args: {
    id: v.id("payments"),
    status: v.union(
      v.literal("PENDING"),
      v.literal("PAID"),
      v.literal("FAILED"),
      v.literal("REFUNDED"),
    ),
    providerMetadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});

// Update payment (more flexible)
export const updatePayment = mutation({
  args: {
    id: v.id("payments"),
    status: v.optional(
      v.union(
        v.literal("PENDING"),
        v.literal("PAID"),
        v.literal("FAILED"),
        v.literal("REFUNDED"),
      ),
    ),
    providerPaymentId: v.optional(v.string()),
    providerMetadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});
