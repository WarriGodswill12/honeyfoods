// Create Stripe payment intent
import { NextRequest, NextResponse } from "next/server";
import { StripeProvider } from "@/services/payment/stripe-provider";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, customerEmail } = body;

    // Input validation
    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    if (!customerEmail || typeof customerEmail !== "string") {
      return NextResponse.json(
        { error: "Invalid customer email" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Create payment intent with Stripe
    const stripeProvider = new StripeProvider();
    const paymentIntent = await stripeProvider.createPaymentIntent({
      amount: order.total, // Already in pence
      currency: "gbp", // UK pounds
      orderId: order.id,
      customerEmail,
      metadata: {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
      },
    });

    // Store payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.total,
        currency: "GBP",
        provider: "stripe",
        providerPaymentId: paymentIntent.id,
        status: "PENDING",
      },
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
