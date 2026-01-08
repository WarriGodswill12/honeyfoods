// Stripe payment provider implementation
import { stripe } from "@/lib/stripe";
import type {
  PaymentProvider,
  CreatePaymentParams,
  PaymentIntent,
  PaymentVerification,
  WebhookResult,
} from "./types";

export class StripeProvider implements PaymentProvider {
  name = "stripe";

  async createPaymentIntent(
    params: CreatePaymentParams
  ): Promise<PaymentIntent> {
    if (!stripe) {
      throw new Error(
        "Stripe is not initialized. Check STRIPE_SECRET_KEY configuration."
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency,
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: params.customerEmail,
      metadata: {
        orderId: params.orderId,
        ...params.metadata,
      },
    });

    return {
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret!,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status as any,
    };
  }

  async verifyPayment(paymentId: string): Promise<PaymentVerification> {
    if (!stripe) {
      throw new Error(
        "Stripe is not initialized. Check STRIPE_SECRET_KEY configuration."
      );
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

    return {
      verified: paymentIntent.status === "succeeded",
      status: paymentIntent.status === "succeeded" ? "PAID" : "PENDING",
      transactionId: paymentIntent.id,
      metadata: paymentIntent.metadata,
    };
  }

  async handleWebhook(payload: any, signature: string): Promise<WebhookResult> {
    if (!stripe) {
      throw new Error(
        "Stripe is not initialized. Check STRIPE_SECRET_KEY configuration."
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as any;
      return {
        orderId: paymentIntent.metadata.orderId,
        status: "PAID",
        transactionId: paymentIntent.id,
      };
    }

    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as any;
      return {
        orderId: paymentIntent.metadata.orderId,
        status: "FAILED",
        transactionId: paymentIntent.id,
      };
    }

    throw new Error(`Unhandled webhook event type: ${event.type}`);
  }
}
