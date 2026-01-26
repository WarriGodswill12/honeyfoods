import { config } from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import bcrypt from "bcryptjs";

// Load environment variables
config();
config({ path: ".env.local" });

async function createAdminUser() {
  const email = process.env.ADMIN_EMAIL || "admin@honeyfoods.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    throw new Error(
      "NEXT_PUBLIC_CONVEX_URL not found in environment variables",
    );
  }

  const convex = new ConvexHttpClient(convexUrl);

  try {
    // Check if admin already exists
    const existingAdmin = await convex.query(api.users.getUserByEmail, {
      email,
    });

    if (existingAdmin) {
      console.log(`Admin user already exists: ${email}`);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await convex.mutation(api.users.createUser, {
      email,
      name: "Admin",
      passwordHash: hashedPassword,
      role: "ADMIN" as const,
    });

    console.log(`Admin user created successfully: ${email}`);
    console.log(`Admin ID: ${admin}`);
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

createAdminUser();
