import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all order items for a specific order
export const getOrderItems = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .collect();
  },
});

// Get order items by product ID (for checking if product can be deleted)
export const countByProductId = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("orderItems")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
    return items.length;
  },
});

// Count all order items (for checking if any products have orders)
export const countAll = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("orderItems").collect();
    return items.length;
  },
});

// Create order items (used during order creation)
export const createOrderItems = mutation({
  args: {
    orderId: v.id("orders"),
    items: v.array(
      v.object({
        productId: v.id("products"),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        subtotal: v.number(),
        selectedFlavor: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const itemIds = [];
    for (const item of args.items) {
      const id = await ctx.db.insert("orderItems", {
        orderId: args.orderId,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
        selectedFlavor: item.selectedFlavor,
      });
      itemIds.push(id);
    }
    return itemIds;
  },
});
