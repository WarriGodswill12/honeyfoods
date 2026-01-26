// Verify Stripe payment
import { NextRequest, NextResponse } from "next/server";
import { StripeProvider } from "@/services/payment/stripe-provider";
import { convexClient, api } from "@/lib/convex-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentIntentId } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Missing payment intent ID" },
        { status: 400 },
      );
    }

    // Verify payment with Stripe
    const stripeProvider = new StripeProvider();
    const verification = await stripeProvider.verifyPayment(paymentIntentId);

    if (verification.verified) {
      // Get payment record
      const payment = await convexClient.query(
        api.payments.getPaymentByStripeId,
        { stripePaymentIntentId: paymentIntentId },
      );

      if (!payment) {
        return NextResponse.json(
          { error: "Payment record not found" },
          { status: 404 },
        );
      }

      // Get order details
      const order = await convexClient.query(api.orders.getOrderById, {
        id: payment.orderId,
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
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
          stripePaymentIntentId: verification.transactionId!,
        }),
      ]);

      return NextResponse.json({
        success: true,
        verified: true,
        orderId: payment.orderId,
        orderNumber: order.orderNumber,
      });
    }

    return NextResponse.json({
      success: false,
      verified: false,
      message: "Payment not yet completed",
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
