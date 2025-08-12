import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

// Validation schema matching the form
const earlyAccessSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = earlyAccessSchema.parse(body);

    // Check if email already exists
    const existingRequest = await prisma.earlyAccessRequest.findUnique({
      where: { email: validatedData.email },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "Your email is already submitted for early access" },
        { status: 409 },
      );
    }

    // Create the early access request
    const earlyAccessRequest = await prisma.earlyAccessRequest.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        message: validatedData.message,
      },
    });

    return NextResponse.json(
      {
        message: "Early access request submitted successfully",
        id: earlyAccessRequest.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error submitting early access request:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
