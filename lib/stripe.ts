// Stripe client configuration
import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

// Server-side Stripe instance - only initialize on server side
const getStripeInstance = () => {
  if (typeof window !== "undefined") {
    return null;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("STRIPE_SECRET_KEY is not configured");
    return null;
  }

  return new Stripe(secretKey, {
    apiVersion: "2025-12-15.clover",
    typescript: true,
    maxNetworkRetries: 2,
    timeout: 30000,
  });
};

export const stripe = getStripeInstance();

// Client-side Stripe instance
let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured");
      return null;
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};
