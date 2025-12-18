# Phase 2 Setup Instructions

## Database Setup

Before you can use the admin features, you need to set up your PostgreSQL database:

### 1. Start Your Database Server

Make sure your PostgreSQL server is running at `localhost:51214` (as configured in your `.env` file).

If you're using XAMPP, you may need to:

- Start the PostgreSQL service
- Or update the `DATABASE_URL` in `.env` to point to your correct database port

### 2. Run Database Migrations

Once your database server is running, execute:

```bash
npx prisma migrate dev --name init
```

This will create all the necessary tables (User, Product, Order, OrderItem, Payment).

### 3. Seed the Database

Populate the database with an admin user and sample products:

```bash
npx prisma db seed
```

This will create:

- **Admin User**:
  - Email: `admin@honeyfoods.com`
  - Password: `admin123`
- **Sample Products**: 3 products (Chocolate Cake, Vanilla Cupcakes, Croissant)

## Admin Features

Once the database is set up, you can access:

### Admin Login

- URL: `/admin/login`
- Credentials: `admin@honeyfoods.com` / `admin123`

### Admin Dashboard

After logging in, you'll have access to:

- **Dashboard**: Overview with stats and recent orders
- **Products**: Full CRUD management (Create, Read, Update, Delete)
- **Orders**: View all orders (Phase 5 will add full order management)
- **Settings**: Store configuration (placeholder for now)

## Product Management Features

The Products page includes:

- ✅ Add new products with name, description, price, category, image
- ✅ Edit existing products
- ✅ Delete products (with protection for products with orders)
- ✅ Mark products as featured
- ✅ Toggle product availability
- ✅ Search/filter products
- ✅ Product images with fallback placeholder

## API Endpoints

Created REST API routes:

### Products

- `GET /api/products` - Get all products (with optional filters)
- `POST /api/products` - Create new product (Admin only)
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product (Admin only)
- `DELETE /api/products/[id]` - Delete product (Admin only)

### Authentication

- `POST /api/auth/signin` - Admin login via NextAuth
- `POST /api/auth/signout` - Admin logout

## Next Steps

After database setup is complete:

1. Test admin login at `/admin/login`
2. Add some products through the admin interface
3. View products on the customer shop page (`/shop`)
4. Test the shopping cart functionality

The shop page will now display real products from the database instead of placeholder data!

## Troubleshooting

### Database Connection Error

If you see `P1001: Can't reach database server`, check:

- Is PostgreSQL running?
- Is the port correct in `.env`?
- Is the database created?

### Admin Login Not Working

- Make sure you ran the seed script
- Password is `admin123` (case-sensitive)
- Check browser console for errors
