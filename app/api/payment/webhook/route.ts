// Stripe webhook handler
import { NextRequest, NextResponse } from "next/server";
import { StripeProvider } from "@/services/payment/stripe-provider";
import { convexClient, api } from "@/lib/convex-server";
import { rateLimit } from "@/lib/security";
import { Id } from "@/convex/_generated/dataModel";
import { sendOrderReceipt, sendAdminNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 30 requests per 10 minutes per IP (webhooks can be bursty)
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const key = `webhook:${ip}`;
    if (!rateLimit({ key, limit: 30, windowMs: 10 * 60 * 1000 })) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    // Security: Validate webhook signature
    if (!signature) {
      console.warn("Webhook attempt without signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate webhook secret is configured
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // Handle webhook
    const stripeProvider = new StripeProvider();
    const result = await stripeProvider.handleWebhook(body, signature);

    console.log("[Webhook] Processing event:", {
      transactionId: result.transactionId,
      status: result.status,
      orderId: result.orderId,
    });

    // Get payment record by Stripe ID
    const payment = await convexClient.query(
      api.payments.getPaymentByStripeId,
      { stripePaymentIntentId: result.transactionId },
    );

    console.log("[Webhook] Payment record lookup:", {
      transactionId: result.transactionId,
      found: !!payment,
      paymentId: payment?._id,
    });

    if (!payment) {
      console.error(
        "[Webhook] Payment not found for transaction:",
        result.transactionId,
      );
      return NextResponse.json({ received: true }); // Still return success to Stripe
    }

    // Update order and payment status
    await Promise.all([
      convexClient.mutation(api.orders.updatePaymentStatus, {
        id: result.orderId as Id<"orders">,
        paymentStatus: result.status === "PAID" ? "PAID" : "FAILED",
      }),
      convexClient.mutation(api.orders.updateOrderStatus, {
        id: result.orderId as Id<"orders">,
        status: result.status === "PAID" ? "CONFIRMED" : "CANCELLED",
      }),
      convexClient.mutation(api.payments.updatePayment, {
        id: payment._id,
        status: result.status,
        providerPaymentId: result.transactionId,
      }),
    ]);

    console.log("[Webhook] Successfully updated order and payment:", {
      orderId: result.orderId,
      paymentId: payment._id,
      status: result.status,
    });

    // Send emails if payment was successful
    if (result.status === "PAID") {
      try {
        // Get full order details with items for email
        const order = await convexClient.query(api.orders.getOrderById, {
          id: result.orderId as Id<"orders">,
        });

        if (order) {
          // Get order items
          const orderItems = await convexClient.query(
            api.orderItems.getOrderItems,
            { orderId: result.orderId as Id<"orders"> },
          );

          const emailData = {
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerEmail: order.customerEmail || "",
            customerPhone: order.customerPhone,
            deliveryAddress: order.deliveryAddress,
            customNote: order.customNote || undefined,
            items: orderItems.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.subtotal,
              flavor: item.selectedFlavor || undefined,
            })),
            subtotal: order.subtotal,
            deliveryFee: order.deliveryFee,
            total: order.total,
            createdAt: new Date(order.createdAt).toISOString(),
          };

          // Send emails (don't block webhook response)
          Promise.all([
            sendOrderReceipt(emailData),
            sendAdminNotification(emailData),
          ])
            .then(([customerSent, adminSent]) => {
              console.log("[Webhook] Email notifications sent:", {
                customerEmail: customerSent,
                adminEmail: adminSent,
              });
            })
            .catch((emailError) => {
              console.error(
                "[Webhook] Error sending email notifications:",
                emailError,
              );
            });
        }
      } catch (emailError) {
        console.error("[Webhook] Error preparing email:", emailError);
        // Don't fail the webhook if email fails
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook handler failed" },
      { status: 400 },
    );
  }
}
