/**
 * Migration script to fix order prices that were calculated with pence instead of pounds
 *
 * This script will:
 * 1. Find all orders with suspiciously high delivery fees (>= 50, indicating they were in pence)
 * 2. Recalculate the correct delivery fee (in pounds)
 * 3. Update the order totals accordingly
 *
 * Run this script ONCE after fixing the settings to correct existing orders.
 *
 * Usage:
 * npx tsx scripts/fix-order-prices.ts
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

async function fixOrderPrices() {
  console.log("🔍 Fetching all orders...");

  try {
    // Fetch all orders (pass empty object for no filters)
    const orders = await client.query(api.orders.getOrders, {});

    console.log(`📦 Found ${orders.length} orders`);

    let fixedCount = 0;
    let skippedCount = 0;

    for (const order of orders) {
      // Check if delivery fee looks like it was in pence (>= 50)
      // Normal delivery fees should be around 5-15 pounds
      if (order.deliveryFee >= 50) {
        console.log(
          `\n⚠️  Order ${order.orderNumber} has suspicious delivery fee: £${order.deliveryFee}`,
        );

        // Convert delivery fee from pence to pounds (divide by 100)
        const correctDeliveryFee = order.deliveryFee / 100;

        // Recalculate total (subtotal should already be correct)
        const correctTotal = order.subtotal + correctDeliveryFee;

        console.log(
          `   Old: subtotal=£${order.subtotal}, delivery=£${order.deliveryFee}, total=£${order.total}`,
        );
        console.log(
          `   New: subtotal=£${order.subtotal}, delivery=£${correctDeliveryFee}, total=£${correctTotal}`,
        );

        try {
          // Apply the fix
          await client.mutation(api.orders.fixOrderPrices, {
            orderId: order._id,
            deliveryFee: correctDeliveryFee,
            total: correctTotal,
          });
          console.log(`   ✅ Fixed!`);
          fixedCount++;
        } catch (error) {
          console.error(`   ❌ Failed to fix:`, error);
        }
      } else {
        skippedCount++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Orders fixed: ${fixedCount}`);
    console.log(`   Orders already correct: ${skippedCount}`);

    if (fixedCount > 0) {
      console.log(`\n✅ Successfully fixed ${fixedCount} order(s)!`);
      console.log(
        `   Please refresh your admin dashboard to see the corrected prices.`,
      );
    } else {
      console.log(`\n✅ All orders already have correct pricing!`);
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Run the function and handle promise
fixOrderPrices()
  .then(() => {
    console.log("\n✨ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Script failed:", error);
    process.exit(1);
  });
