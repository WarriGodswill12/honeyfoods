import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { convexClient, api } from "@/lib/convex-server";

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as any;
    const limit = parseInt(searchParams.get("limit") || "100");

    // Fetch orders
    const orders = await convexClient.query(api.orders.getOrders, {
      status: status || undefined,
      limit,
    });

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await convexClient.query(api.orderItems.getOrderItems, {
          orderId: order._id,
        });
        return { ...order, orderItems: items };
      }),
    );

    // Calculate statistics
    const stats = await convexClient.query(api.orders.getOrderStats);

    const pendingOrders = orders.filter((o) => o.status === "PENDING");

    return NextResponse.json({
      orders: ordersWithItems,
      stats: {
        totalOrders: stats.totalOrders || 0,
        totalRevenue: stats.totalRevenue || 0,
        pendingOrders: pendingOrders.length,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
