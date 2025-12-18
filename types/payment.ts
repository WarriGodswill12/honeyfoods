// TypeScript types for payment

export type PaymentProvider = "stripe" | "paystack" | "applepay";

export interface PaymentIntent {
  id: string;
  clientSecret?: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "succeeded" | "failed";
}

export interface CreatePaymentParams {
  amount: number;
  currency: string;
  orderId: string;
  metadata?: Record<string, any>;
}

export interface PaymentVerification {
  verified: boolean;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  transactionId?: string;
  metadata?: any;
}

export interface WebhookResult {
  orderId: string;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  transactionId: string;
}
