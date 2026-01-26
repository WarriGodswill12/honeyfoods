import { convexClient, api } from "@/lib/convex-server";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Id } from "@/convex/_generated/dataModel";

// GET, PATCH, DELETE single gallery image
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const image = await convexClient.query(api.gallery.getGalleryImageById, {
      id: id as Id<"galleryImages">,
    });

    if (!image) {
      return NextResponse.json(
        { error: "Gallery image not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error("Gallery GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery image" },
      { status: 500 },
    );
  }
}

// PATCH update gallery image
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Verify admin authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { type, url, alt, order, featured } = body;

    await convexClient.mutation(api.gallery.updateGalleryImage, {
      id: id as Id<"galleryImages">,
      ...(type && { type }),
      ...(url && { url }),
      ...(alt && { alt }),
      ...(order !== undefined && { order }),
      ...(featured !== undefined && { featured: Boolean(featured) }),
    });

    const image = await convexClient.query(api.gallery.getGalleryImageById, {
      id: id as Id<"galleryImages">,
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("Gallery PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update gallery image" },
      { status: 500 },
    );
  }
}

// DELETE gallery image
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Verify admin authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 },
      );
    }

    const { id } = await params;

    await convexClient.mutation(api.gallery.deleteGalleryImage, {
      id: id as Id<"galleryImages">,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery image" },
      { status: 500 },
    );
  }
}
