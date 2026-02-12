// API route to mark pickup order as ready and notify customer
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { convexClient, api } from "@/lib/convex-server";
import { Id } from "@/convex/_generated/dataModel";
import { sendPickupReadyNotification } from "@/lib/email";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Verify admin authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 },
      );
    }

    const { id: orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 },
      );
    }

    // Fetch order details
    const order = await convexClient.query(api.orders.getOrderById, {
      id: orderId as Id<"orders">,
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify it's a pickup order
    if (order.deliveryMethod !== "PICKUP") {
      return NextResponse.json(
        { error: "This is not a pickup order" },
        { status: 400 },
      );
    }

    // Update order status to READY_FOR_PICKUP
    await convexClient.mutation(api.orders.updateOrderStatus, {
      id: orderId as Id<"orders">,
      status: "READY_FOR_PICKUP",
    });

    // Send notification email
    if (order.customerEmail) {
      await sendPickupReadyNotification({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Order marked as ready for pickup and customer notified",
    });
  } catch (error) {
    console.error("Error marking order ready for pickup:", error);
    return NextResponse.json(
      { error: "Failed to mark order as ready for pickup" },
      { status: 500 },
    );
  }
}
