// Verify Stripe payment
import { NextRequest, NextResponse } from "next/server";
import { StripeProvider } from "@/services/payment/stripe-provider";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentIntentId } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Missing payment intent ID" },
        { status: 400 }
      );
    }

    // Verify payment with Stripe
    const stripeProvider = new StripeProvider();
    const verification = await stripeProvider.verifyPayment(paymentIntentId);

    if (verification.verified) {
      // Get payment record
      const payment = await prisma.payment.findFirst({
        where: { providerPaymentId: paymentIntentId },
        include: { order: true },
      });

      if (!payment) {
        return NextResponse.json(
          { error: "Payment record not found" },
          { status: 404 }
        );
      }

      // Update order and payment status
      await prisma.$transaction([
        prisma.order.update({
          where: { id: payment.orderId },
          data: {
            paymentStatus: "PAID",
            status: "CONFIRMED",
          },
        }),
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "PAID",
            providerPaymentId: verification.transactionId!,
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        verified: true,
        orderId: payment.orderId,
        orderNumber: payment.order.orderNumber,
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
      }
    );
  }
}
