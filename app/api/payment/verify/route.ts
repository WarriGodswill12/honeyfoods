// Verify Stripe payment
import { NextRequest, NextResponse } from "next/server";
import { StripeProvider } from "@/services/payment/stripe-provider";
import { convexClient, api } from "@/lib/convex-server";
import { rateLimit } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 requests per 10 minutes per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const key = `verify-payment:${ip}`;
    if (!rateLimit({ key, limit: 10, windowMs: 10 * 60 * 1000 })) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { paymentIntentId } = body;

    if (!paymentIntentId || typeof paymentIntentId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid payment intent ID" },
        { status: 400 },
      );
    }

    // Verify payment with Stripe
    const stripeProvider = new StripeProvider();
    const verification = await stripeProvider.verifyPayment(paymentIntentId);

    console.log("[Verify] Payment verification result:", {
      paymentIntentId,
      verified: verification.verified,
      status: verification.status,
    });

    if (verification.verified) {
      // Get payment record
      const payment = await convexClient.query(
        api.payments.getPaymentByStripeId,
        { stripePaymentIntentId: paymentIntentId },
      );

      console.log("[Verify] Payment record lookup:", {
        paymentIntentId,
        found: !!payment,
        paymentId: payment?._id,
      });

      if (!payment) {
        console.error(
          "[Verify] Payment record not found for intent:",
          paymentIntentId,
        );
        return NextResponse.json(
          {
            error:
              "Payment record not found in database. Your payment was successful but we couldn't locate the order. Please contact support with this payment ID: " +
              paymentIntentId,
            paymentIntentId,
          },
          { status: 404 },
        );
      }

      // Get order details
      const order = await convexClient.query(api.orders.getOrderById, {
        id: payment.orderId,
      });

      console.log("[Verify] Order lookup:", {
        orderId: payment.orderId,
        found: !!order,
        orderNumber: order?.orderNumber,
      });

      if (!order) {
        console.error("[Verify] Order not found:", payment.orderId);
        return NextResponse.json(
          {
            error: "Order not found. Please contact support.",
          },
          { status: 404 },
        );
      }

      // Update order and payment status
      await Promise.all([
        convexClient.mutation(api.orders.updatePaymentStatus, {
          id: payment.orderId,
          paymentStatus: "PAID",
        }),
        convexClient.mutation(api.orders.updateOrderStatus, {
          id: payment.orderId,
          status: "CONFIRMED",
        }),
        convexClient.mutation(api.payments.updatePayment, {
          id: payment._id,
          status: "PAID",
          providerPaymentId: verification.transactionId!,
        }),
      ]);

      return NextResponse.json({
        success: true,
        verified: true,
        orderId: payment.orderId,
        orderNumber: order.orderNumber,
      });
    }

    console.log("[Verify] Payment not yet completed:", {
      paymentIntentId,
      status: verification.status,
    });

    return NextResponse.json({
      success: false,
      verified: false,
      message:
        "Payment not yet completed. Current status: " + verification.status,
    });
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    // Don't expose internal error details to client
    return NextResponse.json(
      { error: "Failed to verify payment. Please try again." },
      {
        status: 500,
        headers: {
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "X-XSS-Protection": "1; mode=block",
        },
      },
    );
  }
}
