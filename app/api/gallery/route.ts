import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sanitizeString, sanitizeUrl } from "@/lib/sanitize";

// GET gallery images (all types or filtered)
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get("type");

    const images = await prisma.galleryImage.findMany({
      where: type ? { type } : {},
      orderBy: { order: "asc" },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("Gallery GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery images" },
      { status: 500 }
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
        { status: 401 }
      );
    }

    const body = await req.json();
    const { type = "gallery", url, alt, order } = body;

    if (!url || !alt) {
      return NextResponse.json(
        { error: "URL and alt text are required" },
        { status: 400 }
      );
    }

    // Sanitize inputs to prevent XSS
    const sanitizedUrl = sanitizeUrl(url);
    const sanitizedAlt = sanitizeString(alt);
    const sanitizedType = sanitizeString(type);

    const image = await prisma.galleryImage.create({
      data: {
        type: sanitizedType,
        url: sanitizedUrl,
        alt: sanitizedAlt,
        order: order ?? 0,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Gallery POST error:", error);
    return NextResponse.json(
      { error: "Failed to create gallery image" },
      { status: 500 }
    );
  }
}
