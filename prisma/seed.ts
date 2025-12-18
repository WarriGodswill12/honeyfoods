// Seed script for initial data
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@honeyfoods.com" },
    update: {},
    create: {
      email: "admin@honeyfoods.com",
      name: "Admin User",
      passwordHash: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✓ Created admin user:", admin.email);

  // Clear existing products
  await prisma.product.deleteMany({});
  console.log("✓ Cleared existing products");

  // Create menu products
  // Using placeholder images - admin can replace with real photos later
  const products = [
    // 1 Litre Bowl Rice
    {
      name: "Jollof Rice - 1 Litre Bowl",
      slug: "jollof-rice-1l",
      description: "Delicious 1 litre bowl of our signature Jollof Rice",
      price: 15,
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop",
      available: true,
      featured: true,
      category: "Rice (1 Litre)",
    },
    {
      name: "Fried Rice - 1 Litre Bowl",
      slug: "fried-rice-1l",
      description: "Flavorful 1 litre bowl of Fried Rice",
      price: 17,
      image:
        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop",
      available: true,
      featured: true,
      category: "Rice (1 Litre)",
    },
    {
      name: "Coconut Rice - 1 Litre Bowl",
      slug: "coconut-rice-1l",
      description: "Aromatic 1 litre bowl of Coconut Rice",
      price: 20,
      image:
        "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=400&fit=crop",
      available: true,
      featured: true,
      category: "Rice (1 Litre)",
    },

    // 2 Litres Rice
    {
      name: "Jollof Rice - 2 Litres",
      slug: "jollof-rice-2l",
      description: "Large 2 litres bowl of our signature Jollof Rice",
      price: 30,
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop",
      available: true,
      featured: false,
      category: "Rice (2 Litres)",
    },
    {
      name: "Fried Rice - 2 Litres",
      slug: "fried-rice-2l",
      description: "Large 2 litres bowl of Fried Rice",
      price: 32,
      image:
        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop",
      available: true,
      featured: false,
      category: "Rice (2 Litres)",
    },
    {
      name: "Coconut Rice - 2 Litres",
      slug: "coconut-rice-2l",
      description: "Large 2 litres bowl of Coconut Rice",
      price: 35,
      image:
        "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=400&fit=crop",
      available: true,
      featured: false,
      category: "Rice (2 Litres)",
    },

    // Proteins
    {
      name: "Turkey - 5 Pieces",
      slug: "turkey-5pcs",
      description: "Perfectly seasoned turkey, 5 pieces",
      price: 20,
      image:
        "https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=400&h=400&fit=crop",
      available: true,
      featured: false,
      category: "Proteins",
    },
    {
      name: "Chicken - 5 Pieces",
      slug: "chicken-5pcs",
      description: "Juicy grilled chicken, 5 pieces",
      price: 15,
      image:
        "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=400&fit=crop",
      available: true,
      featured: false,
      category: "Proteins",
    },
    {
      name: "Fish - 5 Pieces",
      slug: "fish-5pcs",
      description: "Fresh fish, 5 pieces",
      price: 15,
      image:
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=400&fit=crop",
      available: true,
      featured: false,
      category: "Proteins",
    },

    // Regular Pastries (MOQ 6)
    {
      name: "Meat Pie (Regular)",
      slug: "meat-pie-regular",
      description: "£2 each - Minimum order 6 pieces",
      price: 2,
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
      price: 2,
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
      price: 2,
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
      available: true,
      featured: false,
      category: "Pastries",
    },

    // Mini Pastries (MOQ 8)
    {
      name: "Mini Meat Pie",
      slug: "mini-meat-pie",
      description: "£1.50 each - Minimum order 8 pieces",
      price: 1.5,
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
      available: true,
      featured: false,
      category: "Mini Pastries",
    },
    {
      name: "Mini Chicken Pie",
      slug: "mini-chicken-pie",
      description: "£1.50 each - Minimum order 8 pieces",
      price: 1.5,
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
      available: true,
      featured: false,
      category: "Mini Pastries",
    },

    // Puff Puff
    {
      name: "Puff Puff - Single",
      slug: "puff-puff-single",
      description: "£0.50 each",
      price: 0.5,
      image:
        "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
      available: true,
      featured: false,
      category: "Snacks",
    },
    {
      name: "Puff Puff - 15 Pieces",
      slug: "puff-puff-15pcs",
      description: "Pack of 15 puff puff",
      price: 7,
      image:
        "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
      available: true,
      featured: false,
      category: "Snacks",
    },
    {
      name: "Puff Puff - 30 Pieces",
      slug: "puff-puff-30pcs",
      description: "Pack of 30 puff puff",
      price: 14,
      image:
        "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
      available: true,
      featured: false,
      category: "Snacks",
    },

    // Small Chops Platter
    {
      name: "Honey Luxe Special Platter",
      slug: "honey-luxe-special",
      description:
        "6 mini meat pie, 10 samosa, 10 spring roll, 20 puff puff, 4 stick meat, 4 chicken",
      price: 35,
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop",
      available: true,
      featured: true,
      category: "Platters",
    },

    // Cakes
    {
      name: "Bento Cake - 4 Inch",
      slug: "bento-cake-4inch",
      description: "Adorable 4 inch bento cake",
      price: 25,
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
      price: 50,
      image:
        "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=400&fit=crop",
      available: true,
      featured: false,
      category: "Cakes",
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log("✓ Created sample products");
  console.log("\n=== Seed Complete ===");
  console.log("Admin Login:");
  console.log("Email: admin@honeyfoods.com");
  console.log("Password: admin123");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
