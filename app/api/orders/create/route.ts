// API route to create order and return order ID
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeString } from "@/lib/sanitize";

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

    // Sanitize string inputs to prevent XSS
    const sanitizedInfo = {
      fullName: sanitizeString(customerInfo.fullName).substring(0, 100),
      email: sanitizeString(customerInfo.email).toLowerCase().substring(0, 255),
      phone: sanitizeString(customerInfo.phone).substring(0, 20),
      address: sanitizeString(customerInfo.address).substring(0, 500),
      city: sanitizeString(customerInfo.city).substring(0, 100),
      postcode: sanitizeString(customerInfo.postcode).substring(0, 20),
      deliveryNotes: customerInfo.deliveryNotes
        ? sanitizeString(customerInfo.deliveryNotes).substring(0, 500)
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

    // SECURITY: Fetch actual product prices from database to prevent price manipulation
    const productsMap = new Map(existingProducts.map((p: any) => [p.id, p]));

    // Fetch full product details including prices
    const productsWithPrices = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        available: true,
      },
    });

    // Recalculate subtotal from actual database prices
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = productsWithPrices.find((p) => p.id === item.productId);

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 400 }
        );
      }

      if (!product.available) {
        return NextResponse.json(
          { error: `Product "${product.name}" is no longer available` },
          { status: 400 }
        );
      }

      // Use DATABASE price, not client-provided price
      const itemSubtotal = product.price * item.quantity;
      calculatedSubtotal += itemSubtotal;

      validatedItems.push({
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        price: product.price, // Database price
        subtotal: itemSubtotal,
      });
    }

    // Fetch delivery fee from settings
    const settings = await prisma.settings.findFirst();
    const calculatedDeliveryFee =
      calculatedSubtotal >= (settings?.freeDeliveryThreshold || 50)
        ? 0
        : settings?.deliveryFee || 5;

    const calculatedTotal = calculatedSubtotal + calculatedDeliveryFee;

    // SECURITY: Validate client-provided totals match server calculations
    // Allow 0.01 difference for floating point rounding
    if (
      Math.abs(calculatedSubtotal - subtotal) > 0.01 ||
      Math.abs(calculatedDeliveryFee - deliveryFee) > 0.01 ||
      Math.abs(calculatedTotal - total) > 0.01
    ) {
      console.error("Price mismatch detected:", {
        clientSubtotal: subtotal,
        serverSubtotal: calculatedSubtotal,
        clientDeliveryFee: deliveryFee,
        serverDeliveryFee: calculatedDeliveryFee,
        clientTotal: total,
        serverTotal: calculatedTotal,
      });

      return NextResponse.json(
        {
          error:
            "Price mismatch detected. Please refresh your cart and try again.",
        },
        { status: 400 }
      );
    }

    // Create order with server-validated data
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: sanitizedInfo.fullName,
        customerEmail: sanitizedInfo.email,
        customerPhone: sanitizedInfo.phone,
        deliveryAddress: `${sanitizedInfo.address}, ${sanitizedInfo.city}, ${sanitizedInfo.postcode}`,
        customNote: sanitizedInfo.deliveryNotes,
        subtotal: calculatedSubtotal, // Use server-calculated value
        deliveryFee: calculatedDeliveryFee, // Use server-calculated value
        total: calculatedTotal, // Use server-calculated value
        status: "PENDING",
        paymentStatus: "PENDING",
        orderItems: {
          create: validatedItems,
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
