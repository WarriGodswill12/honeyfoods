import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { rateLimit, isValidEmail, isValidPassword } from "@/lib/security";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 requests per 10 minutes per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const key = `register:${ip}`;
    if (!rateLimit({ key, limit: 5, windowMs: 10 * 60 * 1000 })) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 },
      );
    }
    if (!isValidPassword(password)) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await convex.query(api.users.getUserByEmail, {
      email,
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 },
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user in Convex
    const userId = await convex.mutation(api.users.createUser, {
      email,
      name,
      passwordHash,
      role: "ADMIN",
    });

    return NextResponse.json(
      { message: "User created successfully", userId },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
