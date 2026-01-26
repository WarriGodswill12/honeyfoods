import { config } from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import bcrypt from "bcryptjs";

// Load environment variables
config();
config({ path: ".env.local" });

async function updateAdminPassword() {
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

    console.log("✅ User found! ID:", user._id);

    // Hash the password
    console.log("\nHashing password...");
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("Password hash generated");

    // Update the user with the password hash
    console.log("\nUpdating user with password hash...");
    await convex.mutation(api.users.updateUser, {
      id: user._id,
      passwordHash,
    });

    console.log("✅ User password updated successfully!");
    console.log("\nYou can now log in with:");
    console.log("Email:", email);
    console.log("Password:", password);
  } catch (error) {
    console.error("Error:", error);
  }
}

updateAdminPassword();
