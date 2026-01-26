import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { convexClient, api } from "@/lib/convex-server";
import { slugify } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

// GET /api/products/[id] - Get a single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const product = await convexClient.query(api.products.getProductById, {
      id: id as Id<"products">,
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Map _id to id for backwards compatibility
    const mappedProduct = {
      ...product,
      id: product._id,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt),
    };

    return NextResponse.json(mappedProduct);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

// PUT /api/products/[id] - Update a product (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, category, image, featured, available } =
      body;

    const { id } = await params;

    // Check if product exists
    const existingProduct = await convexClient.query(
      api.products.getProductById,
      { id: id as Id<"products"> },
    );

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // If name changed, generate new slug and check for duplicates
    let slug = existingProduct.slug;
    if (name && name !== existingProduct.name) {
      slug = slugify(name);

      const slugExists = await convexClient.query(
        api.products.getProductBySlug,
        { slug },
      );

      if (slugExists && slugExists._id !== id) {
        return NextResponse.json(
          { error: "A product with this name already exists" },
          { status: 400 },
        );
      }
    }

    await convexClient.mutation(api.products.updateProduct, {
      id: id as Id<"products">,
      name,
      slug,
      description,
      price: price ? parseFloat(price) : undefined, // Store in pounds
      category,
      image:
        image || existingProduct.image || "/images/placeholder-product.svg",
      featured,
      available,
    });

    // Fetch updated product
    const product = await convexClient.query(api.products.getProductById, {
      id: id as Id<"products">,
    });

    // Map _id to id for backwards compatibility
    const mappedProduct = product
      ? {
          ...product,
          id: product._id,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt),
        }
      : null;

    return NextResponse.json(mappedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

// DELETE /api/products/[id] - Delete a product (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if product exists
    const product = await convexClient.query(api.products.getProductById, {
      id: id as Id<"products">,
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if product has orders
    const orderCount = await convexClient.query(
      api.orderItems.countByProductId,
      { productId: id as Id<"products"> },
    );

    if (orderCount > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete product with existing orders. Consider marking it as unavailable instead.",
        },
        { status: 400 },
      );
    }

    await convexClient.mutation(api.products.deleteProduct, {
      id: id as Id<"products">,
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
