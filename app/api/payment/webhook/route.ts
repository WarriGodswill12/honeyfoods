// Stripe webhook handler
import { NextRequest, NextResponse } from "next/server";
import { StripeProvider } from "@/services/payment/stripe-provider";
import { prisma } from "@/lib/prisma";

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
        { status: 500 }
      );
    }

    // Handle webhook
    const stripeProvider = new StripeProvider();
    const result = await stripeProvider.handleWebhook(body, signature);

    // Update order and payment status
    await prisma.$transaction([
      prisma.order.update({
        where: { id: result.orderId },
        data: {
          paymentStatus: result.status === "PAID" ? "PAID" : "FAILED",
          status: result.status === "PAID" ? "CONFIRMED" : "CANCELLED",
        },
      }),
      prisma.payment.updateMany({
        where: { orderId: result.orderId },
        data: {
          status: result.status,
          providerPaymentId: result.transactionId,
        },
      }),
    ]);

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook handler failed" },
      { status: 400 }
    );
  }
}
