import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { sendEarlyAccessApprovalEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

// Validation schema for the approval action
const approvalSchema = z.object({
  approved: z.boolean(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check admin access - this will throw if not admin
    await requireAdmin();

    const { id } = await params;
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

    // Send approval email if approved
    if (approved && !existingRequest.approved) {
      try {
        await sendEarlyAccessApprovalEmail(
          updatedRequest.name,
          updatedRequest.email,
        );
      } catch (error) {
        console.error("Failed to send approval email:", error);
        // Continue with the response even if email fails
      }
    }

    return NextResponse.json({
      message: `Request ${approved ? "approved" : "rejected"} successfully`,
      request: updatedRequest,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check admin access - this will throw if not admin
    await requireAdmin();

    const { id } = await params;

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

    // Use a transaction to delete both the early access request and the user
    await prisma.$transaction(async (prisma) => {
      // Delete the early access request
      await prisma.earlyAccessRequest.delete({
        where: { id },
      });

      // Delete the corresponding user if one exists
      const existingUser = await prisma.user.findUnique({
        where: { email: existingRequest.email },
      });

      if (existingUser) {
        await prisma.user.delete({
          where: { email: existingRequest.email },
        });
      }
    });

    return NextResponse.json({
      message: "Request and associated user deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    console.error("Error deleting early access request:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
