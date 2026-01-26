import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================
// QUERIES
// ============================================

// Get all orders (with optional status filter)
export const getOrders = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("PENDING"),
        v.literal("CONFIRMED"),
        v.literal("PREPARING"),
        v.literal("OUT_FOR_DELIVERY"),
        v.literal("DELIVERED"),
        v.literal("CANCELLED"),
      ),
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let orders;

    if (args.status) {
      orders = await ctx.db
        .query("orders")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    } else {
      orders = await ctx.db.query("orders").collect();
    }

    // Sort by creation date descending
    orders = orders.sort((a, b) => b.createdAt - a.createdAt);

    // Apply limit
    if (args.limit) {
      orders = orders.slice(0, args.limit);
    }

    return orders;
  },
});

// Get order by ID with items
export const getOrderById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) return null;

    // Get order items
    const orderItems = await ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", args.id))
      .collect();

    // Get product details for each item
    const itemsWithProducts = await Promise.all(
      orderItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          product: product
            ? { name: product.name, image: product.image }
            : null,
        };
      }),
    );

    return {
      ...order,
      orderItems: itemsWithProducts,
    };
  },
});

// Get order by order number
export const getOrderByNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_orderNumber", (q) => q.eq("orderNumber", args.orderNumber))
      .first();

    if (!order) return null;

    // Get order items
    const orderItems = await ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", order._id))
      .collect();

    return {
      ...order,
      orderItems,
    };
  },
});

// Get order statistics
export const getOrderStats = query({
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === "PAID")
      .reduce((sum, o) => sum + o.total, 0);

    return {
      totalOrders,
      pendingOrders,
      totalRevenue,
    };
  },
});

// ============================================
// MUTATIONS
// ============================================

// Create order with items
export const createOrder = mutation({
  args: {
    orderNumber: v.string(),
    customerName: v.string(),
    customerEmail: v.optional(v.string()),
    customerPhone: v.string(),
    deliveryAddress: v.string(),
    customNote: v.optional(v.string()),
    subtotal: v.number(),
    deliveryFee: v.number(),
    total: v.number(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        subtotal: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { items, ...orderData } = args;
    const now = Date.now();

    // Create order
    const orderId = await ctx.db.insert("orders", {
      ...orderData,
      status: "PENDING",
      paymentStatus: "PENDING",
      createdAt: now,
      updatedAt: now,
    });

    // Create order items
    for (const item of items) {
      await ctx.db.insert("orderItems", {
        orderId,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      });
    }

    return orderId;
  },
});

// Update order status
export const updateOrderStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("PENDING"),
      v.literal("CONFIRMED"),
      v.literal("PREPARING"),
      v.literal("OUT_FOR_DELIVERY"),
      v.literal("DELIVERED"),
      v.literal("CANCELLED"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(args.id);
  },
});

// Update payment status
export const updatePaymentStatus = mutation({
  args: {
    id: v.id("orders"),
    paymentStatus: v.union(
      v.literal("PENDING"),
      v.literal("PAID"),
      v.literal("FAILED"),
      v.literal("REFUNDED"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      paymentStatus: args.paymentStatus,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(args.id);
  },
});
