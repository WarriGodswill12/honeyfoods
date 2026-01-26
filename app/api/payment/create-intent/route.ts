// Create Stripe payment intent
import { NextRequest, NextResponse } from "next/server";
import { StripeProvider } from "@/services/payment/stripe-provider";
import { convexClient, api } from "@/lib/convex-server";
import { rateLimit, isValidEmail } from "@/lib/security";
import { Id } from "@/convex/_generated/dataModel";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 requests per 10 minutes per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const key = `create-payment-intent:${ip}`;
    if (!rateLimit({ key, limit: 10, windowMs: 10 * 60 * 1000 })) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { orderId, customerEmail } = body;

    // Input validation
    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    if (
      !customerEmail ||
      typeof customerEmail !== "string" ||
      !isValidEmail(customerEmail)
    ) {
      return NextResponse.json(
        { error: "Invalid customer email" },
        { status: 400 },
      );
    }

    // Get order details
    const order = await convexClient.query(api.orders.getOrderById, {
      id: orderId as Id<"orders">,
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Create payment intent with Stripe
    const stripeProvider = new StripeProvider();
    const paymentIntent = await stripeProvider.createPaymentIntent({
      amount: Math.round(order.total * 100), // Convert pounds to pence for Stripe
      currency: "gbp", // UK pounds
      orderId: order._id,
      customerEmail,
      metadata: {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
      },
    });

    // Store payment record
    await convexClient.mutation(api.payments.createPayment, {
      orderId: order._id,
      amount: order.total,
      currency: "GBP",
      provider: "stripe",
      providerPaymentId: paymentIntent.id,
      status: "PENDING",
    });

    return NextResponse.json({
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment intent" },
      { status: 500 },
    );
  }
}
