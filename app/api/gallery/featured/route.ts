import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET featured gallery images for homepage slider
export async function GET(req: NextRequest) {
  try {
    const images = await prisma.galleryImage.findMany({
      where: {
        type: "gallery",
        featured: true,
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("Featured gallery GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured gallery images" },
      { status: 500 }
    );
  }
}
