# Honey Foods - Technical Architecture

## Table of Contents

1. [System Overview](#system-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [API Architecture](#api-architecture)
6. [Payment Architecture](#payment-architecture)
7. [Frontend Architecture](#frontend-architecture)
8. [Security Considerations](#security-considerations)
9. [Development Phases](#development-phases)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Mobile     │  │   Desktop    │  │    Tablet    │      │
│  │   Browser    │  │   Browser    │  │   Browser    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Next.js App   │
                    │   (SSR + CSR)   │
                    └────────┬────────┘
                             │
          ┌──────────────────┴──────────────────┐
          │                                     │
┌─────────▼─────────┐              ┌───────────▼──────────┐
│   API Routes      │              │   External Services  │
│  (Next.js API)    │              │   - Cloudinary      │
│                   │◄─────────────┤   - Payment Gateway │
└─────────┬─────────┘              │   - Email Service   │
          │                        └─────────────────────┘
          │
┌─────────▼─────────┐
│   Database        │
│   (PostgreSQL)    │
│   via Prisma ORM  │
└───────────────────┘
```

### Core Principles

- **Mobile-First**: All designs and features prioritize mobile experience
- **Performance**: Fast load times, optimized images, minimal JavaScript
- **Security**: Secure authentication, payment verification, data protection
- **Scalability**: Modular architecture allowing for future enhancements
- **Maintainability**: Clean code, clear separation of concerns

---

## Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
  - Server-Side Rendering (SSR) for SEO
  - Server Components for performance
  - Client Components for interactivity
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**:
  - React Context for cart state
  - Zustand (optional for complex state)
- **Forms**: React Hook Form + Zod validation
- **Image Optimization**: Next.js Image component + Cloudinary
- **Icons**: Lucide React

### Backend

- **API**: Next.js API Routes (serverless)
- **ORM**: Prisma
- **Database**: PostgreSQL (Vercel Postgres or Supabase)
- **Authentication**: NextAuth.js v5 (for admin)
- **File Upload**: Cloudinary
- **Email**: Resend or SendGrid

### Payment Integration

- **Primary**: Apple Pay (via Stripe or Paystack)
- **Architecture**: Provider-based abstraction

### Development Tools

- **Version Control**: Git
- **Package Manager**: npm/pnpm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript

### Deployment

- **Platform**: Vercel (recommended)
- **CI/CD**: Vercel automatic deployments
- **Environment Variables**: Vercel Environment Variables

---

## Project Structure

```
honeyfoods/
├── app/                          # Next.js App Router
│   ├── (customer)/              # Customer-facing routes
│   │   ├── layout.tsx           # Customer layout with header/footer
│   │   ├── page.tsx             # Homepage
│   │   ├── shop/
│   │   │   ├── page.tsx         # Product listing
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Product detail
│   │   ├── cart/
│   │   │   └── page.tsx         # Shopping cart
│   │   ├── checkout/
│   │   │   └── page.tsx         # Checkout page
│   │   └── order/
│   │       └── [id]/
│   │           └── page.tsx     # Order confirmation
│   │
│   ├── (admin)/                 # Admin routes
│   │   ├── layout.tsx           # Admin layout with sidebar
│   │   ├── login/
│   │   │   └── page.tsx         # Admin login
│   │   └── dashboard/
│   │       ├── page.tsx         # Dashboard overview
│   │       ├── products/
│   │       │   ├── page.tsx     # Product list
│   │       │   ├── new/
│   │       │   │   └── page.tsx # Add product
│   │       │   └── [id]/
│   │       │       └── edit/
│   │       │           └── page.tsx # Edit product
│   │       └── orders/
│   │           ├── page.tsx     # Order list
│   │           └── [id]/
│   │               └── page.tsx # Order details
│   │
│   ├── api/                     # API Routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts     # NextAuth configuration
│   │   ├── products/
│   │   │   ├── route.ts         # GET all, POST new
│   │   │   └── [id]/
│   │   │       └── route.ts     # GET, PUT, DELETE product
│   │   ├── cart/
│   │   │   └── route.ts         # Cart operations
│   │   ├── orders/
│   │   │   ├── route.ts         # GET all, POST new
│   │   │   └── [id]/
│   │   │       └── route.ts     # GET, PUT order
│   │   ├── payment/
│   │   │   ├── create-intent/
│   │   │   │   └── route.ts     # Create payment intent
│   │   │   ├── verify/
│   │   │   │   └── route.ts     # Verify payment
│   │   │   └── webhook/
│   │   │       └── route.ts     # Payment webhooks
│   │   └── upload/
│   │       └── route.ts         # Image upload to Cloudinary
│   │
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
│
├── components/                   # Reusable components
│   ├── ui/                      # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── modal.tsx
│   │   └── ...
│   │
│   ├── customer/                # Customer-facing components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── product-card.tsx
│   │   ├── product-grid.tsx
│   │   ├── cart-item.tsx
│   │   ├── cart-summary.tsx
│   │   ├── checkout-form.tsx
│   │   └── apple-pay-button.tsx
│   │
│   ├── admin/                   # Admin components
│   │   ├── sidebar.tsx
│   │   ├── product-form.tsx
│   │   ├── product-table.tsx
│   │   ├── order-table.tsx
│   │   └── stats-card.tsx
│   │
│   └── shared/                  # Shared components
│       ├── image-upload.tsx
│       ├── loading-spinner.tsx
│       └── error-message.tsx
│
├── lib/                         # Utility libraries
│   ├── prisma.ts               # Prisma client
│   ├── auth.ts                 # NextAuth configuration
│   ├── validations/            # Zod schemas
│   │   ├── product.ts
│   │   ├── order.ts
│   │   └── checkout.ts
│   ├── utils.ts                # Helper functions
│   └── constants.ts            # App constants
│
├── services/                    # Business logic layer
│   ├── payment/                # Payment service abstraction
│   │   ├── payment-service.ts  # Main payment service
│   │   ├── providers/
│   │   │   ├── provider.interface.ts
│   │   │   ├── apple-pay-provider.ts
│   │   │   ├── stripe-provider.ts
│   │   │   └── paystack-provider.ts
│   │   └── payment-factory.ts
│   │
│   ├── product-service.ts      # Product business logic
│   ├── order-service.ts        # Order business logic
│   ├── email-service.ts        # Email notifications
│   └── image-service.ts        # Image upload/optimization
│
├── store/                       # State management
│   ├── cart-store.ts           # Cart state (Zustand or Context)
│   └── checkout-store.ts       # Checkout state
│
├── types/                       # TypeScript types
│   ├── product.ts
│   ├── order.ts
│   ├── cart.ts
│   └── payment.ts
│
├── hooks/                       # Custom React hooks
│   ├── use-cart.ts
│   ├── use-checkout.ts
│   ├── use-products.ts
│   └── use-apple-pay.ts
│
├── prisma/                      # Database
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Migration history
│   └── seed.ts                 # Seed data
│
├── public/                      # Static assets
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero.jpg
│   │   └── placeholder.jpg
│   └── favicon.ico
│
├── config/                      # Configuration files
│   ├── site.ts                 # Site metadata
│   └── brand.ts                # Brand colors/theme
│
├── .env                         # Environment variables (local)
├── .env.example                # Environment variables template
├── .eslintrc.json              # ESLint config
├── .prettierrc                 # Prettier config
├── next.config.ts              # Next.js config
├── tailwind.config.ts          # Tailwind config
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies
├── guideline.txt               # Project specification
├── ARCHITECTURE.md             # This file
└── README.md                   # Project documentation
```

---

## Database Schema

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Admin user model
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  passwordHash  String
  role          Role      @default(ADMIN)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  ADMIN
  SUPER_ADMIN
}

// Product model
model Product {
  id          String      @id @default(cuid())
  name        String
  slug        String      @unique
  description String?     @db.Text
  price       Decimal     @db.Decimal(10, 2)
  imageUrl    String
  imagePublicId String?   // Cloudinary public ID for deletion
  available   Boolean     @default(true)
  featured    Boolean     @default(false)
  category    String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  orderItems  OrderItem[]

  @@index([available, featured])
  @@index([slug])
}

// Order model
model Order {
  id              String        @id @default(cuid())
  orderNumber     String        @unique
  customerName    String
  customerEmail   String?
  customerPhone   String
  deliveryAddress String        @db.Text
  customNote      String?       @db.Text

  subtotal        Decimal       @db.Decimal(10, 2)
  deliveryFee     Decimal       @db.Decimal(10, 2) @default(0)
  total           Decimal       @db.Decimal(10, 2)

  status          OrderStatus   @default(PENDING)
  paymentStatus   PaymentStatus @default(PENDING)
  paymentMethod   String?

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  orderItems      OrderItem[]
  payment         Payment?

  @@index([orderNumber])
  @@index([status])
  @@index([paymentStatus])
  @@index([createdAt])
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PREPARING
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

// Order items (products in an order)
model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  productId String

  name      String   // Snapshot of product name
  price     Decimal  @db.Decimal(10, 2) // Snapshot of price at time of order
  quantity  Int
  subtotal  Decimal  @db.Decimal(10, 2)

  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Restrict)

  @@index([orderId])
  @@index([productId])
}

// Payment model
model Payment {
  id                String        @id @default(cuid())
  orderId           String        @unique

  amount            Decimal       @db.Decimal(10, 2)
  currency          String        @default("NGN")

  provider          String        // 'stripe', 'paystack', 'applepay'
  providerPaymentId String?       // Payment ID from provider
  providerMetadata  Json?         // Additional provider data

  status            PaymentStatus @default(PENDING)

  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  order             Order         @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId])
  @@index([providerPaymentId])
}
```

### Database Relationships

```
User (Admin)
  └─ No direct relations (authentication only)

Product
  └─ OrderItem (one-to-many)

Order
  ├─ OrderItem (one-to-many)
  └─ Payment (one-to-one)

OrderItem
  ├─ Order (many-to-one)
  └─ Product (many-to-one)

Payment
  └─ Order (one-to-one)
```

---

## API Architecture

### RESTful API Design

#### Products API

```typescript
// GET /api/products
// Get all products (with optional filtering)
Query params: ?available=true&featured=true&category=pastries
Response: Product[]

// GET /api/products/[id]
// Get single product
Response: Product

// POST /api/products
// Create new product (Admin only)
Body: { name, description, price, imageUrl, available, featured }
Response: Product

// PUT /api/products/[id]
// Update product (Admin only)
Body: Partial<Product>
Response: Product

// DELETE /api/products/[id]
// Delete product (Admin only)
Response: { success: boolean }
```

#### Orders API

```typescript
// GET /api/orders
// Get all orders (Admin only)
Query params: ?status=PENDING&paymentStatus=PAID&limit=20&offset=0
Response: { orders: Order[], total: number }

// GET /api/orders/[id]
// Get single order
Response: Order (with orderItems and payment)

// POST /api/orders
// Create new order
Body: {
  customerName: string
  customerEmail?: string
  customerPhone: string
  deliveryAddress: string
  customNote?: string
  items: { productId: string, quantity: number }[]
}
Response: Order

// PUT /api/orders/[id]
// Update order status (Admin only)
Body: { status?: OrderStatus, paymentStatus?: PaymentStatus }
Response: Order
```

#### Payment API

```typescript
// POST /api/payment/create-intent
// Create payment intent
Body: { orderId: string }
Response: { clientSecret: string, paymentIntentId: string }

// POST /api/payment/verify
// Verify payment status
Body: { orderId: string, paymentIntentId: string }
Response: { verified: boolean, order: Order }

// POST /api/payment/webhook
// Webhook for payment provider callbacks
Body: Provider-specific payload
Response: { received: boolean }
```

#### Upload API

```typescript
// POST /api/upload
// Upload image to Cloudinary (Admin only)
Body: FormData with image file
Response: { url: string, publicId: string }
```

#### Auth API

```typescript
// Handled by NextAuth.js
// POST /api/auth/signin
// POST /api/auth/signout
// GET /api/auth/session
```

### API Response Format

```typescript
// Success response
{
  success: true,
  data: T,
  message?: string
}

// Error response
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

---

## Payment Architecture

### Provider-Based Abstraction

```typescript
// services/payment/providers/provider.interface.ts
export interface PaymentProvider {
  name: string;

  // Create payment intent
  createPaymentIntent(params: CreatePaymentParams): Promise<PaymentIntent>;

  // Verify payment
  verifyPayment(paymentId: string): Promise<PaymentVerification>;

  // Handle webhook
  handleWebhook(payload: any, signature?: string): Promise<WebhookResult>;

  // Refund payment (optional)
  refundPayment?(paymentId: string, amount?: number): Promise<RefundResult>;
}

export interface CreatePaymentParams {
  amount: number;
  currency: string;
  orderId: string;
  metadata?: Record<string, any>;
}

export interface PaymentIntent {
  id: string;
  clientSecret?: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "succeeded" | "failed";
}

export interface PaymentVerification {
  verified: boolean;
  status: PaymentStatus;
  transactionId?: string;
  metadata?: any;
}

export interface WebhookResult {
  orderId: string;
  status: PaymentStatus;
  transactionId: string;
}
```

### Payment Service

```typescript
// services/payment/payment-service.ts
export class PaymentService {
  private provider: PaymentProvider;

  constructor(providerName: string) {
    this.provider = PaymentFactory.getProvider(providerName);
  }

  async processPayment(orderId: string): Promise<PaymentIntent> {
    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found");

    // Create payment intent
    const intent = await this.provider.createPaymentIntent({
      amount: Number(order.total) * 100, // Convert to cents
      currency: "NGN",
      orderId: order.id,
      metadata: {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
      },
    });

    // Store payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.total,
        currency: "NGN",
        provider: this.provider.name,
        providerPaymentId: intent.id,
        status: "PENDING",
      },
    });

    return intent;
  }

  async verifyPayment(
    orderId: string,
    paymentIntentId: string
  ): Promise<boolean> {
    const verification = await this.provider.verifyPayment(paymentIntentId);

    if (verification.verified) {
      // Update order and payment status
      await prisma.$transaction([
        prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "PAID",
            status: "CONFIRMED",
          },
        }),
        prisma.payment.update({
          where: { orderId },
          data: {
            status: "PAID",
            providerPaymentId: verification.transactionId,
          },
        }),
      ]);

      // Send confirmation email
      await EmailService.sendOrderConfirmation(orderId);
    }

    return verification.verified;
  }
}
```

### Apple Pay Provider Implementation

```typescript
// services/payment/providers/apple-pay-provider.ts
// This will integrate with Stripe or Paystack's Apple Pay implementation
export class ApplePayProvider implements PaymentProvider {
  name = "applepay";
  private stripe: Stripe; // or Paystack client

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }

  async createPaymentIntent(
    params: CreatePaymentParams
  ): Promise<PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency,
      payment_method_types: ["card"], // Apple Pay uses card payment method
      metadata: params.metadata,
    });

    return {
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret!,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: "pending",
    };
  }

  async verifyPayment(paymentId: string): Promise<PaymentVerification> {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);

    return {
      verified: paymentIntent.status === "succeeded",
      status: paymentIntent.status === "succeeded" ? "PAID" : "PENDING",
      transactionId: paymentIntent.id,
      metadata: paymentIntent.metadata,
    };
  }

  async handleWebhook(payload: any, signature: string): Promise<WebhookResult> {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      return {
        orderId: paymentIntent.metadata.orderId,
        status: "PAID",
        transactionId: paymentIntent.id,
      };
    }

    throw new Error("Webhook event not handled");
  }
}
```

---

## Frontend Architecture

### Component Architecture

```
App
├── RootLayout (app/layout.tsx)
│   ├── ThemeProvider
│   ├── SessionProvider (NextAuth)
│   └── CartProvider
│
├── CustomerLayout (app/(customer)/layout.tsx)
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── CartIcon (with badge)
│   ├── Main Content (children)
│   └── Footer
│       ├── Contact Info
│       ├── WhatsApp Link
│       └── Social Links
│
└── AdminLayout (app/(admin)/layout.tsx)
    ├── Sidebar
    │   ├── Dashboard Link
    │   ├── Products Link
    │   ├── Orders Link
    │   └── Logout Button
    └── Main Content (children)
```

### State Management Strategy

#### Cart State (React Context + LocalStorage)

```typescript
// store/cart-store.ts
interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Context provider with localStorage persistence
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setItems(JSON.parse(stored));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Cart operations...
};
```

#### Server State (React Server Components + SWR)

```typescript
// For client-side data fetching and caching
import useSWR from "swr";

export function useProducts() {
  const { data, error, mutate } = useSWR("/api/products", fetcher);

  return {
    products: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

// For server components (preferred)
export async function getProducts() {
  const products = await prisma.product.findMany({
    where: { available: true },
    orderBy: { createdAt: "desc" },
  });
  return products;
}
```

### Key Custom Hooks

```typescript
// hooks/use-cart.ts
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

// hooks/use-apple-pay.ts
export function useApplePay() {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    // Check if Apple Pay is available
    if (window.ApplePaySession) {
      setIsAvailable(ApplePaySession.canMakePayments());
    }
  }, []);

  const initiatePayment = async (orderId: string, amount: number) => {
    // Apple Pay implementation
  };

  return { isAvailable, initiatePayment };
}

// hooks/use-checkout.ts
export function useCheckout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const cart = useCart();

  const createOrder = async (customerInfo: CustomerInfo) => {
    // Create order and initiate payment
  };

  return { createOrder, isProcessing };
}
```

### Page Component Examples

```typescript
// app/(customer)/page.tsx - Homepage (Server Component)
export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true, available: true },
    take: 6,
  });

  return (
    <>
      <Hero />
      <FeaturedProducts products={featuredProducts} />
      <TrustSection />
    </>
  );
}

// app/(customer)/shop/page.tsx - Shop Page (Server Component)
export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { available: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Shop</h1>
      <ProductGrid products={products} />
    </div>
  );
}

// components/customer/product-card.tsx (Client Component)
("use client");

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product, 1);
    toast.success("Added to cart!");
  };

  return (
    <Card>
      <Image src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="text-honey-gold">₦{product.price}</p>
      <Button onClick={handleAddToCart}>Add to Cart</Button>
    </Card>
  );
}
```

---

## Security Considerations

### Authentication & Authorization

```typescript
// lib/auth.ts - NextAuth configuration
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials?.password ?? "",
          user.passwordHash
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};

// Middleware for protecting admin routes
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return session;
}
```

### API Security

```typescript
// Rate limiting
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

// Apply to API routes
const { success } = await ratelimit.limit(ip);
if (!success) {
  return Response.json({ error: "Too many requests" }, { status: 429 });
}

// Input validation with Zod
import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(1000).optional(),
  price: z.number().positive(),
  imageUrl: z.string().url(),
  available: z.boolean().default(true),
});

// In API route
const body = await request.json();
const validated = createProductSchema.parse(body);
```

### Payment Security

- All payment processing via HTTPS
- Payment verification on server-side only
- Webhook signature verification
- No sensitive payment data stored locally
- PCI compliance through payment provider

### Environment Variables

```bash
# .env.example
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Payment
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Image Upload
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Email
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@honeyfoods.com"

# Admin
ADMIN_EMAIL="admin@honeyfoods.com"
ADMIN_PASSWORD="..." # For initial setup only
```

---

## Development Phases

### Phase 1: Foundation (Week 1-2)

**Goal**: Set up project infrastructure and basic UI

- ✅ Initialize Next.js project with TypeScript
- ✅ Configure Tailwind CSS with brand colors
- ✅ Set up Prisma with PostgreSQL
- ✅ Create database schema
- ✅ Design and implement UI component library
- ✅ Create customer layout (header, footer)
- ✅ Create admin layout (sidebar, navigation)
- ✅ Implement responsive navigation
- ✅ Set up environment variables

**Deliverables**:

- Working dev environment
- Database connected
- Basic page layouts
- Component library ready

### Phase 2: Product Management (Week 3)

**Goal**: Enable product CRUD operations

- Admin authentication with NextAuth
- Product API endpoints
- Product listing page (admin)
- Create product form with image upload
- Edit product functionality
- Delete product with confirmation
- Product availability toggle
- Cloudinary integration for images

**Deliverables**:

- Admin can manage products
- Images stored on Cloudinary
- Products visible in admin dashboard

### Phase 3: Customer Shopping Experience (Week 4)

**Goal**: Build customer-facing pages

- Homepage with hero and featured products
- Shop page with product grid
- Product detail page
- Cart functionality (Context + localStorage)
- Cart page with quantity management
- Responsive product cards
- Image optimization

**Deliverables**:

- Customers can browse products
- Functional shopping cart
- Mobile-optimized experience

### Phase 4: Checkout & Payment (Week 5-6)

**Goal**: Complete payment integration

- Checkout page design
- Payment service abstraction layer
- Apple Pay provider implementation
- Stripe/Paystack integration
- Order creation API
- Payment verification
- Payment webhook handling
- Order confirmation page

**Deliverables**:

- Working checkout flow
- Apple Pay functional on iOS
- Orders stored in database
- Payment verification working

### Phase 5: Order Management (Week 7)

**Goal**: Admin order management

- Order listing page (admin)
- Order detail page with customer info
- Order status management
- Payment status display
- Order filtering and search
- Order statistics dashboard

**Deliverables**:

- Admin can view all orders
- Admin can update order status
- Basic analytics visible

### Phase 6: Notifications & Polish (Week 8)

**Goal**: Email notifications and final touches

- Order confirmation email (customer)
- Order notification email (admin)
- WhatsApp integration for support
- Loading states and error handling
- Form validation improvements
- SEO optimization
- Performance optimization
- Mobile testing and refinement

**Deliverables**:

- Email notifications working
- Polished user experience
- SEO optimized
- Production-ready

### Phase 7: Testing & Deployment (Week 9)

**Goal**: Launch production version

- End-to-end testing
- Mobile device testing (iOS focus)
- Payment testing in production mode
- Performance audit
- Security review
- Deploy to Vercel
- Set up custom domain
- Configure production environment variables
- Monitor initial orders

**Deliverables**:

- Live production website
- All features tested
- Monitoring in place

### Phase 8: Post-Launch (Week 10+)

**Goal**: Monitor and iterate

- Monitor order flow
- Collect user feedback
- Fix bugs
- Optimize based on real usage
- Plan future enhancements

---

## Performance Optimization

### Image Optimization

- Use Next.js `<Image>` component
- Cloudinary automatic format conversion (WebP/AVIF)
- Lazy loading for images below fold
- Responsive images with multiple sizes

### Code Splitting

- Automatic with Next.js App Router
- Dynamic imports for heavy components
- Separate admin bundle from customer bundle

### Caching Strategy

- Static pages cached at edge (Vercel Edge Network)
- API responses cached with SWR
- Product images cached with CDN
- Database query optimization with indexes

### Bundle Size

- Tree shaking with ES modules
- Minimal dependencies
- Code splitting by route
- Target: < 200KB initial JS bundle

---

## Monitoring & Analytics

### Error Tracking

- Sentry for error monitoring
- Log errors in production
- Alert on payment failures

### Analytics

- Google Analytics or Plausible
- Track: page views, add to cart, checkout, purchase
- No PII tracking

### Performance Monitoring

- Vercel Analytics
- Core Web Vitals tracking
- API response time monitoring

---

## Future Enhancements (Post-MVP)

### Phase 2 Features

- Customer order tracking (via order number)
- SMS notifications
- Multiple payment methods
- Product categories and filtering
- Product search
- Related products
- Discount codes

### Phase 3 Features

- Customer accounts
- Order history
- Favorites/wishlist
- Product reviews
- Loyalty program
- Scheduled deliveries

### Admin Enhancements

- Advanced analytics
- Inventory management
- Bulk product upload
- Customer management
- Export orders to CSV
- Sales reports

---

## Conclusion

This architecture provides a solid foundation for Honey Foods e-commerce platform with:

✅ **Scalability**: Modular structure allows easy feature additions
✅ **Performance**: Optimized for fast load times and smooth UX
✅ **Security**: Best practices for authentication and payment handling
✅ **Maintainability**: Clean separation of concerns, TypeScript safety
✅ **Extensibility**: Payment abstraction allows multiple providers
✅ **Mobile-First**: Responsive design prioritizing mobile experience

The architecture balances simplicity with best practices, avoiding over-engineering while maintaining professional standards suitable for a production e-commerce platform.

---

**Last Updated**: December 17, 2025
**Version**: 1.0
**Status**: Ready for Development
