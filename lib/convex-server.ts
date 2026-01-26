import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
}

// Create a server-side Convex client for API routes
export const convexClient = new ConvexHttpClient(convexUrl);

// Export API for convenience
export { api };
