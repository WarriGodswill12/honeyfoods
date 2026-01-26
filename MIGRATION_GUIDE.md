# Quick API Migration Guide

## Migration Pattern

### 1. Update Imports

```typescript
// OLD
import { prisma } from "@/lib/prisma";

// NEW
import { convexClient, api } from "@/lib/convex-server";
```

### 2. Common Conversions

#### Get All

```typescript
// OLD
const products = await prisma.product.findMany();

// NEW
const products = await convexClient.query(api.products.getProducts);
```

#### Get by ID

```typescript
// OLD
const product = await prisma.product.findUnique({
  where: { id },
});

// NEW
const product = await convexClient.query(api.products.getProductById, {
  id,
});
```

#### Get with Filter

```typescript
// OLD
const orders = await prisma.order.findMany({
  where: { status: "pending" },
});

// NEW
const orders = await convexClient.query(api.orders.getOrders, {
  status: "pending",
});
```

#### Create

```typescript
// OLD
const newProduct = await prisma.product.create({
  data: {
    name: "Test",
    price: 1500,
    // ...
  },
});

// NEW
const productId = await convexClient.mutation(api.products.createProduct, {
  name: "Test",
  price: 1500,
  // ...
});
```

#### Update

```typescript
// OLD
const updated = await prisma.product.update({
  where: { id },
  data: { name: "New Name" },
});

// NEW
await convexClient.mutation(api.products.updateProduct, {
  id,
  name: "New Name",
});
```

#### Delete

```typescript
// OLD
await prisma.product.delete({ where: { id } });

// NEW
await convexClient.mutation(api.products.deleteProduct, { id });
```

### 3. Field Name Updates

After getting data from Convex, update field references:

```typescript
// OLD
const orderId = order.id;
const productPrice = product.id;

// NEW
const orderId = order._id;
const productPrice = product._id;
```

## Available Convex Functions

### Products (`api.products.*`)

- `getProducts()` - Get all products
- `getProductById({ id })` - Get single product
- `getProductBySlug({ slug })` - Get product by slug
- `getProductsByIds({ ids })` - Get multiple products by IDs
- `createProduct({ ...data })` - Create new product
- `updateProduct({ id, ...data })` - Update product
- `deleteProduct({ id })` - Delete product

### Orders (`api.orders.*`)

- `getOrders({ status? })` - Get all orders (optional status filter)
- `getOrderById({ id })` - Get single order
- `getOrderByNumber({ orderNumber })` - Get order by number
- `getOrderStats()` - Get order statistics
- `createOrder({ ...data })` - Create new order
- `updateOrderStatus({ id, status })` - Update order status
- `updatePaymentStatus({ id, paymentStatus })` - Update payment status

### Payments (`api.payments.*`)

- `getPayments()` - Get all payments
- `getPaymentById({ id })` - Get single payment
- `getPaymentByOrderId({ orderId })` - Get payment for order
- `getPaymentByStripeId({ stripePaymentIntentId })` - Get payment by Stripe ID
- `createPayment({ ...data })` - Create new payment
- `updatePayment({ id, ...data })` - Update payment

### Gallery (`api.gallery.*`)

- `getGalleryImages({ type? })` - Get gallery images (optional type filter)
- `getFeaturedGalleryImages()` - Get featured images only
- `getGalleryImageById({ id })` - Get single image
- `createGalleryImage({ ...data })` - Create new image
- `updateGalleryImage({ id, ...data })` - Update image
- `deleteGalleryImage({ id })` - Delete image

### Settings (`api.settings.*`)

- `getSettings()` - Get application settings
- `updateSettings({ ...data })` - Update settings

### Users (`api.users.*`)

- `getUserByEmail({ email })` - Get user by email
- `getUserById({ id })` - Get user by ID
- `createUser({ ...data })` - Create new user
- `updateUser({ id, ...data })` - Update user

## Quick Migration Checklist

For each API route:

1. [ ] Update imports (prisma → convexClient)
2. [ ] Replace `prisma.*` calls with `convexClient.query/mutation`
3. [ ] Update field references (id → \_id)
4. [ ] Test the endpoint
5. [ ] Check error handling
6. [ ] Update any TypeScript types if needed

## Example: Full Route Migration

### Before (Prisma)

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const products = await prisma.product.findMany({
      where: { inStock: true },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
```

### After (Convex)

```typescript
import { NextResponse } from "next/server";
import { convexClient, api } from "@/lib/convex-server";

export async function GET(req: Request) {
  try {
    const products = await convexClient.query(api.products.getProducts);

    // Filter in-stock products (or add filter to Convex function)
    const inStock = products.filter((p) => p.inStock);

    return NextResponse.json(inStock);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
```

## Tips

1. **Handle Includes**: Prisma's `include` needs separate queries in Convex

   ```typescript
   // Prisma
   const order = await prisma.order.findUnique({
     where: { id },
     include: { items: true },
   });

   // Convex - two separate queries
   const order = await convexClient.query(api.orders.getOrderById, { id });
   const items = await convexClient.query(api.orderItems.getByOrderId, {
     orderId: order._id,
   });
   ```

2. **Batch Operations**: Use `getProductsByIds` instead of multiple individual queries

3. **Error Handling**: Convex throws errors, so try/catch works the same way

4. **TypeScript**: Import types from convex schema if needed:

   ```typescript
   import { Id } from "@/convex/_generated/dataModel";
   ```

5. **Testing**: Use Convex dashboard to test queries directly at:
   https://cool-wolverine-454.convex.cloud

## Need Help?

Check these files for examples:

- ✅ `app/api/orders/create/route.ts` (complex multi-step order creation)
- ✅ `app/api/payment/create-intent/route.ts` (payment processing)
- ✅ `app/api/products/route.ts` (GET method - simple query)

See `CONVEX_MIGRATION_COMPLETE.md` for full status and `API_MIGRATION_STATUS.md` for detailed route-by-route breakdown.
