// Seed script for initial data
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("Starting seed...");

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@honeyfoods.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin User",
      passwordHash: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✓ Created admin user:", admin.email);

  // Clear existing data (in correct order to avoid foreign key constraints)
  await prisma.orderItem.deleteMany({});
  await prisma.product.deleteMany({});
  console.log("✓ Cleared existing products");

  // No products are seeded. All products have been cleared.
  console.log("✓ No products seeded. All products have been cleared.");

  console.log("\n=== Seed Complete ===");
  console.log("Admin Login:");
  console.log("Email:", process.env.ADMIN_EMAIL || "admin@honeyfoods.com");
  console.log("Password:", process.env.ADMIN_PASSWORD || "admin123");
}

main().catch((e) => {
  console.error("Error during seed:", e);
  process.exit(1);
});
