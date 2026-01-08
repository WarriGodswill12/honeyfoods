// API route to create order and return order ID
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerInfo, items, subtotal, deliveryFee, total } = body;

    // Comprehensive input validation
    if (!customerInfo || typeof customerInfo !== "object") {
      return NextResponse.json(
        { error: "Invalid customer information" },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Validate amounts are numbers
    if (
      typeof subtotal !== "number" ||
      typeof deliveryFee !== "number" ||
      typeof total !== "number" ||
      subtotal < 0 ||
      deliveryFee < 0 ||
      total < 0
    ) {
      return NextResponse.json({ error: "Invalid amounts" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (customerInfo.email && !emailRegex.test(customerInfo.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Sanitize string inputs
    const sanitizedInfo = {
      fullName: String(customerInfo.fullName || "")
        .trim()
        .substring(0, 100),
      email: String(customerInfo.email || "")
        .trim()
        .toLowerCase()
        .substring(0, 255),
      phone: String(customerInfo.phone || "")
        .trim()
        .substring(0, 20),
      address: String(customerInfo.address || "")
        .trim()
        .substring(0, 500),
      city: String(customerInfo.city || "")
        .trim()
        .substring(0, 100),
      postcode: String(customerInfo.postcode || "")
        .trim()
        .substring(0, 20),
      deliveryNotes: customerInfo.deliveryNotes
        ? String(customerInfo.deliveryNotes).trim().substring(0, 500)
        : null,
    };

    // Generate order number
    const orderNumber = `HF${Date.now()}`;

    // Validate all product IDs exist in database
    const productIds = items.map((item: any) => item.productId);
    const existingProducts = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
      },
    });

    const existingProductIds = new Set(
      existingProducts.map((p: { id: string }) => p.id)
    );
    const invalidProductIds = productIds.filter(
      (id: string) => !existingProductIds.has(id)
    );

    if (invalidProductIds.length > 0) {
      console.error("Invalid product IDs:", invalidProductIds);
      return NextResponse.json(
        {
          error:
            "Some products in your cart no longer exist. Please refresh and try again.",
          invalidProducts: invalidProductIds,
        },
        { status: 400 }
      );
    }

    // Create order with sanitized data
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: sanitizedInfo.fullName,
        customerEmail: sanitizedInfo.email,
        customerPhone: sanitizedInfo.phone,
        deliveryAddress: `${sanitizedInfo.address}, ${sanitizedInfo.city}, ${sanitizedInfo.postcode}`,
        customNote: sanitizedInfo.deliveryNotes,
        subtotal,
        deliveryFee,
        total,
        status: "PENDING",
        paymentStatus: "PENDING",
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    // Don't expose internal error details
    return NextResponse.json(
      { error: "Failed to create order. Please try again." },
      {
        status: 500,
        headers: {
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
        },
      }
    );
  }
}
