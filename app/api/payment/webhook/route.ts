// Stripe webhook handler
import { NextRequest, NextResponse } from "next/server";
import { StripeProvider } from "@/services/payment/stripe-provider";
import { convexClient, api } from "@/lib/convex-server";
import { Id } from "@/convex/_generated/dataModel";

export async function POST(request: NextRequest) {
  try {
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

    // Get payment record by Stripe ID
    const payment = await convexClient.query(
      api.payments.getPaymentByStripeId,
      { stripePaymentIntentId: result.transactionId },
    );

    if (!payment) {
      console.error("Payment not found for transaction:", result.transactionId);
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
        stripePaymentIntentId: result.transactionId,
      }),
    ]);

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook handler failed" },
      { status: 400 },
    );
  }
}
