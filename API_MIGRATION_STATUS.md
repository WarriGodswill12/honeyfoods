# API Routes Migration Status

## ✅ Completed Migrations

### Orders

- **[app/api/orders/create/route.ts](app/api/orders/create/route.ts)** ✅
  - Updated to use `convexClient.query(api.products.getProductsByIds)`
  - Updated to use `convexClient.query(api.settings.getSettings)`
  - Updated to use `convexClient.mutation(api.orders.createOrder)`

### Payments

- **[app/api/payment/create-intent/route.ts](app/api/payment/create-intent/route.ts)** ✅
  - Updated to use `convexClient.query(api.orders.getOrderById)`
  - Updated to use `convexClient.mutation(api.payments.createPayment)`

### Products

- **[app/api/products/route.ts](app/api/products/route.ts)** ✅ (GET only)
  - Updated GET to use `convexClient.query(api.products.getProducts)`

## 🔨 Needs Migration

### Products (remaining methods)

- **[app/api/products/route.ts](app/api/products/route.ts)** - POST method
  - Lines 77-88: Check slug uniqueness with `prisma.product.findUnique`
  - Line 88: Create product with `prisma.product.create`
  - **Action**: Use `convexClient.mutation(api.products.createProduct)`

- **[app/api/products/[id]/route.ts](app/api/products/[id]/route.ts)** - All methods
  - Line 14: GET product with `prisma.product.findUnique`
  - Lines 51-79: PUT product with slug validation
  - Lines 119-142: DELETE product with order validation
  - **Action**: Use corresponding Convex functions

- **[app/api/products/clear/route.ts](app/api/products/clear/route.ts)**
  - Lines 16-29: Check orders and delete products
  - **Action**: Use Convex queries/mutations

### Orders

- **[app/api/orders/route.ts](app/api/orders/route.ts)** - GET method
  - Line 28: Get orders with `prisma.order.findMany`
  - Lines 49-61: Get order stats with `prisma.order.aggregate`
  - **Action**: Use `api.orders.getOrders` and `api.orders.getOrderStats`

- **[app/api/orders/[id]/route.ts](app/api/orders/[id]/route.ts)** - All methods
  - Line 21: GET order with `prisma.order.findUnique`
  - Line 126: PUT update order with `prisma.order.update`
  - **Action**: Use `api.orders.getOrderById` and `api.orders.updateOrderStatus`

### Gallery

- **[app/api/gallery/route.ts](app/api/gallery/route.ts)**
  - Line 13: GET images with `prisma.galleryImage.findMany`
  - Line 55: POST create image with `prisma.galleryImage.create`
  - **Action**: Use `api.gallery.getGalleryImages` and `api.gallery.createGalleryImage`

- **[app/api/gallery/[id]/route.ts](app/api/gallery/[id]/route.ts)**
  - Line 14: GET image with `prisma.galleryImage.findUnique`
  - Line 54: PUT update image with `prisma.galleryImage.update`
  - Line 92: DELETE image with `prisma.galleryImage.delete`
  - **Action**: Use corresponding Convex gallery functions

- **[app/api/gallery/featured/route.ts](app/api/gallery/featured/route.ts)**
  - Line 7: GET featured images with `prisma.galleryImage.findMany`
  - **Action**: Use `api.gallery.getFeaturedGalleryImages`

### Settings

- **[app/api/settings/route.ts](app/api/settings/route.ts)**
  - Lines 9-13: GET settings with `prisma.settings.findFirst`
  - Lines 61-68: PUT update settings with `prisma.settings.update`
  - **Action**: Use `api.settings.getSettings` and `api.settings.updateSettings`

### Payment (remaining)

- **[app/api/payment/verify/route.ts](app/api/payment/verify/route.ts)** - Likely needs Convex
- **[app/api/payment/webhook/route.ts](app/api/payment/webhook/route.ts)** - Stripe webhook handler

## 📋 Migration Helper Code

### Example: Converting GET requests

```typescript
// OLD (Prisma)
const products = await prisma.product.findMany({
  where: { available: true },
  orderBy: { createdAt: "desc" },
});

// NEW (Convex)
import { convexClient, api } from "@/lib/convex-server";

const products = await convexClient.query(api.products.getProducts, {
  available: true,
});
```

### Example: Converting POST/PUT requests

```typescript
// OLD (Prisma)
const product = await prisma.product.create({
  data: { name, slug, price, ... }
});

// NEW (Convex)
const productId = await convexClient.mutation(api.products.createProduct, {
  name, slug, price, ...
});
```

### Example: Converting DELETE requests

```typescript
// OLD (Prisma)
await prisma.product.delete({
  where: { id: productId },
});

// NEW (Convex)
await convexClient.mutation(api.products.deleteProduct, {
  productId,
});
```

## 🎯 Priority Order

1. **HIGH PRIORITY** (Core functionality):
   - ✅ `app/api/orders/create/route.ts` - DONE
   - ✅ `app/api/payment/create-intent/route.ts` - DONE
   - `app/api/payment/verify/route.ts` - TODO
   - `app/api/payment/webhook/route.ts` - TODO

2. **MEDIUM PRIORITY** (Admin features):
   - `app/api/products/route.ts` POST method
   - `app/api/products/[id]/route.ts` all methods
   - `app/api/orders/route.ts`
   - `app/api/orders/[id]/route.ts`
   - `app/api/settings/route.ts`

3. **LOW PRIORITY** (Nice to have):
   - `app/api/gallery/**` routes
   - `app/api/products/clear/route.ts`

## 🔧 Quick Migration Steps

For each remaining route:

1. Import Convex client:

   ```typescript
   import { convexClient, api } from "@/lib/convex-server";
   ```

2. Replace `prisma.*` calls with `convexClient.query()` or `convexClient.mutation()`

3. Update field names:
   - Prisma: `id`, `createdAt`, `updatedAt`
   - Convex: `_id`, `_creationTime`, `createdAt`, `updatedAt`

4. Test the endpoint

## 📊 Statistics

- **Total API Routes**: 15
- **✅ Completed**: 3 (20%)
- **🔨 Remaining**: 12 (80%)

Most critical routes (orders, payments) are done! The remaining routes are mostly admin features.
