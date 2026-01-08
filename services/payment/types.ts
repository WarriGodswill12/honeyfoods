// Payment service types and interfaces

export interface CreatePaymentParams {
  amount: number; // in cents
  currency: string;
  orderId: string;
  customerEmail: string;
  metadata?: Record<string, any>;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "succeeded" | "failed";
}

export interface PaymentVerification {
  verified: boolean;
  status: "PAID" | "PENDING" | "FAILED";
  transactionId?: string;
  metadata?: any;
}

export interface WebhookResult {
  orderId: string;
  status: "PAID" | "PENDING" | "FAILED";
  transactionId: string;
}

export interface PaymentProvider {
  name: string;
  createPaymentIntent(params: CreatePaymentParams): Promise<PaymentIntent>;
  verifyPayment(paymentId: string): Promise<PaymentVerification>;
  handleWebhook(payload: any, signature?: string): Promise<WebhookResult>;
}
