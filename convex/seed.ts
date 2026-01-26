import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Seed products data
export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const products = [
      // 1 Litre Bowl Rice
      {
        name: "Jollof Rice - 1 Litre Bowl",
        slug: "jollof-rice-1l",
        description: "Delicious 1 litre bowl of our signature Jollof Rice",
        price: 1500,
        image:
          "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop",
        available: true,
        featured: true,
        category: "Nigerian Foods",
      },
      {
        name: "Fried Rice - 1 Litre Bowl",
        slug: "fried-rice-1l",
        description: "Flavorful 1 litre bowl of Fried Rice",
        price: 1700,
        image:
          "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop",
        available: true,
        featured: true,
        category: "Nigerian Foods",
      },
      {
        name: "Coconut Rice - 1 Litre Bowl",
        slug: "coconut-rice-1l",
        description: "Aromatic 1 litre bowl of Coconut Rice",
        price: 2000,
        image:
          "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=400&fit=crop",
        available: true,
        featured: true,
        category: "Nigerian Foods",
      },
      // 2 Litres Rice
      {
        name: "Jollof Rice - 2 Litres",
        slug: "jollof-rice-2l",
        description: "Large 2 litres bowl of our signature Jollof Rice",
        price: 3000,
        image:
          "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop",
        available: true,
        featured: false,
        category: "Nigerian Foods",
      },
      {
        name: "Fried Rice - 2 Litres",
        slug: "fried-rice-2l",
        description: "Large 2 litres bowl of Fried Rice",
        price: 3200,
        image:
          "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop",
        available: true,
        featured: false,
        category: "Nigerian Foods",
      },
      {
        name: "Coconut Rice - 2 Litres",
        slug: "coconut-rice-2l",
        description: "Large 2 litres bowl of Coconut Rice",
        price: 3500,
        image:
          "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=400&fit=crop",
        available: true,
        featured: false,
        category: "Nigerian Foods",
      },
      // Proteins
      {
        name: "Turkey - 5 Pieces",
        slug: "turkey-5pcs",
        description: "Perfectly seasoned turkey, 5 pieces",
        price: 2000,
        image:
          "https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=400&h=400&fit=crop",
        available: true,
        featured: false,
        category: "Nigerian Foods",
      },
      {
        name: "Chicken - 5 Pieces",
        slug: "chicken-5pcs",
        description: "Juicy grilled chicken, 5 pieces",
        price: 1500,
        image:
          "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=400&fit=crop",
        available: true,
        featured: false,
        category: "Nigerian Foods",
      },
      {
        name: "Fish - 5 Pieces",
        slug: "fish-5pcs",
        description: "Fresh fish, 5 pieces",
        price: 1500,
        image:
          "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=400&fit=crop",
        available: true,
        featured: false,
        category: "Nigerian Foods",
      },
      // Regular Pastries
      {
        name: "Meat Pie (Regular)",
        slug: "meat-pie-regular",
        description: "£2 each - Minimum order 6 pieces",
        price: 200,
        image:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
        available: true,
        featured: false,
        category: "Pastries",
      },
      {
        name: "Fish Roll (Regular)",
        slug: "fish-roll-regular",
        description: "£2 each - Minimum order 6 pieces",
        price: 200,
        image:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
        available: true,
        featured: false,
        category: "Pastries",
      },
      {
        name: "Chicken Pie (Regular)",
        slug: "chicken-pie-regular",
        description: "£2 each - Minimum order 6 pieces",
        price: 200,
        image:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
        available: true,
        featured: false,
        category: "Pastries",
      },
      // Mini Pastries
      {
        name: "Mini Meat Pie",
        slug: "mini-meat-pie",
        description: "£1.50 each - Minimum order 8 pieces",
        price: 150,
        image:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
        available: true,
        featured: false,
        category: "Pastries",
      },
      {
        name: "Mini Chicken Pie",
        slug: "mini-chicken-pie",
        description: "£1.50 each - Minimum order 8 pieces",
        price: 150,
        image:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
        available: true,
        featured: false,
        category: "Pastries",
      },
      // Puff Puff
      {
        name: "Puff Puff - Single",
        slug: "puff-puff-single",
        description: "£0.50 each",
        price: 50,
        image:
          "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
        available: true,
        featured: false,
        category: "Pastries",
      },
      {
        name: "Puff Puff - 15 Pieces",
        slug: "puff-puff-15pcs",
        description: "Pack of 15 puff puff",
        price: 700,
        image:
          "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
        available: true,
        featured: false,
        category: "Pastries",
      },
      {
        name: "Puff Puff - 30 Pieces",
        slug: "puff-puff-30pcs",
        description: "Pack of 30 puff puff",
        price: 1400,
        image:
          "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
        available: true,
        featured: false,
        category: "Pastries",
      },
      // Small Chops Platter
      {
        name: "Honey Luxe Special Platter",
        slug: "honey-luxe-special",
        description:
          "6 mini meat pie, 10 samosa, 10 spring roll, 20 puff puff, 4 stick meat, 4 chicken",
        price: 3500,
        image:
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop",
        available: true,
        featured: true,
        category: "Nigerian Foods",
      },
      // Cakes
      {
        name: "Bento Cake - 4 Inch",
        slug: "bento-cake-4inch",
        description: "Adorable 4 inch bento cake",
        price: 2500,
        image:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
        available: true,
        featured: false,
        category: "Cakes",
      },
      {
        name: "Custom Cake - 6 Inch (2 Layers)",
        slug: "custom-cake-6inch",
        description: "6 inch, 2 layers, 1 flavor",
        price: 5000,
        image:
          "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=400&fit=crop",
        available: true,
        featured: false,
        category: "Cakes",
      },
      {
        name: "Custom Cake - 8 Inch (2 Layers)",
        slug: "custom-cake-8inch",
        description: "8 inch, 2 layers, 1 flavor",
        price: 7000,
        image:
          "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=400&fit=crop",
        available: true,
        featured: false,
        category: "Cakes",
      },
      {
        name: "Custom Cake - 10 Inch (3 Layers)",
        slug: "custom-cake-10inch",
        description: "10 inch, 3 layers, 1 flavor",
        price: 9500,
        image:
          "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=400&fit=crop",
        available: true,
        featured: false,
        category: "Cakes",
      },
    ];

    const now = Date.now();
    const ids = [];

    for (const product of products) {
      // Check if product already exists
      const existing = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", product.slug))
        .first();

      if (!existing) {
        const id = await ctx.db.insert("products", {
          ...product,
          createdAt: now,
          updatedAt: now,
        });
        ids.push(id);
      }
    }

    return {
      message: `Seeded ${ids.length} products successfully`,
      count: ids.length,
    };
  },
});

// Seed admin user
export const seedAdminUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      return {
        message: "Admin user already exists",
        userId: existing._id,
        email: existing.email,
      };
    }

    // Create user record (Convex Auth will handle password hashing)
    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name || "Admin User",
      role: "ADMIN",
      createdAt: now,
      updatedAt: now,
    });

    return {
      message: "Admin user created successfully. Use Convex Auth to sign in.",
      userId,
      email: args.email,
    };
  },
});

// Seed default settings
export const seedSettings = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("settings").first();

    if (existing) {
      return {
        message: "Settings already exist",
        settingsId: existing._id,
      };
    }

    const now = Date.now();
    const settingsId = await ctx.db.insert("settings", {
      deliveryFee: 50, // £50.00 in pounds
      freeDeliveryThreshold: 100, // £100.00 in pounds
      minOrderAmount: 5, // £5.00 minimum order
      taxRate: 0,
      currency: "GBP",
      storeName: "Honey Foods",
      storeEmail: "admin@honeyfoods.com",
      storePhone: undefined,
      storeAddress: undefined,
      storeTagline: undefined,
      createdAt: now,
      updatedAt: now,
    });

    return {
      message: "Settings created successfully",
      settingsId,
    };
  },
});
