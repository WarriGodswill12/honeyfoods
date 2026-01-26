# Convex Migration Summary

## ✅ Completed Steps

### 1. Convex Setup

- ✅ Initialized Convex project (npx convex dev)
- ✅ Created complete schema matching Prisma models (7 tables)
- ✅ Created query and mutation functions for all tables
- ✅ Integrated ConvexAuthProvider in app layout
- ✅ Installed and configured @convex-dev/auth

### 2. Authentication

- ✅ Set up Convex Auth with Password provider
- ✅ Created auth.config.ts with password authentication
- ✅ Created HTTP routes for auth endpoints
- ✅ Updated ConvexClientProvider to use ConvexAuthProvider
- ✅ Created auth helper functions (signUpAdmin, getCurrentUser, isAdmin)

### 3. Data Migration

- ✅ Created seed functions for products, settings, and admin user
- ✅ Created /seed page for easy database seeding
- ✅ All 24 products from your list ready to be seeded

## 📋 Next Steps

### 1. Seed Your Database

1. Visit http://localhost:3000/seed
2. Click "Run Seed" to populate your database with:
   - 24 products (all rice dishes, proteins, pastries, cakes)
   - Default settings (£5 delivery fee)
   - Admin user (admin@honeyfoods.com / admin123)

### 2. Update Components to Use Convex

The following components need to be updated to call Convex directly:

#### Shop/Product Pages

- `app/(customer)/shop/page.tsx` - Use `useQuery(api.products.getProducts)`
- `app/(customer)/shop/[slug]/page.tsx` - Use `useQuery(api.products.getProductBySlug)`

#### Cart & Checkout

- `app/(customer)/cart/page.tsx` - Use `useQuery(api.products.getProductsByIds)`
- `app/(customer)/checkout/page.tsx` - Use `useMutation(api.orders.createOrder)`
- `components/customer/payment-form.tsx` - Update to use Convex mutations

#### Gallery

- `app/(customer)/gallery/page.tsx` - Use `useQuery(api.gallery.getGalleryImages)`
- `app/admin/gallery/page.tsx` - Use Convex hooks for CRUD operations

#### Admin Pages

- `app/admin/products/page.tsx` - Use `useQuery(api.products.getProducts)` and `useMutation`
- `app/admin/orders/page.tsx` - Use `useQuery(api.orders.getOrders)`
- `app/admin/orders/[id]/page.tsx` - Use `useQuery(api.orders.getOrderById)`
- `app/admin/settings/page.tsx` - Use `useQuery(api.settings.getSettings)`
- `app/admin/login/page.tsx` - Use Convex Auth hooks

### 3. Remove API Routes

After components are updated, delete these API route files:

- `app/api/products/route.ts`
- `app/api/products/[id]/route.ts`
- `app/api/orders/route.ts`
- `app/api/orders/[id]/route.ts`
- `app/api/orders/create/route.ts`
- `app/api/gallery/route.ts`
- `app/api/gallery/[id]/route.ts`
- `app/api/gallery/featured/route.ts`
- `app/api/settings/route.ts`
- `app/api/auth/[...nextauth]/route.ts` (replaced by Convex Auth)

### 4. Update Stripe Integration

- Keep `app/api/payment/create-intent/route.ts` for Stripe
- Keep `app/api/payment/verify/route.ts` for Stripe
- Keep `app/api/payment/webhook/route.ts` for Stripe webhooks
- Update these to call Convex mutations instead of Prisma

### 5. Clean Up Prisma

- Remove `prisma/` folder
- Remove `lib/prisma.ts`
- Remove `lib/auth.ts` (NextAuth config)
- Update `package.json` to remove:
  - `@prisma/client`
  - `prisma` devDependency
  - `next-auth` (replaced by Convex Auth)
- Remove Prisma scripts from `package.json`

## 🔐 Authentication Changes

### Old (NextAuth):

```typescript
import { getServerSession } from "next-auth";
const session = await getServerSession();
```

### New (Convex Auth):

```typescript
import { useAuthActions } from "@convex-dev/auth/react";

// In client components:
const { signIn, signOut } = useAuthActions();

// Sign in
await signIn("password", {
  email: "admin@honeyfoods.com",
  password: "admin123",
});

// Sign out
await signOut();

// Check auth state
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const currentUser = useQuery(api.auth.getCurrentUser);
const isAdmin = useQuery(api.auth.isAdmin);
```

## 📊 Data Access Patterns

### Old (API Routes):

```typescript
const res = await fetch("/api/products");
const products = await res.json();
```

### New (Direct Convex):

```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// Query
const products = useQuery(api.products.getProducts, {
  available: true,
  limit: 10,
});

// Mutation
const createProduct = useMutation(api.products.createProduct);
await createProduct({
  name: "New Product",
  slug: "new-product",
  price: 1500,
  // ...
});
```

## 🗂️ Convex Functions Reference

### Products

- `api.products.getProducts` - List products with filters
- `api.products.getProductById` - Get single product by ID
- `api.products.getProductBySlug` - Get product by slug
- `api.products.getProductsByIds` - Get multiple products (for cart)
- `api.products.createProduct` - Create new product
- `api.products.updateProduct` - Update product
- `api.products.deleteProduct` - Delete product

### Orders

- `api.orders.getOrders` - List orders with filters
- `api.orders.getOrderById` - Get order with items
- `api.orders.getOrderByNumber` - Get order by order number
- `api.orders.getOrderStats` - Get revenue and stats
- `api.orders.createOrder` - Create new order
- `api.orders.updateOrderStatus` - Update order status
- `api.orders.updatePaymentStatus` - Update payment status

### Gallery

- `api.gallery.getGalleryImages` - List gallery images
- `api.gallery.getFeaturedGalleryImages` - Get featured images
- `api.gallery.getGalleryImageById` - Get single image
- `api.gallery.createGalleryImage` - Create image
- `api.gallery.updateGalleryImage` - Update image
- `api.gallery.deleteGalleryImage` - Delete image

### Settings

- `api.settings.getSettings` - Get settings (singleton)
- `api.settings.updateSettings` - Update settings

### Users

- `api.users.getUserByEmail` - Get user by email
- `api.users.getUserById` - Get user by ID
- `api.users.getAdminUsers` - List all admins
- `api.users.createUser` - Create new admin user
- `api.users.updateUser` - Update user
- `api.users.deleteUser` - Delete user

### Auth

- `api.auth.signUpAdmin` - Register admin user
- `api.auth.getCurrentUser` - Get authenticated user
- `api.auth.isAdmin` - Check if user is admin

### Payments

- `api.payments.getPaymentByOrderId` - Get payment for order
- `api.payments.getPaymentByProviderPaymentId` - Get payment by Stripe ID
- `api.payments.createPayment` - Create payment record
- `api.payments.updatePaymentStatus` - Update payment status

### Seed

- `api.seed.seedProducts` - Seed all 24 products
- `api.seed.seedAdminUser` - Create admin user
- `api.seed.seedSettings` - Create default settings

## 🚀 Running the Project

1. **Start Convex Dev Server:**

   ```bash
   npx convex dev
   ```

2. **Start Next.js:**

   ```bash
   npm run dev
   ```

3. **Seed Database:**
   Visit http://localhost:3000/seed and click "Run Seed"

4. **Test Admin Login:**
   - Go to http://localhost:3000/admin/login
   - Email: admin@honeyfoods.com
   - Password: admin123

## 📝 Important Notes

- **Prices:** All prices stored as integers in pence (1500 = £15.00)
- **Images:** Using Unsplash placeholders initially, can be replaced via admin
- **Delivery Fee:** Default £5.00 (500 pence), configurable in settings
- **Order Numbers:** Auto-generated with format "HF-{timestamp}-{random}"
- **Authentication:** Convex Auth is more secure and native than NextAuth integration
- **Real-time:** All Convex queries are reactive - UI updates automatically when data changes!

## ⚠️ Security Checklist

- [ ] Change default admin password after first login
- [ ] Add rate limiting to auth endpoints (Convex Auth built-in)
- [ ] Set up proper password hashing (TODO in seed.ts)
- [ ] Add CSRF protection for mutations
- [ ] Configure CORS for production
- [ ] Set up environment variables properly
- [ ] Enable Convex Auth email verification
- [ ] Add admin role checks to all admin mutations

## 🎯 Benefits of Convex

1. **Type Safety:** Full TypeScript support with generated types
2. **Real-time:** Automatic subscriptions - no manual polling
3. **Offline:** Built-in optimistic updates and offline support
4. **Security:** Row-level security and authentication built-in
5. **Simplicity:** No API routes needed - call functions directly
6. **Performance:** Automatic caching and query optimization
7. **Developer Experience:** Better errors, testing, and debugging
