# Migration from Cloudinary to Convex File Storage

## ✅ Completed Changes

### 1. Convex Backend Updates

#### File Storage Module Created

- **File**: `convex/fileStorage.ts`
- **Functions**:
  - `generateUploadUrl()` - Generate upload URLs
  - `deleteFile(storageId)` - Delete single file
  - `deleteFiles(storageIds[])` - Delete multiple files
  - `getFileUrl(storageId)` - Get URL from storage ID
  - `getFileUrls(storageIds[])` - Get multiple URLs
  - `getFileMetadata(storageId)` - Get file metadata

#### Schema Updates

- **Products table**: Added `imageStorageId` and `imagesStorageIds` fields
- **Gallery Images table**: Added `storageId` field
- **Settings table**: Added `heroBackgroundImageStorageId` and `aboutUsImageStorageId` fields
- Old URL fields kept for backward compatibility

#### Gallery Mutations Updated

- `createGalleryImage` - Now accepts `storageId` parameter
- `updateGalleryImage` - Now accepts `storageId` parameter

#### Products Mutations Updated

- `createProduct` - Now accepts `imageStorageId` and `imagesStorageIds`
- `updateProduct` - Now accepts `imageStorageId` and `imagesStorageIds`

#### Settings Mutations Updated

- `updateSettings` - Now accepts `heroBackgroundImageStorageId` and `aboutUsImageStorageId`

### 2. Admin Gallery Page - Partial Updates

- Added `generateUploadUrl` mutation hook
- Updated formData state to include `storageId`
- Updated settings state to include storage IDs
- Updated `handleSaveSettings` to save storage IDs
- Updated `openAddModal` and `openEditModal` to handle storage IDs

---

## 🔄 Remaining Changes Needed

### 3. Admin Gallery Page - Upload Handlers

Need to replace Cloudinary upload with Convex storage upload in these handlers:

#### Hero Background Image Upload (Line ~268):

```tsx
// CURRENT (Cloudinary):
const response = await fetch("/api/upload", {
  method: "POST",
  body: formData,
});
const data = await response.json();
setHeroBackgroundImage(data.url);

// CHANGE TO (Convex):
// Step 1: Get upload URL
const postUrl = await generateUploadUrl();

// Step 2: Upload file
const result = await fetch(postUrl, {
  method: "POST",
  headers: { "Content-Type": file.type },
  body: file,
});
const { storageId } = await result.json();

// Step 3: Get URL and save
const url = await getFileUrl({ storageId });
setHeroBackgroundImage(url || "");
setHeroBackgroundStorageId(storageId);
```

#### About Us Image Upload (Line ~330):

Same pattern as above - replace Cloudinary upload with Convex storage.

#### Gallery Image Upload in Modal (Line ~548):

```tsx
// CURRENT (Cloudinary):
const response = await fetch("/api/upload", {
  method: "POST",
  body: formDataUpload,
});
const data = await response.json();
setFormData({ ...formData, url: data.url });

// CHANGE TO (Convex):
const postUrl = await generateUploadUrl();
const result = await fetch(postUrl, {
  method: "POST",
  headers: { "Content-Type": file.type },
  body: file,
});
const { storageId } = await result.json();

// Get URL for preview
const url = await getFileUrl({ storageId });
setFormData({ ...formData, url: url || "", storageId });
```

### 4. Admin Products Page

Need to update `app/admin/products/page.tsx`:

#### Add File Storage Hooks:

```tsx
const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
```

#### Update Form Data State:

```tsx
const [formData, setFormData] = useState({
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  imageStorageId: undefined as Id<"_storage"> | undefined,
  images: [] as string[],
  imagesStorageIds: [] as Id<"_storage">[],
  imagePublicIds: [] as string[],
  featured: false,
  available: true,
});
```

#### Update Multiple Image Upload Handler (Line ~470):

```tsx
// CHANGE FROM Cloudinary loop TO Convex storage loop:
for (const file of files) {
  // Step 1: Generate upload URL
  const postUrl = await generateUploadUrl();

  // Step 2: Upload file
  const res = await fetch(postUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Upload failed");
  }

  const { storageId } = await res.json();
  uploadedStorageIds.push(storageId);
}

// Get URLs for preview
const urls = await Promise.all(
  uploadedStorageIds.map(async (id) => {
    const url = await getFileUrl({ storageId: id });
    return url || "";
  }),
);

setFormData({
  ...formData,
  image: mainImage || urls[0],
  images: [...formData.images, ...urls],
  imagesStorageIds: [...formData.imagesStorageIds, ...uploadedStorageIds],
});
```

#### Update handleSubmit to Save Storage IDs (Line ~145):

```tsx
const productData = {
  name: formData.name.trim(),
  slug: formData.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, ""),
  description: formData.description.trim() || undefined,
  price: parseFloat(formData.price),
  category: formData.category.trim(),
  image: formData.image.trim(),
  imageStorageId: formData.imageStorageId,
  images: formData.images.length > 0 ? formData.images : undefined,
  imagesStorageIds:
    formData.imagesStorageIds.length > 0
      ? formData.imagesStorageIds
      : undefined,
  featured: formData.featured,
  available: formData.available,
};
```

### 5. Product Display Pages

#### Customer Product Details Page

Need to fetch URLs from storage IDs when displaying product images:

```tsx
// In app/(customer)/shop/[slug]/page.tsx
// Add query to get URLs from storage IDs
const imageUrls = useQuery(
  api.fileStorage.getFileUrls,
  product?.imagesStorageIds ? { storageIds: product.imagesStorageIds } : "skip",
);

// Use imageUrls in the carousel instead of product.images
const displayImages = imageUrls || product?.images || [product?.image];
```

### 6. Gallery Page Display

#### Customer Gallery Page

Update to use storage IDs for image display:

```tsx
// In app/(customer)/gallery/page.tsx
// Images now have storageId field
// Convex automatically generates URLs via storage.getUrl() in queries
// OR manually query URLs:
const imageUrls = useQuery(
  api.fileStorage.getFileUrls,
  allImages
    ? {
        storageIds: allImages
          .map((img) => img.storageId)
          .filter(Boolean) as Id<"_storage">[],
      }
    : "skip",
);
```

### 7. Settings Page Display

#### Homepage Hero Section

Update to use storage ID from settings:

```tsx
// In app/(customer)/page.tsx
// Settings now includes heroBackgroundImageStorageId
// Query URL if storage ID exists
const heroImageUrl = useQuery(
  api.fileStorage.getFileUrl,
  settings?.heroBackgroundImageStorageId
    ? { storageId: settings.heroBackgroundImageStorageId }
    : "skip",
);
```

---

## 🎯 Benefits of Convex File Storage

1. **Built-in**: No external service dependencies
2. **Secure**: Automatic authentication with Convex
3. **Fast**: Files served from same infrastructure
4. **Simple**: No API keys or configuration needed
5. **Free**: Included with Convex plan
6. **Reliable**: Automatic backups and CDN delivery

---

## 📋 Migration Checklist

- [x] Create Convex file storage functions
- [x] Update schema for storage IDs
- [x] Update Convex mutations to accept storage IDs
- [x] Add storage hooks to admin gallery page
- [x] Update gallery form state
- [ ] Update hero image upload handler
- [ ] Update about us image upload handler
- [ ] Update gallery modal image upload handler
- [ ] Update admin products page hooks
- [ ] Update products form state
- [ ] Update products multi-image upload handler
- [ ] Update products handleSubmit
- [ ] Update product details page to fetch URLs
- [ ] Update customer gallery page to fetch URLs
- [ ] Update homepage hero to fetch URLs
- [ ] Test all upload flows
- [ ] Test all display pages
- [ ] Remove Cloudinary dependency (optional)

---

## 🚀 How File Upload Works with Convex

### 3-Step Process:

1. **Generate Upload URL** (from mutation):

   ```tsx
   const postUrl = await generateUploadUrl();
   // Returns: "https://your-convex-app.convex.cloud/api/storage/upload?token=..."
   ```

2. **Upload File** (direct to Convex):

   ```tsx
   const result = await fetch(postUrl, {
     method: "POST",
     headers: { "Content-Type": file.type },
     body: file,
   });
   const { storageId } = await result.json();
   // Returns: storage ID like "kg24kj2h4k2h4kh2k4h"
   ```

3. **Save Storage ID** (in your data):
   ```tsx
   await createProduct({
     name: "Product Name",
     imageStorageId: storageId,
     // ... other fields
   });
   ```

### Displaying Files:

**Option A**: Query URL in component:

```tsx
const imageUrl = useQuery(api.fileStorage.getFileUrl, { storageId });
return <img src={imageUrl || ""} />;
```

**Option B**: Get URL in Convex query:

```tsx
// In convex/products.ts
export const getProduct = query({
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    const imageUrl = product.imageStorageId
      ? await ctx.storage.getUrl(product.imageStorageId)
      : product.image;
    return { ...product, imageUrl };
  },
});
```

---

## ⚠️ Important Notes

1. **Backward Compatibility**: Keep existing URL fields populated for old data
2. **File Deletion**: When deleting products/images, also delete from storage:
   ```tsx
   if (product.imageStorageId) {
     await ctx.runMutation(api.fileStorage.deleteFile, {
       storageId: product.imageStorageId,
     });
   }
   ```
3. **File Types**: Convex supports all file types, not just images
4. **File Size**: Default limit is 1GB per file
5. **URLs**: Convex URLs expire after 1 hour, regenerate as needed

---

## 🔧 Next Steps

1. Complete the remaining upload handler updates in admin pages
2. Update all display components to fetch URLs from storage IDs
3. Test file upload and display flows
4. Consider removing `/api/upload` route (Cloudinary)
5. Remove Cloudinary environment variables
6. Update documentation

**Ready to continue with the implementation?**
