import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================
// QUERIES
// ============================================

// Get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Get user by ID
export const getUserById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get all admin users
export const getAdminUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// ============================================
// MUTATIONS
// ============================================

// Create user
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    passwordHash: v.string(),
    role: v.union(v.literal("ADMIN"), v.literal("SUPER_ADMIN")),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("User with this email already exists");
    }

    const now = Date.now();
    return await ctx.db.insert("users", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update user
export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    passwordHash: v.optional(v.string()),
    role: v.optional(v.union(v.literal("ADMIN"), v.literal("SUPER_ADMIN"))),
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

// Delete user
export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
