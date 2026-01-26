import { config } from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import bcrypt from "bcryptjs";

// Load environment variables
config();
config({ path: ".env.local" });

async function testAdminLogin() {
  const email = "admin@honeyfoods.com";
  const password = "admin123";

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL not found");
  }

  console.log("Connecting to Convex:", convexUrl);
  const convex = new ConvexHttpClient(convexUrl);

  try {
    console.log("\nSearching for user with email:", email);
    const user = await convex.query(api.users.getUserByEmail, { email });

    if (!user) {
      console.error("❌ User not found!");
      return;
    }

    console.log("✅ User found!");
    console.log("User ID:", user._id);
    console.log("User Email:", user.email);
    console.log("User Name:", user.name);
    console.log("User Role:", user.role);
    console.log("Full user object:", JSON.stringify(user, null, 2));

    if (!user.passwordHash) {
      console.error("❌ User has no passwordHash field!");
      return;
    }

    console.log("Password Hash:", user.passwordHash.substring(0, 20) + "...");

    console.log("\nTesting password:", password);
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (isValidPassword) {
      console.log("✅ Password is correct!");
    } else {
      console.error("❌ Password is incorrect!");

      // Try to rehash and compare
      console.log("\nGenerating new hash for comparison:");
      const newHash = await bcrypt.hash(password, 10);
      console.log("New hash:", newHash.substring(0, 20) + "...");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testAdminLogin();
