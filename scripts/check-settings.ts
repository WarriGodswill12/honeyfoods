/**
 * Script to check current settings values
 *
 * Usage:
 * npx tsx scripts/check-settings.ts
 */

import * as dotenv from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

// Load environment variables
dotenv.config({ path: ".env.local" });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("Missing NEXT_PUBLIC_CONVEX_URL environment variable");
  console.error(
    "Make sure you have a .env.local file with NEXT_PUBLIC_CONVEX_URL set",
  );
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function checkSettings() {
  console.log("🔍 Fetching current settings...\n");

  try {
    const settings = await client.query(api.settings.getSettings);

    console.log("📋 Current Settings:");
    console.log("━".repeat(50));
    console.log(`Delivery Fee: £${settings.deliveryFee || 0}`);
    console.log(
      `Free Delivery Threshold: £${settings.freeDeliveryThreshold || "Not set"}`,
    );
    console.log(`Currency: ${settings.currency || "GBP"}`);
    console.log(`Store Name: ${settings.storeName || "Not set"}`);
    console.log("━".repeat(50));

    if (settings.deliveryFee && settings.deliveryFee >= 50) {
      console.log(
        "\n⚠️  WARNING: Delivery fee looks like it's in pence (>= 50)!",
      );
      console.log(
        `   Current value: ${settings.deliveryFee} (£${settings.deliveryFee})`,
      );
      console.log(
        `   Should be: ${settings.deliveryFee / 100} (£${settings.deliveryFee / 100})`,
      );
      console.log("\n💡 TO FIX:");
      console.log("   1. Go to /admin/settings in your browser");
      console.log(
        `   2. Change Delivery Fee to: ${settings.deliveryFee / 100}`,
      );
      console.log("   3. Click 'Save Settings'");
    } else {
      console.log("\n✅ Delivery fee is correctly set in pounds!");
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkSettings();
