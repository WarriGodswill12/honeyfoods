// Stripe webhook redirect for backwards compatibility
// Redirects to the correct webhook endpoint at /api/payment/webhook
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.warn("[Deprecated] Webhook called at /api/stripe/webhook - redirecting to /api/payment/webhook");
  
  // Get the raw body and headers
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  
  // Forward to the correct endpoint
  const baseUrl = request.nextUrl.origin;
  const response = await fetch(`${baseUrl}/api/payment/webhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "stripe-signature": signature || "",
    },
    body: body,
  });
  
  const result = await response.json();
  return NextResponse.json(result, { status: response.status });
}
