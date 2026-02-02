import { convexClient, api } from "@/lib/convex-server";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sanitizeString, sanitizeUrl } from "@/lib/sanitize";

// GET gallery images (all types or filtered)
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get("type") as any;

    const images = await convexClient.query(api.gallery.getGalleryImages, {
      type: type || undefined,
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("Gallery GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery images" },
      { status: 500 },
    );
  }
}

// POST new gallery image (admin only)
export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { type = "gallery", url, alt, order, featured = false } = body;

    if (!url || !alt) {
      return NextResponse.json(
        { error: "URL and alt text are required" },
        { status: 400 },
      );
    }

    // Sanitize inputs to prevent XSS
    const sanitizedUrl = sanitizeUrl(url);
    const sanitizedAlt = sanitizeString(alt);
    const sanitizedType = sanitizeString(type);

    const imageId = await convexClient.mutation(
      api.gallery.createGalleryImage,
      {
        type: sanitizedType,
        url: sanitizedUrl,
        alt: sanitizedAlt,
        featured: Boolean(featured),
      },
    );

    return NextResponse.json({ _id: imageId }, { status: 201 });
  } catch (error) {
    console.error("Gallery POST error:", error);
    return NextResponse.json(
      { error: "Failed to create gallery image" },
      { status: 500 },
    );
  }
}
