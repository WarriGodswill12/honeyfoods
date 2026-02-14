// API route to create order and return order ID
import { NextRequest, NextResponse } from "next/server";
import { convexClient, api } from "@/lib/convex-server";
import { sanitizeString } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerInfo,
      deliveryMethod,
      items,
      subtotal,
      deliveryFee,
      total,
    } = body;

    // Comprehensive input validation
    if (!customerInfo || typeof customerInfo !== "object") {
      return NextResponse.json(
        { error: "Invalid customer information" },
        { status: 400 },
      );
    }

    // Validate delivery method
    if (!deliveryMethod || !["DELIVERY", "PICKUP"].includes(deliveryMethod)) {
      return NextResponse.json(
        { error: "Invalid delivery method" },
        { status: 400 },
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
        { status: 400 },
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

    // Filter out any undefined, null, or "undefined" string values
    const validProductIds = productIds.filter(
      (id: any) => id && id !== "undefined" && id !== "null",
    );

    if (validProductIds.length === 0) {
      console.error("No valid product IDs found in cart items:", items);
      return NextResponse.json(
        {
          error: "Invalid cart items. Please refresh your cart and try again.",
          debug: items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
          })),
        },
        { status: 400 },
      );
    }

    if (validProductIds.length !== productIds.length) {
      console.warn(
        "Some invalid product IDs filtered out:",
        productIds.filter((id: any) => !validProductIds.includes(id)),
      );
    }

    const existingProducts = await convexClient.query(
      api.products.getProductsByIds,
      { ids: validProductIds },
    );

    const existingProductIds = new Set(existingProducts.map((p) => p._id));
    const invalidProductIds = validProductIds.filter(
      (id: any) => !existingProductIds.has(id),
    );

    if (invalidProductIds.length > 0) {
      console.error("Invalid product IDs:", invalidProductIds);
      return NextResponse.json(
        {
          error:
            "Some products in your cart no longer exist. Please refresh and try again.",
          invalidProducts: invalidProductIds,
        },
        { status: 400 },
      );
    }

    // Fetch full product details including prices
    const productsWithPrices = existingProducts;

    // Recalculate subtotal from actual database prices
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = productsWithPrices.find((p) => p._id === item.productId);

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 400 },
        );
      }

      if (!product.available) {
        return NextResponse.json(
          { error: `Product "${product.name}" is no longer available` },
          { status: 400 },
        );
      }

      // Price is now in pounds in database
      const priceInPounds = product.price;
      const itemSubtotal = priceInPounds * item.quantity;
      calculatedSubtotal += itemSubtotal;

      validatedItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: priceInPounds,
        subtotal: itemSubtotal,
        selectedFlavor: item.flavor || undefined, // Include selected flavor if provided
        // Calendar info for cakes
        deliveryDate: item.deliveryDate
          ? sanitizeString(item.deliveryDate)
          : undefined,
        cakeTitle: item.cakeTitle ? sanitizeString(item.cakeTitle) : undefined,
        cakeNote: item.cakeNote ? sanitizeString(item.cakeNote) : undefined,
      });
    }

    // Fetch delivery fee from settings
    const settings = await convexClient.query(api.settings.getSettings, {});
    // No delivery fee for pickup orders
    const calculatedDeliveryFee =
      deliveryMethod === "PICKUP"
        ? 0
        : calculatedSubtotal >= (settings?.freeDeliveryThreshold || 100)
          ? 0
          : settings?.deliveryFee || 5; // £5.00 (in pounds, not pence)

    const calculatedTotal = calculatedSubtotal + calculatedDeliveryFee;

    // Validate client-provided totals match server calculations
    if (
      calculatedSubtotal !== subtotal ||
      calculatedDeliveryFee !== deliveryFee ||
      calculatedTotal !== total
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
        { status: 400 },
      );
    }

    // Create order with server-validated data
    const orderId = await convexClient.mutation(api.orders.createOrder, {
      orderNumber,
      customerName: sanitizedInfo.fullName,
      customerEmail: sanitizedInfo.email,
      customerPhone: sanitizedInfo.phone,
      deliveryMethod: deliveryMethod as "DELIVERY" | "PICKUP",
      deliveryAddress:
        deliveryMethod === "PICKUP"
          ? "PICKUP - Customer will collect from store"
          : `${sanitizedInfo.address}, ${sanitizedInfo.city}, ${sanitizedInfo.postcode}`,
      customNote: sanitizedInfo.deliveryNotes || undefined,
      subtotal: calculatedSubtotal,
      deliveryFee: calculatedDeliveryFee,
      total: calculatedTotal,
      items: validatedItems,
    });

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    console.error("Error stack:", error.stack);
    console.error("Error message:", error.message);
    console.error("Error name:", error.name);

    // In production, also log to help debug
    if (process.env.NODE_ENV === "production") {
      console.error("Full error object:", JSON.stringify(error, null, 2));
    }

    // Don't expose internal error details to client
    return NextResponse.json(
      { error: "Failed to create order. Please try again." },
      {
        status: 500,
        headers: {
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
        },
      },
    );
  }
}
