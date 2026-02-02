import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============================================
// MUTATIONS
// ============================================

// Generate upload URL for file uploads
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Delete a file from storage
export const deleteFile = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.storageId);
  },
});

// Delete multiple files from storage
export const deleteFiles = mutation({
  args: { storageIds: v.array(v.id("_storage")) },
  handler: async (ctx, args) => {
    for (const storageId of args.storageIds) {
      await ctx.storage.delete(storageId);
    }
  },
});

// ============================================
// QUERIES
// ============================================

// Get file URL from storage ID
export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Get multiple file URLs
export const getFileUrls = query({
  args: { storageIds: v.array(v.id("_storage")) },
  handler: async (ctx, args) => {
    const urls = await Promise.all(
      args.storageIds.map((id) => ctx.storage.getUrl(id)),
    );
    return urls;
  },
});

// Get file metadata
export const getFileMetadata = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getMetadata(args.storageId);
  },
});
