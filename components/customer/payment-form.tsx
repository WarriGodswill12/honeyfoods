// Apple Pay button component using Stripe Payment Elements
"use client";

import { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CreditCard } from "lucide-react";

interface PaymentFormProps {
  orderId: string;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
}

export function PaymentForm({ orderId, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      // Confirm payment with return_url for redirect-based methods
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation?orderId=${orderId}`,
        },
        redirect: "if_required",
      });

      if (error) {
        setMessage(error.message || "An error occurred");
        onError(error.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Verify payment on server
        const verifyResponse = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
        });

        const verifyData = await verifyResponse.json();

        if (verifyData.verified) {
          onSuccess(orderId);
        } else {
          onError("Payment verification failed");
        }
      }
    } catch (err: any) {
      setMessage(err.message);
      onError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
          paymentMethodOrder: [
            "apple_pay",
            "google_pay",
            "amazon_pay",
            "revolut_pay",
            "card",
          ],
        }}
      />

      {message && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {message}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full text-lg py-6"
        size="lg"
      >
        {isProcessing ? (
          <>
            <LoadingSpinner />
            <span className="ml-2">Processing...</span>
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Pay Now
          </>
        )}
      </Button>
    </form>
  );
}
