import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

// Validation schema for the approval action
const approvalSchema = z.object({
  approved: z.boolean(),
});

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate the request body
    const { approved } = approvalSchema.parse(body);

    // Check if the request exists
    const existingRequest = await prisma.earlyAccessRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: "Early access request not found" },
        { status: 404 },
      );
    }

    // Update the approval status
    const updatedRequest = await prisma.earlyAccessRequest.update({
      where: { id },
      data: { approved },
    });

    return NextResponse.json({
      message: `Request ${approved ? "approved" : "rejected"} successfully`,
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating early access request:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
