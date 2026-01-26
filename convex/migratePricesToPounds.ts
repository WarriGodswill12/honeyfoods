/**
 * Migration script to convert all prices from pence to pounds
 *
 * This migration:
 * 1. Converts all product prices from pence to pounds (divides by 100)
 * 2. Converts all order amounts from pence to pounds
 * 3. Converts settings from pence to pounds
 * 4. Updates payment records
 *
 * Run this ONCE after deploying the pounds conversion changes
 *
 * Usage:
 * 1. Deploy this file to Convex
 * 2. Run: npx convex run migrate-prices-to-pounds:migrateAllPricesToPounds
 * 3. Verify the output
 */

import { mutation } from "./_generated/server";

export const migrateAllPricesToPounds = mutation({
  args: {},
  handler: async (ctx) => {
    const results = {
      products: 0,
      orders: 0,
      orderItems: 0,
      payments: 0,
      settings: 0,
      errors: [] as string[],
    };

    try {
      // 1. Migrate Products
      console.log("Migrating products...");
      const products = await ctx.db.query("products").collect();

      for (const product of products) {
        // Only migrate if price is greater than 100 (assume pence if > 100)
        // This avoids migrating legitimate high-value items like cakes at £70-95
        if (product.price > 100) {
          await ctx.db.patch(product._id, {
            price: product.price / 100,
            updatedAt: Date.now(),
          });
          results.products++;
          console.log(
            `Migrated product: ${product.name} (${product.price} -> ${product.price / 100})`,
          );
        }
      }

      // 2. Migrate Orders
      console.log("Migrating orders...");
      const orders = await ctx.db.query("orders").collect();

      for (const order of orders) {
        // Only migrate if total is greater than 10 (assume pence if > 10)
        if (order.total > 10) {
          await ctx.db.patch(order._id, {
            subtotal: order.subtotal / 100,
            deliveryFee: order.deliveryFee / 100,
            total: order.total / 100,
            updatedAt: Date.now(),
          });
          results.orders++;
          console.log(
            `Migrated order: ${order.orderNumber} (${order.total} -> ${order.total / 100})`,
          );
        }
      }

      // 3. Migrate Order Items
      console.log("Migrating order items...");
      const orderItems = await ctx.db.query("orderItems").collect();

      for (const item of orderItems) {
        // Only migrate if price is greater than 10 (assume pence if > 10)
        if (item.price > 10) {
          await ctx.db.patch(item._id, {
            price: item.price / 100,
            subtotal: item.subtotal / 100,
          });
          results.orderItems++;
          console.log(
            `Migrated order item: ${item.name} (${item.price} -> ${item.price / 100})`,
          );
        }
      }

      // 4. Migrate Payments
      console.log("Migrating payments...");
      const payments = await ctx.db.query("payments").collect();

      for (const payment of payments) {
        // Only migrate if amount is greater than 10 (assume pence if > 10)
        if (payment.amount > 10) {
          await ctx.db.patch(payment._id, {
            amount: payment.amount / 100,
            updatedAt: Date.now(),
          });
          results.payments++;
          console.log(
            `Migrated payment: ${payment._id} (${payment.amount} -> ${payment.amount / 100})`,
          );
        }
      }

      // 5. Migrate Settings
      console.log("Migrating settings...");
      const settings = await ctx.db.query("settings").first();

      if (settings) {
        // Only migrate if deliveryFee is greater than 10 (assume pence if > 10)
        if (settings.deliveryFee > 10) {
          await ctx.db.patch(settings._id, {
            deliveryFee: settings.deliveryFee / 100,
            freeDeliveryThreshold: settings.freeDeliveryThreshold
              ? settings.freeDeliveryThreshold / 100
              : undefined,
            updatedAt: Date.now(),
          });
          results.settings++;
          console.log(
            `Migrated settings: deliveryFee (${settings.deliveryFee} -> ${settings.deliveryFee / 100})`,
          );
        }
      }

      console.log("\n=== Migration Complete ===");
      console.log(`Products migrated: ${results.products}`);
      console.log(`Orders migrated: ${results.orders}`);
      console.log(`Order items migrated: ${results.orderItems}`);
      console.log(`Payments migrated: ${results.payments}`);
      console.log(`Settings migrated: ${results.settings}`);

      if (results.errors.length > 0) {
        console.log(`\nErrors encountered: ${results.errors.length}`);
        results.errors.forEach((error) => console.error(error));
      }

      return {
        success: true,
        message: "Migration completed successfully",
        results,
      };
    } catch (error: any) {
      console.error("Migration failed:", error);
      results.errors.push(error.message);

      return {
        success: false,
        message: "Migration failed",
        error: error.message,
        results,
      };
    }
  },
});

/**
 * Helper function to check if migration is needed
 * Improved logic: Check if ANY product price looks like pence (e.g., 1500, 200)
 * vs pounds (e.g., 15.00, 2.00). Products in pence are typically whole numbers > 50.
 */
export const checkMigrationStatus = mutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    const orders = await ctx.db.query("orders").collect();
    const settings = await ctx.db.query("settings").first();

    // More sophisticated check: pence values are typically whole numbers > 100
    // Pounds values have decimals or are whole numbers representing actual prices
    const productsThatNeedMigration = products.filter((p) => {
      // If it's a whole number greater than 100, it's likely in pence
      return Number.isInteger(p.price) && p.price > 100;
    });

    const ordersThatNeedMigration = orders.filter((o) => {
      return Number.isInteger(o.total) && o.total > 100;
    });

    const settingsNeedMigration =
      settings &&
      Number.isInteger(settings.deliveryFee) &&
      settings.deliveryFee > 100
        ? 1
        : 0;

    return {
      productsNeedMigration: productsThatNeedMigration.length,
      ordersNeedMigration: ordersThatNeedMigration.length,
      settingsNeedMigration,
      totalProducts: products.length,
      totalOrders: orders.length,
      productsToMigrate: productsThatNeedMigration.map((p) => ({
        name: p.name,
        price: p.price,
      })),
      ordersToMigrate: ordersThatNeedMigration.map((o) => ({
        orderNumber: o.orderNumber,
        total: o.total,
      })),
      message:
        productsThatNeedMigration.length +
          ordersThatNeedMigration.length +
          settingsNeedMigration >
        0
          ? "Migration needed - some prices are still in pence"
          : "Migration complete - all prices appear to be in pounds",
    };
  },
});
