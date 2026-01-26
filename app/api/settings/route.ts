import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { convexClient, api } from "@/lib/convex-server";

export async function GET() {
  try {
    // Get settings
    const settings = await convexClient.query(api.settings.getSettings);

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 },
      );
    }

    const body = await request.json();

    // Validate integer fields
    const intFields = [
      "deliveryFee",
      "freeDeliveryThreshold",
      "minOrderAmount",
    ];

    for (const field of intFields) {
      if (body[field] !== undefined) {
        const value = Number(body[field]);
        if (!Number.isInteger(value) || value < 0) {
          return NextResponse.json(
            { error: `${field} must be a non-negative integer` },
            { status: 400 },
          );
        }
      }
    }

    // Get or create settings
    const currentSettings = await convexClient.query(api.settings.getSettings);

    // Update settings
    await convexClient.mutation(api.settings.updateSettings, body);

    // Fetch updated settings
    const settings = await convexClient.query(api.settings.getSettings);

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
