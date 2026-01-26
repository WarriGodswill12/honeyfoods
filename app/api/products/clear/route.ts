import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { convexClient, api } from "@/lib/convex-server";

// DELETE /api/products/clear - Delete all products (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if any products have orders
    const orderCount = await convexClient.query(api.orderItems.countAll);

    if (orderCount > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete all products. Some products have existing orders.",
        },
        { status: 400 },
      );
    }

    // Delete all products
    const result = await convexClient.mutation(api.products.deleteAllProducts);

    return NextResponse.json({
      message: `Successfully deleted ${result.count} products`,
      count: result.count,
    });
  } catch (error) {
    console.error("Error deleting all products:", error);
    return NextResponse.json(
      { error: "Failed to delete products" },
      { status: 500 },
    );
  }
}
