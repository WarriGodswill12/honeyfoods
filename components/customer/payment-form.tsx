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
  const [isReady, setIsReady] = useState(false);

  // Wait for Stripe Elements to be ready
  useEffect(() => {
    if (!stripe || !elements) {
      return;
    }

    // Wait for PaymentElement to be ready
    const checkReady = async () => {
      try {
        // Elements are available, mark as ready
        setIsReady(true);
      } catch (err) {
        console.error("Error checking elements ready state:", err);
      }
    };

    checkReady();
  }, [stripe, elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      const errorMsg = "Payment system is not ready. Please refresh the page and try again.";
      setMessage(errorMsg);
      onError(errorMsg);
      return;
    }

    if (!isReady) {
      const errorMsg = "Payment form is still loading. Please wait a moment.";
      setMessage(errorMsg);
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      // Submit the form to ensure all fields are filled
      const { error: submitError } = await elements.submit();
      
      if (submitError) {
        setMessage(submitError.message || "Please check your payment details");
        onError(submitError.message || "Payment validation failed");
        setIsProcessing(false);
        return;
      }

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
      {!isReady && (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
          <span className="ml-2 text-gray-600">Loading payment form...</span>
        </div>
      )}
      
      <PaymentElement
        onReady={() => setIsReady(true)}
        options={{
          layout: "tabs",
          paymentMethodOrder: ["apple_pay", "google_pay", "card"],
        }}
      />

      {message && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {message}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || !isReady || isProcessing}
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
