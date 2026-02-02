import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================
// QUERIES
// ============================================

// Get all gallery images (with optional type filter)
export const getGalleryImages = query({
  args: {
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let images;

    if (args.type) {
      images = await ctx.db
        .query("galleryImages")
        .withIndex("by_type", (q) => q.eq("type", args.type!))
        .collect();
    } else {
      images = await ctx.db.query("galleryImages").collect();
    }

    // Fetch URLs from storage IDs
    const imagesWithUrls = await Promise.all(
      images.map(async (image) => {
        if (image.storageId) {
          const url = await ctx.storage.getUrl(image.storageId);
          return { ...image, url: url || image.url };
        }
        return image;
      }),
    );

    return imagesWithUrls;
  },
});

// Get featured gallery images
export const getFeaturedGalleryImages = query({
  handler: async (ctx) => {
    const images = await ctx.db
      .query("galleryImages")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .collect();

    // Fetch URLs from storage IDs
    const imagesWithUrls = await Promise.all(
      images.map(async (image) => {
        if (image.storageId) {
          const url = await ctx.storage.getUrl(image.storageId);
          return { ...image, url: url || image.url };
        }
        return image;
      }),
    );

    return imagesWithUrls;
  },
});

// Get gallery image by ID
export const getGalleryImageById = query({
  args: { id: v.id("galleryImages") },
  handler: async (ctx, args) => {
    const image = await ctx.db.get(args.id);
    if (!image) return null;

    // Fetch URL from storage ID if available
    if (image.storageId) {
      const url = await ctx.storage.getUrl(image.storageId);
      return { ...image, url: url || image.url };
    }

    return image;
  },
});

// ============================================
// MUTATIONS
// ============================================

// Create gallery image
export const createGalleryImage = mutation({
  args: {
    type: v.string(),
    url: v.string(),
    storageId: v.optional(v.id("_storage")),
    alt: v.string(),
    featured: v.boolean(),
    order: v.optional(v.number()), // Deprecated - kept for backward compatibility
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("galleryImages", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update gallery image
export const updateGalleryImage = mutation({
  args: {
    id: v.id("galleryImages"),
    type: v.optional(v.string()),
    url: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    alt: v.optional(v.string()),
    featured: v.optional(v.boolean()),
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

// Delete gallery image
export const deleteGalleryImage = mutation({
  args: { id: v.id("galleryImages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
