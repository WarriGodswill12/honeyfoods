/**
 * Script to list all orders with their pricing details
 *
 * Usage:
 * npx tsx scripts/list-orders.ts
 */

import * as dotenv from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

// Load environment variables
dotenv.config({ path: ".env.local" });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("Missing NEXT_PUBLIC_CONVEX_URL environment variable");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);
async function listOrders() {
  console.log("🔍 Fetching all orders...\n");

  try {
    const orders = await client.query(api.orders.getOrders, {});

    console.log(`📦 Found ${orders.length} orders:\n`);
    console.log("━".repeat(100));

    for (const order of orders) {
      console.log(`Order: ${order.orderNumber}`);
      console.log(`Customer: ${order.customerName}`);
      console.log(`Status: ${order.status} | Payment: ${order.paymentStatus}`);
      console.log(`Subtotal: £${order.subtotal.toFixed(2)}`);
      console.log(`Delivery: £${order.deliveryFee.toFixed(2)}`);
      console.log(`Total: £${order.total.toFixed(2)}`);

      if (order.deliveryFee >= 50) {
        console.log(`⚠️  WARNING: Delivery fee looks like it's in pence!`);
      }

      console.log("━".repeat(100));
    }

    // Summary
    const ordersWithPenceDelivery = orders.filter((o) => o.deliveryFee >= 50);
    if (ordersWithPenceDelivery.length > 0) {
      console.log(
        `\n⚠️  ${ordersWithPenceDelivery.length} order(s) have delivery fees >= £50 (likely stored in pence)`,
      );
    } else {
      console.log(`\n✅ All orders have reasonable delivery fees (<£50)`);
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

listOrders();
